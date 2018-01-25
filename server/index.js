var http = require('http').createServer();
var io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log("User connected");
    socket.emit('news', "hello");

    socket.on('keypressed', (data) => {
        console.log("Keypressed :", data);
    })
});

http.listen(3000, () => {
    console.log("Server started listening on port 3000")
});