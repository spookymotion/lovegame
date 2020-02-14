let MessageBuffer = function (pollingPeriodInSeconds, keepAliveInSeconds) {
    this.messageBuffer = new Map(); // A map of id to message
    this.keepaliveInSeconds = keepAliveInSeconds; // Number of seconds a message should be kept alive
    this.pollingPeriodInSeconds = pollingPeriodInSeconds; // Number of seconds to wait before asking server for new messages
    this.messageBuffer.set(1, "These messages were provided by Mystery Date attendees like you!");
    this.messageBuffer.set(2, "If you would like to send a love message to someone, just ask our cupid Anya Nuttz!");
    this.messageBuffer.set(3, "Who knows, the person who you admire could see your message and it could spark a beautiful Mystery Date!");
    this.alwaysKeep = Array.from(this.messageBuffer.keys());
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

                removeIds.forEach(id => {
                    if(!_t.alwaysKeep.includes(id)) {
                        _t.messageBuffer.delete(id);
                    }
                });
                addIds.forEach(id => _t.messageBuffer.set(id, currentData.get(id)));
            },
            complete: function (request, status) {
                setTimeout(function () {
                    _t.startPolling()
                }, _t.pollingPeriodInSeconds * 1000);
            }
        });
    },
    getRandomMessage: function() {
        let index = Math.floor(Math.random() * this.messageBuffer.size);
        currMessage = 0;
        for(const [key, value] of this.messageBuffer.entries()) {
            if(currMessage === index) {
               return value;
            }
            currMessage++;
        }
    }
};