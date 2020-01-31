"use strict";

const SPRITE_SIZE = 24;
var Animation = function (frame_set, delay) {

    this.count = 0;// Counts the number of game cycles since the last frame change.
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;// The frame's index in the current animation frame set.
    this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.

};

Animation.prototype = {

    /* This changes the current animation frame set. For example, if the current
    set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
    sets the delay. */
    change: function (frame_set, delay = 15) {

        if (this.frame_set !== frame_set) {// If the frame set is different:
            this.count = 0;// Reset the count.
            this.delay = delay;// Set the delay.
            this.frame_index = 0;// Start at the first frame in the new frame set.
            this.frame_set = frame_set;// Set the new frame set.
            this.frame = this.frame_set[this.frame_index];// Set the new frame value.
        }
    },

    /* Call this on each game cycle. */
    update: function () {

        this.count++;// Keep track of how many cycles have passed since the last frame change.

        if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

            this.count = 0;// Reset the count.
            /* If the frame index is on the last value in the frame set, reset to 0.
            If the frame index is not on the last value, just add 1 to it. */
            this.frame_index = (this.frame_index === this.frame_set.length - 1) ? 0 : this.frame_index + 1;
            this.frame = this.frame_set[this.frame_index];// Change the current frame value.

        }

    }

};

var viewbuffer, controller, display, loop, player, render, resize, sprite_sheet;

viewbuffer = document.createElement("canvas").getContext("2d");
display = document.querySelector("canvas").getContext("2d");

controller = {
    timeoutInSeconds: 0,
    left:  { active:false },
    right: { active:false },
    up:    { active:false },

    changeBehavior:function(event) {
        // First pick new timeout between 3 and 8 seconds:
        this.timeoutInSeconds = Math.floor((Math.random() * 6) + 3);
        let nextBehavior = Math.floor(Math.random() * 6);

        if(nextBehavior === 0) {
            controller.right.active = false;
            controller.up.active = false;
            controller.left.active = true;
        } else if (nextBehavior === 1) {
            controller.right.active = true;
            controller.up.active = false;
            controller.left.active = false;
        } else if (nextBehavior === 2) {
            controller.right.active = false;
            controller.up.active = true;
            controller.left.active = false;
        } else {
            controller.right.active = false;
            controller.up.active = false;
            controller.left.active = false;
        }
        let _t = this;
        setTimeout(function () {
            _t.changeBehavior()
        }, _t.timeoutInSeconds * 1000);
    }

};

/* The player object is just a rectangle with an animation object. */
player = {
    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: true,
    height: SPRITE_SIZE, width: SPRITE_SIZE,
    x: 0, y: 40 - 18,
    x_velocity: 0, y_velocity: 0
};

/* The sprite sheet object holds the sprite sheet graphic and some animation frame
sets. An animation frame set is just an array of frame values that correspond to
each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
sprite_sheet = {

    frame_sets: [[8, 9], [4, 6], [1, 3]],// standing still, walk right, walk left
    image: new Image()

};

loop = function (time_stamp) {
    if (controller.up.active && !player.jumping) {
        controller.up.active = false;
        player.jumping = true;
        player.y_velocity -= 2.5;

    }

    if (controller.left.active) {
        /* To change the animation, all you have to do is call animation.change. */
        player.animation.change(sprite_sheet.frame_sets[2], 15);
        player.x_velocity -= 0.05;
    }

    if (controller.right.active) {
        player.animation.change(sprite_sheet.frame_sets[1], 15);
        player.x_velocity += 0.05;
    }

    /* If you're just standing still, change the animation to standing still. */
    if (!controller.left.active && !controller.right.active) {
        player.animation.change(sprite_sheet.frame_sets[0], 20);
    }

    player.y_velocity += 0.25;

    player.x += player.x_velocity;
    player.y += player.y_velocity;
    player.x_velocity *= 0.9;
    player.y_velocity *= 0.9;

    if (player.y + player.height > viewbuffer.canvas.height - 2) {
        player.jumping = false;
        player.y = viewbuffer.canvas.height - 2 - player.height;
        player.y_velocity = 0;
    }

    if (player.x + player.width < 0) {
        player.x = viewbuffer.canvas.width;

    } else if (player.x > viewbuffer.canvas.width) {
        player.x = -player.width;
    }

    player.animation.update();

    render();

    window.requestAnimationFrame(loop);
};

