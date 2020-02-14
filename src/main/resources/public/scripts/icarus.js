const ICARUS_SPRITE_SIZE = 24;
const ICARUS_RESIZE_SIZE = 72;
const MOVING_LEFT = 0;
const MOVING_RIGHT = 1;
const JUMPING = 2;
const FIST_PUMP = 3;

let current_heart = 1;
let icarus_controller;
let icarus_player;
let icarus_sprite_sheet;
let new_heart_timeout_in_seconds = 5;

icarus_controller = {
    currentTimeout: undefined,
    timeoutInSeconds: 0,
    left:  { active:false },
    right: { active:false },
    up:    { active:false },
    allow_heart: true,
    heart_timer: undefined,

    changeBehavior:function(required_behavior) {
        // First delete the timeout in case we were interrupted
        if(typeof this.currentTimeout !== undefined) {
            clearTimeout(this.currentTimeout);
        }

        // First pick new timeout between 3 and 8 seconds:
        this.timeoutInSeconds = Math.floor((Math.random() * 6) + 3);
        let nextBehavior = 0;

        if (required_behavior === undefined ) {
            nextBehavior = Math.floor(Math.random() * 6);
        } else {
            nextBehavior = required_behavior;
        }

        if(nextBehavior === MOVING_LEFT) {
            icarus_controller.right.active = false;
            icarus_controller.up.active = false;
            icarus_controller.left.active = true;
        } else if (nextBehavior === MOVING_RIGHT) {
            icarus_controller.right.active = true;
            icarus_controller.up.active = false;
            icarus_controller.left.active = false;
        } else if (nextBehavior === JUMPING) {
            if(icarus_controller.allow_heart) {
                let text = messageBuffer.getRandomMessage();
                if(text === undefined) {
                    text = "";
                }
                heart_movers.set(current_heart, new HeartMover(
                    new HeartPlayer(icarus_player.x + 20 + ICARUS_SPRITE_SIZE / 2, icarus_player.y - HEART_START_SIZE),
                    new HeartController(),
                    current_heart,
                    text));
                heart_movers.get(current_heart).heart_controller.changeBehavior(FLOATING_RIGHT);
                current_heart++;
                icarus_controller.allow_heart = false;
                icarus_controller.heart_timer = setTimeout(function () {
                    icarus_controller.allow_heart = true;
                }, new_heart_timeout_in_seconds * 1000);
            }
            icarus_controller.right.active = false;
            icarus_controller.up.active = true;
            icarus_controller.left.active = false;
        } else if (nextBehavior >= FIST_PUMP) {
            if(icarus_controller.allow_heart) {
                let text = messageBuffer.getRandomMessage();
                if(text === undefined) {
                    text = "";
                }
                heart_movers.set(current_heart, new HeartMover(
                    new HeartPlayer(icarus_player.x + ICARUS_SPRITE_SIZE / 2, icarus_player.y - HEART_START_SIZE),
                    new HeartController(),
                    current_heart,
                    text));
                heart_movers.get(current_heart).heart_controller.changeBehavior(FLOATING_RIGHT);
                current_heart++;
                icarus_controller.allow_heart = false;
                icarus_controller.heart_timer = setTimeout(function () {
                    icarus_controller.allow_heart = true;
                }, new_heart_timeout_in_seconds * 1000);
            }
            icarus_controller.right.active = false;
            icarus_controller.up.active = false;
            icarus_controller.left.active = false;
        }
        let _t = this;
        this.currentTimeout = setTimeout(function () {
            _t.changeBehavior()
        }, _t.timeoutInSeconds * 1000);
    }

};

/* The icarus_player object is just a rectangle with an animation object. */
icarus_player = {
    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: true,
    height: ICARUS_RESIZE_SIZE, width: ICARUS_RESIZE_SIZE,
    x: 0, y: viewbuffer.canvas.height * 4 - ICARUS_RESIZE_SIZE,
    x_velocity: 0, y_velocity: 0
};

/* The sprite sheet object holds the sprite sheet graphic and some animation frame
sets. An animation frame set is just an array of frame values that correspond to
each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
icarus_sprite_sheet = {
    frame_sets: [[8, 9], [7, 6, 5], [0, 1, 2]],// standing still, walk right, walk left
    image: new Image()

};

icarus_sprite_sheet.image.src = "sprites.png";// Start loading the image.

function move_icarus() {
    if (icarus_controller.up.active && !icarus_player.jumping) {
        icarus_controller.up.active = false;
        icarus_player.jumping = true;
        icarus_player.y_velocity -= 2.5;
    }

    if (icarus_player.x - 10 <= 0) {
        icarus_player.x = 10;
        icarus_controller.changeBehavior(MOVING_RIGHT);

    } else if (icarus_player.x + icarus_player.width + 10 >= viewbuffer.canvas.width) {
        icarus_player.x = viewbuffer.canvas.width - icarus_player.width - 10;
        icarus_controller.changeBehavior(MOVING_LEFT);
    }

    if (icarus_controller.left.active) {
        /* To change the animation, all you have to do is call animation.change. */
        icarus_player.animation.change(icarus_sprite_sheet.frame_sets[2], 15);
        icarus_player.x_velocity -= 0.25;
    }

    if (icarus_controller.right.active) {
        icarus_player.animation.change(icarus_sprite_sheet.frame_sets[1], 15);
        icarus_player.x_velocity += 0.25;
    }

    /* If you're just standing still, change the animation to standing still and poop a heart. */
    if (!icarus_controller.left.active && !icarus_controller.right.active) {
        icarus_player.animation.change(icarus_sprite_sheet.frame_sets[0], 20);
    }

    icarus_player.y_velocity += 0.10;

    icarus_player.x += icarus_player.x_velocity;
    icarus_player.y += icarus_player.y_velocity;
    icarus_player.x_velocity *= 0.9;
    icarus_player.y_velocity *= 0.9;

    if (icarus_player.y + icarus_player.height > viewbuffer.canvas.height - 20) {
        icarus_player.jumping = false;
        icarus_player.y = viewbuffer.canvas.height - 20 - icarus_player.height;
        icarus_player.y_velocity = 0;
    }
}

function render_icarus() {
    viewbuffer.drawImage(icarus_sprite_sheet.image, icarus_player.animation.frame * ICARUS_SPRITE_SIZE,
        0, ICARUS_SPRITE_SIZE, ICARUS_SPRITE_SIZE,
        Math.floor(icarus_player.x), Math.floor(icarus_player.y), ICARUS_RESIZE_SIZE, ICARUS_RESIZE_SIZE);
}

function update_icarus_animation() {
    icarus_player.animation.update();
}
