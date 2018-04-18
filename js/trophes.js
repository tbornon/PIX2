$(document).ready(function() {
    $('.game').on('click', function(element) {
        $('.game').removeClass('selected');
        $(element.currentTarget).addClass('selected');
    });
});