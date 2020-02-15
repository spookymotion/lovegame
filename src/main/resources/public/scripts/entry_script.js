let currentRedrawTimeout;

function newMessage() {
    let author = $("#author").val();
    let message = $("#message_contents").val();

    if (message !== undefined && message.length !== 0 && message.trim()) {
        $.ajax({
            url: 'lovegame/message_entry_api/'
                .concat(author)
                .concat("/")
                .concat(message)
                .concat("/"),
            complete: function (request, status) {
                $("#message_contents").val("");
            }
        });
    }
}

function redrawMessageList() {
    $.ajax({
        url: 'lovegame/display/'.concat('0'),
        success: function (data) {
            let currentData = new Map();
            JSON.parse(data).map(row => currentData.set(row.id, row.message));
            let messageList = $("#message_list");
            messageList.empty();

            for (const [key, value] of currentData.entries()) {
                messageList.append('<li>' + value
                    + '<button onclick="onDelete(' + key + ');return false;">delete</button></li>');
            }
        },
        complete: function (request, status) {
            currentRedrawTimeout = setTimeout(function () {
                redrawMessageList()
            }, 1000);
        }
    });
}

function onDelete(id_to_delete) {
    $.ajax({
        url: 'lovegame/delete/'
            .concat(id_to_delete)
            .concat("/"),
        complete: function (request, status) {
            alert("Deleted message");
        }
    });
}

function onEntryFormLoad() {
    redrawMessageList();
}