render = function () {
    /* Draw the background. */
    viewbuffer.fillStyle = "#7ec0ff";
    viewbuffer.fillRect(0, 0, viewbuffer.canvas.width, viewbuffer.canvas.height);
    viewbuffer.strokeStyle = "#8ed0ff";
    viewbuffer.lineWidth = 10;
    viewbuffer.beginPath();
    viewbuffer.moveTo(0, 0);
    viewbuffer.bezierCurveTo(40, 20, 40, 0, 80, 0);
    viewbuffer.moveTo(0, 0);
    viewbuffer.bezierCurveTo(40, 20, 40, 20, 80, 0);
    viewbuffer.stroke();
    viewbuffer.fillStyle = "#009900";
    viewbuffer.fillRect(0, 36, viewbuffer.canvas.width, 4);

    viewbuffer.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE,
        Math.floor(player.x), Math.floor(player.y), SPRITE_SIZE, SPRITE_SIZE);
    display.drawImage(viewbuffer.canvas, 0, 0, viewbuffer.canvas.width, viewbuffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);

};

resize = function () {

    display.canvas.width = document.documentElement.clientWidth - 32;

    if (display.canvas.width > document.documentElement.clientHeight) {
        display.canvas.width = document.documentElement.clientHeight;
    }
    display.canvas.height = display.canvas.width * 0.5;
    display.imageSmoothingEnabled = false;
};

let MessageBuffer = function (pollingPeriodInSeconds, keepAliveInSeconds) {
    this.messageBuffer = new Map(); // A map of id to message
    this.keepaliveInSeconds = keepAliveInSeconds; // Number of seconds a message should be kept alive
    this.pollingPeriodInSeconds = pollingPeriodInSeconds; // Number of seconds to wait before asking server for new messages

};

MessageBuffer.prototype = {
    startPolling: function () {
        let currentTimeInSeconds = Math.trunc(new Date().getTime() / 1000);
        let oldestMessageDesired = currentTimeInSeconds - this.keepaliveInSeconds;
        console.log("Polling DB for new messages");
        let _t = this;
        $.ajax({
            url: 'http://localhost:8080/lovegame/display/'.concat(oldestMessageDesired),
            success: function (data) {
                let currentData = new Map();
                data.map(row => currentData.set(row.id, row.message));

                let currentIds = Array.from(currentData.keys());
                console.log("Latest IDs - ".concat(currentIds.toString()));

                let oldIds = Array.from(_t.messageBuffer.keys());
                console.log("Old IDs - ".concat(oldIds.toString()));

                const removeIds = oldIds.filter(id => !currentIds.includes(id));
                const addIds = currentIds.filter(id => !oldIds.includes(id));

                removeIds.forEach(id => _t.messageBuffer.delete(id));
                addIds.forEach(id => _t.messageBuffer.set(id, currentData.get(id)));
            },
            complete: function (request, status) {
                setTimeout(function () {
                    _t.startPolling()
                }, _t.pollingPeriodInSeconds * 1000);
            }
        });
    }
};

let messageBuffer = new MessageBuffer(5, 5 * 60);

$(document).ready(function () {
    messageBuffer.startPolling();
    viewbuffer.canvas.width = 80;
    viewbuffer.canvas.height = 40;

    window.addEventListener("resize", resize);

    resize();

    sprite_sheet.image.addEventListener("load", function(event) {// When the load event fires, do this:
        window.requestAnimationFrame(loop);// Start the game loop.
    });

    controller.changeBehavior();

    sprite_sheet.image.src = "sprites.png";// Start loading the image.
});


