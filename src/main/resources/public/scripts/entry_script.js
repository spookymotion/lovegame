let currentRedrawTimeout;

function newMessage() {
    let author = $("#author").val();
    let message = $("#message_contents").val();

    $.ajax({
        url: 'http://localhost:8080/lovegame/message_entry_api/'
            .concat(author)
            .concat("/")
            .concat(message)
            .concat("/"),
        complete: function (request, status) {
            $("#message_contents").val("");
        }
    });
}

function redrawMessageList() {
    let _t = this;
    $.ajax({
        url: 'http://localhost:8080/lovegame/display/'.concat('0'),
        success: function (data) {
            let currentData = new Map();
            data.map(row => currentData.set(row.id, row.message));
            let messageList = $("#message_list");
            messageList.empty();

            for(const [key, value] of currentData.entries()) {
                messageList.append('<li>' + value
                    + '<button onclick="onDelete('+ key +');return false;">delete</button></li>');
            }
        },
        complete: function (request, status) {
            currentRedrawTimeout = setTimeout(function () {
                redrawMessageList()
            }, 3000);
        }
    });
}

function onDelete(id_to_delete) {
    $.ajax({
        url: 'http://localhost:8080/lovegame/delete/'
            .concat(id_to_delete)
            .concat("/"),
        complete: function (request, status) {
            alert("Deleted message");
        }
    });
}