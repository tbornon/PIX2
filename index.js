const http = require('http').createServer();
const express = require('express');
const app = express();
//var mongoose = require('mongoose');
const io = require('socket.io')(http);

/*mongoose.connect('mongodb://localhost/pix');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
    console.log("Connected to database");
})*/



app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/res', express.static('res'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '\\menu.html');
});

app.get('/debug', (req, res) => {
    res.sendFile(__dirname + '\\debug.html');
});

app.post('/save', (req, res) => {

})

io.on('connection', (socket) => {
    console.log("User connected");
    socket.emit('news', "hello");

    socket.on('keypressed', (data) => {
        console.log("Keypressed :", data);
    })
});

app.listen(80, () => {
    console.log("Front listening on port 80");
});

http.listen(3000, () => {
    console.log("Server started listening on port 3000");
});