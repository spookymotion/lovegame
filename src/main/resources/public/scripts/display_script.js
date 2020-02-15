let loop, render, resize;

let GROUND_RECT_HEIGHT = 25;
let MAX_PLANTS = 4;
let heartControllers = {};
let heartPlayers = {};

let plantInstances = [];


const VIEW_SCALE = 1;

render = function () {
    let canvas = $("#canvas")[0];
    if (canvas !== undefined) {
        canvas.width = $(window).innerWidth;
        canvas.height = $(window).innerHeight;
    }

    /* Draw the background. */
    viewbuffer.fillStyle = "#7ec0ff";
    viewbuffer.fillRect(0, 0, viewbuffer.canvas.width, viewbuffer.canvas.height);
    viewbuffer.strokeStyle = "#8ed0ff";
    viewbuffer.lineWidth = 80;
    viewbuffer.beginPath();
    viewbuffer.moveTo(0, 0);
    viewbuffer.bezierCurveTo(40, 80, 40, 0, viewbuffer.canvas.width, 0);
    viewbuffer.moveTo(0, 0);
    viewbuffer.bezierCurveTo(40, 80, 40, 80, viewbuffer.canvas.width, 0);
    viewbuffer.stroke();
    viewbuffer.fillStyle = "#009900";
    viewbuffer.fillRect(0, viewbuffer.canvas.height - GROUND_RECT_HEIGHT, viewbuffer.canvas.width, GROUND_RECT_HEIGHT);

    //plantInstances.forEach(plant => plant.render());

    render_icarus();
    heart_movers.forEach(heart_mover => heart_mover.render());
    display.drawImage(viewbuffer.canvas,
        0, 0,
        viewbuffer.canvas.width,
        viewbuffer.canvas.height,
        0, 0,
        display.canvas.width,
        display.canvas.height);
};

loop = function (time_stamp) {
    move_icarus();
    heart_movers.forEach(heart_mover => heart_mover.move_heart());
    update_icarus_animation();

    render();
    window.requestAnimationFrame(loop);
};


resize = function () {
    let imageSmoothing = false;
    let w = Math.floor(document.documentElement.clientWidth / VIEW_SCALE);
    let h = Math.floor(document.documentElement.clientHeight / VIEW_SCALE);
    display.canvas.width = w;
    display.canvas.height = h;
    viewbuffer.canvas.width = w;
    viewbuffer.canvas.height = h;
    display.imageSmoothingEnabled = imageSmoothing;
    viewbuffer.imageSmoothingEnabled = imageSmoothing;
};


let messageBuffer = new MessageBuffer(5, 30 * 60);

$(document).ready(function () {
    messageBuffer.startPolling();
    viewbuffer.canvas.width = 640;
    viewbuffer.canvas.height = 320;

    window.addEventListener("resize", resize);

    resize();

    icarus_sprite_sheet.image.addEventListener("load", function (event) {// When the load event fires, do this:
        window.requestAnimationFrame(loop);// Start the game loop.
    });

    icarus_controller.changeBehavior();
});


