$(document).ready(function () {
    console.log("Ready");

    var socket = io('http://localhost:3000');

    socket.on('news', function (data) {
        console.log(data);
        socket.emit('test', { my: data });
    })

    $(".touche").on('click', function (e) {
        var number = e.currentTarget.id;
        var color = e.currentTarget.className.split(' ')[1];
        socket.emit('keypressed', {
            number: number,
            color: color
        });
    })
});