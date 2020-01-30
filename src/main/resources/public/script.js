let MessageBuffer = function (pollingPeriodInSeconds, keepAliveInSeconds) {
    this.messageBuffer = new Map(); // A map of id to message
    this.keepaliveInSeconds = keepAliveInSeconds; // Number of seconds a message should be kept alive
    this.pollingPeriodInSeconds = pollingPeriodInSeconds; // Number of seconds to wait before asking server for new messages

};

MessageBuffer.prototype = {
    startPolling:function() {
        let currentTimeInSeconds = Math.trunc(new Date().getTime() / 1000);
        let oldestMessageDesired = currentTimeInSeconds - this.keepaliveInSeconds;
        console.log("Polling DB for new messages");
        $.ajax({
            url: 'http://localhost:8080/lovegame/display/'.concat(oldestMessageDesired),
            success: function (data) {
                let latestIds = data.map(row => row.id);
                console.log("Existing IDs - ".concat(latestIds.toString()));
                let oldIds = Array.from(this.messageBuffer.keys());
                console.log("New IDs - ".concat(oldIds.toString()));

                const removeIds = oldIds.filter( id => !latestIds.has(id));
                const newIds = latestIds.filter( id => !oldIds.has(id));
            }
        });
        setTimeout(this.startPolling, this.pollingPeriodInSeconds * 1000);
    }
};

let buffer = new MessageBuffer(5, 5 * 60);

$(document).ready(function() {
    buffer.startPolling();
});


