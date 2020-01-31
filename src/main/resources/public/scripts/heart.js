const HEART_START_SIZE = 5;
const HEART_MAX_SIZE = 25;
const HEART_MAX_VELOCITY = 0.1;
const HEART_MAX_Y_VELOCITY = 0.5;
const FLOATING_LEFT = 0;
const FLOATING_RIGHT = 1;

let heart_movers = new Map();
let heart_sprite = new Image();
heart_sprite.src = "favicon.ico";


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
        this.timeoutInSeconds = 1;
        this.x_velocity = 0;
        this.behavior = required_behavior;

        let next_behavior;
        if(required_behavior === FLOATING_LEFT) {
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

let HeartMover = function (heart_player, heart_controller, id) {
    this.heart_player = heart_player;
    this.heart_controller = heart_controller;
    this.id = id;
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
            this.heart_controller.x_velocity -= 0.01;
        }

        if (this.heart_controller.behavior === FLOATING_RIGHT
            && Math.abs(this.heart_controller.x_velocity) <= HEART_MAX_VELOCITY) {
            this.heart_controller.x_velocity += 0.01;
        }

        if (Math.abs(this.heart_player.y_velocity) <= HEART_MAX_Y_VELOCITY) {
            this.heart_controller.y_velocity -= 0.01;
        }

        if (this.heart_player.height <= HEART_MAX_SIZE) {
            this.heart_player.height += 0.05;
            this.heart_player.width += 0.05;
        }

        this.heart_player.x += this.heart_controller.x_velocity;
        this.heart_player.y += this.heart_controller.y_velocity;

        if (this.heart_player.y + this.heart_player.height <= 0) {
            heart_movers.delete(this.id);
        }
    },

    render: function () {
        viewbuffer.drawImage(heart_sprite, 0,
            0, 16, 16,
            Math.floor(this.heart_player.x), Math.floor(this.heart_player.y),
            this.heart_player.width, this.heart_player.height);
    }
};


