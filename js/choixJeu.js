$(document).ready(function() {
    $('.return').on('click', function() {
        document.location.href="/";
    });

    $('#simon').on('click', function() {
        document.location.href = "/simon"
    });
})