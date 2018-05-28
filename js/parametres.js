$(document).ready(function (){
    $("#changeAvatar").on('click', function() {
        document.location.href="/config/avatar"
    });

    $('#changeColor').on('click', function() {
        document.location.href="/config/colors"
    });

    $('#changePseudo').on('click', function() {
        document.location.href="/config/pseudo"
    });

    $('#return').on('click', function() {
        document.location.href = "/"
    })
}); 