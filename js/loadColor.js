var foregrounds = "blueFg pinkFg redFg orangeFg yellowFg greenFg blackFg";
var backgrounds = "blueBg pinkBg redBg orangeBg yellowBg greenBg blackBg";
var selectedColor = "blue";
var colorLoaded = false;

$.ajax({
    url: '/api/color',
    dataType: 'json',
    success: function (data) {
        selectedColor = data.color;
        colorLoaded = true;
        $('.coloredBg').addClass(selectedColor + "Bg");
        $('.coloredFg').addClass(selectedColor + "Fg");
    }
})