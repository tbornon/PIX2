$(document).ready(function () {
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
                    document.location.href = "/config/avatar"
                else
                    console.error("Invalid answer : " + data);
            }
        })

    })
})