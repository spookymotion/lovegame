var messageAfter = 0;

$(document).ready(function() {
    $.ajax({
        url: "http://localhost:8080/lovegame/display/".concat(messageAfter)
    }).then(function(data) {
        alert(data.toString());
    });
});