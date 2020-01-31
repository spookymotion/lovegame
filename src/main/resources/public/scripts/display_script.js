let loop, render, resize;

let heartControllers = {};
let heartPlayers = {};

render = function () {
    let canvas = $("#canvas")[0];
    if(canvas !== undefined) {
        canvas.width = $(window).innerWidth;
        canvas.height = $(window).innerHeight;
    }

    /* Draw the background. */
    viewbuffer.fillStyle = "#7ec0ff";
    viewbuffer.fillRect(0, 0, viewbuffer.canvas.width, viewbuffer.canvas.height);
    viewbuffer.strokeStyle = "#8ed0ff";
    viewbuffer.lineWidth = 10;
    viewbuffer.beginPath();
    viewbuffer.moveTo(0, 0);
    viewbuffer.bezierCurveTo(40, 20, 40, 0, viewbuffer.canvas.width, 0);
    viewbuffer.moveTo(0, 0);
    viewbuffer.bezierCurveTo(40, 20, 40, 20, viewbuffer.canvas.width, 0);
    viewbuffer.stroke();
    viewbuffer.fillStyle = "#009900";
    viewbuffer.fillRect(0, viewbuffer.canvas.height - 4, viewbuffer.canvas.width, 4);

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
    display.canvas.width = document.documentElement.clientWidth;
    display.canvas.height = document.documentElement.clientHeight;
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
    viewbuffer.canvas.width = 320;
    viewbuffer.canvas.height = 160;

    window.addEventListener("resize", resize);

    resize();

    icarus_sprite_sheet.image.addEventListener("load", function(event) {// When the load event fires, do this:
        window.requestAnimationFrame(loop);// Start the game loop.
    });

    icarus_controller.changeBehavior();
});


