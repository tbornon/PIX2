var foregrounds = "blueFg pinkFg redFg orangeFg yellowFg greenFg blackFg";
var backgrounds = "blueBg pinkBg redBg orangeBg yellowBg greenBg blackBg";
var selectedColor = "blue";

$(document).ready(function() {    
    $('.coloredBg').addClass(selectedColor + "Bg");
    $('.coloredFg').addClass(selectedColor + "Fg");

    $(".pickColor").on('click', function(e) {
        $('.pickColor').removeClass('selected');
        selectedColor = e.target.id;
        $('.coloredBg').removeClass(backgrounds).addClass(selectedColor + "Bg");
        $('.coloredFg').removeClass(foregrounds).addClass(selectedColor + "Fg");
        $(e.target).addClass('selected');
    })

    $(".next").on('click', function() {
        document.location.href = "/config/avatar"
    })
})