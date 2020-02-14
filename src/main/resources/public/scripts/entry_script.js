let currentRedrawTimeout;

function newMessage() {
    let author = $("#author").val();
    let message = $("#message_contents").val();

    if (message !== undefined && message.length !== 0 && message.trim()) {
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
}

function redrawMessageList() {
    $.ajax({
        url: 'http://localhost:8080/lovegame/display/'.concat('0'),
        success: function (data) {
            let currentData = new Map();
            data.map(row => currentData.set(row.id, row.message));
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
        url: 'http://localhost:8080/lovegame/delete/'
            .concat(id_to_delete)
            .concat("/"),
        complete: function (request, status) {
            alert("Deleted message");
        }
    });
}

function onEntryFormLoad() {
    redrawMessageList();
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            $("#add_message").click();
        }
    });
}