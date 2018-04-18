$(document).ready(function () {
    console.log(document.referrer)
    $('.coloredBg').addClass(selectedColor + "Bg");
    $('.coloredFg').addClass(selectedColor + "Fg");
    $('.pickColor#' + selectedColor).addClass('selected');


    $(".pickColor").on('click', function (e) {
        $('.pickColor').removeClass('selected');
        selectedColor = e.target.id;
        $('.coloredBg').removeClass(backgrounds).addClass(selectedColor + "Bg");
        $('.coloredFg').removeClass(foregrounds).addClass(selectedColor + "Fg");
        $(e.target).addClass('selected');
    })

    $(".next").on('click', function () {
        $.ajax({
            url: "/api/color",
            type: "POST",
            data: { "color": selectedColor },
            success: function (data) {
                if (data == "ok")
                    if(document.referrer == "http://" + document.location.host + "/parametres")
                        document.location.href = "/";
                    else
                        document.location.href = "/config/avatar";
                else
                    console.error("Invalid answer : " + data);
            }
        })

    });

    colorChanged = function() {
        $('.pickColor').removeClass('selected');
        $('.coloredBg').removeClass(backgrounds).addClass(selectedColor + "Bg");
        $('.coloredFg').removeClass(foregrounds).addClass(selectedColor + "Fg");
        $('#' + selectedColor).addClass('selected');
    }
})