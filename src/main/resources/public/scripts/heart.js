const HEART_START_SIZE = 5;
const HEART_MAX_SIZE = 350;
const HEART_MAX_VELOCITY = 1.5;
const HEART_MAX_Y_VELOCITY = -0.5;
const FLOATING_LEFT = 0;
const FLOATING_RIGHT = 1;

let heart_movers = new Map();
let heart_sprite = new Image();
heart_sprite.src = "heart.svg";


let HeartController = function () {
    this.currentTimeout = undefined;
    this.timeoutInSeconds = 0;
    this.behavior = FLOATING_LEFT;
    this.x_velocity = 0;
    this.y_velocity = -0.05;
};

HeartController.prototype = {
    changeBehavior: function (required_behavior) {
        if (typeof this.currentTimeout !== undefined) {
            clearTimeout(this.currentTimeout);
        }
        this.timeoutInSeconds = 2;
        this.x_velocity = 0;
        this.behavior = required_behavior;

        let next_behavior;
        if (required_behavior === FLOATING_LEFT) {
            next_behavior = FLOATING_RIGHT;
        } else {
            next_behavior = FLOATING_LEFT;
        }

        let _t = this;
        this.currentTimeout = setTimeout(function () {
            _t.changeBehavior(next_behavior)
        }, _t.timeoutInSeconds * 1000);
    },
};

let HeartPlayer = function (start_x, start_y) {
    this.animation = new Animation();
    this.height = HEART_START_SIZE;
    this.width = HEART_START_SIZE;
    this.x = start_x;
    this.y = start_y;
};

HeartPlayer.prototype = {};

let HeartMover = function (heart_player, heart_controller, id, message) {
    this.heart_player = heart_player;
    this.heart_controller = heart_controller;
    this.id = id;
    this.message = message;
    this.text_box = undefined;
    heart_movers.set(id, this);
};

HeartMover.prototype = {
    move_heart: function () {
        if (this.heart_player.x - 10 <= 0) {
            this.heart_player.x = 10;
            this.heart_controller.x_velocity = 0;
            this.heart_controller.changeBehavior(FLOATING_RIGHT);

        } else if (this.heart_player.x + this.heart_player.width + 10 >= viewbuffer.canvas.width) {
            this.heart_player.x = viewbuffer.canvas.width - this.heart_player.width - 10;
            this.heart_controller.x_velocity = 0;
            this.heart_controller.changeBehavior(FLOATING_LEFT);
        }

        if (this.heart_controller.behavior === FLOATING_LEFT
            && Math.abs(this.heart_controller.x_velocity) <= HEART_MAX_VELOCITY) {
            this.heart_controller.x_velocity -= 0.1;
        }

        if (this.heart_controller.behavior === FLOATING_RIGHT
            && Math.abs(this.heart_controller.x_velocity) <= HEART_MAX_VELOCITY) {
            this.heart_controller.x_velocity += 0.1;
        }

        if (this.heart_controller.y_velocity >= HEART_MAX_Y_VELOCITY) {
            this.heart_controller.y_velocity -= 0.1;
        }

        if (this.heart_player.height <= HEART_MAX_SIZE) {
            this.heart_player.y += -2.8;
            this.heart_player.x += -2.8;
            this.heart_player.height += 3.0;
            this.heart_player.width += 3.0;
        }

        this.heart_player.x += this.heart_controller.x_velocity;
        this.heart_player.y += this.heart_controller.y_velocity;

        if (this.heart_player.y + this.heart_player.height <= 0) {
            heart_movers.delete(this.id);
        }
    },

    render: function () {
        viewbuffer.drawImage(heart_sprite, 0, 0, 190, 190,
            Math.floor(this.heart_player.x), Math.floor(this.heart_player.y),
            this.heart_player.width, this.heart_player.height);

        if (this.heart_player.width >= HEART_MAX_SIZE) {
            viewbuffer.font = "28px Crayonnette";
            viewbuffer.strokeStyle = "#000000";
            viewbuffer.fillStyle = "#FFFFFF";
            viewbuffer.lineWidth = 4;

            let text = this.wordWrap(this.message, 22);
            let currLine = 0;
            text.forEach( line => {
                let y_pos = currLine * 25;
                viewbuffer.strokeText(line, Math.floor(this.heart_player.x) + 60,
                    Math.floor(this.heart_player.y) + 100 + y_pos, HEART_MAX_SIZE - 30);
                viewbuffer.fillText(line, Math.floor(this.heart_player.x) + 60,
                    Math.floor(this.heart_player.y) + 100 + y_pos, HEART_MAX_SIZE - 30);
                currLine++;
            });

        }
    },

    wordWrap: function (str, maxWidth) {
        let textArray = [];
        let done = false;
        let res = '';
        while (str.length > maxWidth) {
            let found = false;
            // Inserts new line at first whitespace of the line
            for (i = maxWidth - 1; i >= 0; i--) {
                if (this.testWhite(str.charAt(i))) {
                    textArray.push(str.slice(0, i));
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            // Inserts new line at maxWidth position, the word is too long to wrap
            if (!found) {
                textArray.push(str.slice(0, maxWidth));
                str = str.slice(maxWidth);
            }
        }
        textArray.push(str);
        return textArray;
    },

    testWhite: function (x) {
        let white = new RegExp(/^\s$/);
        return white.test(x.charAt(0));
    }
};


