$(document).ready(function (){
    $("#changeAvatar").on('click', function() {
        document.location.href="/config/avatar"
    });

    $('#changeColor').on('click', function() {
        document.location.href="/config/colors"
    });

    $('#return').on('click', function() {
        document.location.href = "/"
    })
});