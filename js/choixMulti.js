$(document).ready(function() {
    $("#create").on('click', function() {
        document.location.href="/createMulti"
    });

    $("#join").on('click', function() {
        document.location.href="/joinMulti"
    });

    $(".return").on('click', function() {
        document.location.href="/"
    });
})