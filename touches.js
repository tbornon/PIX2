const Gpio = require('onoff').Gpio;
const io = require('socket.io-client');

const A = new Gpio(19, 'out');
const B = new Gpio(26, 'out');
const C = new Gpio(16, 'out');
const D = new Gpio(20, 'out');
const input = new Gpio(21, 'in');

const socket = io('http://localhost:3000');

const keys = [
    {
        "number": 0,
        "color": "white"
    },
    {
        "number": 1,
        "color": "red"
    },
    {
        "number": 2,
        "color": "orange"
    },
    {
        "number": 3,
        "color": "yellow"
    },
    {
        "number": 4,
        "color": "green"
    },
    {
        "number": 5,
        "color": "blue"
    },
    {
        "number": 6,
        "color": "violet"
    },
    {
        "number": 7,
        "color": "pink"
    },
    {
        "number": 8,
        "color": "brown"
    },
    {
        "number": 9,
        "color": "black"
    },

]

var i = 0;
var last = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];



setInterval(() => {
    if (i == 10) i = 0;
    let bin = "" + ((i >> 3) & 1) + ((i >> 2) & 1) + ((i >> 1) & 1) + (i & 1);

    A.writeSync(i & 1);
    B.writeSync((i >> 1) & 1);
    C.writeSync((i >> 2) & 1);
    D.writeSync((i >> 3) & 1);

    let val = input.readSync();

    if (val == 0 && last[i] == 1) {
        console.log("Touche " + i + " appuyée");
        socket.emit("keypressed", keys[i]);
    }

    last[i] = val;

    i++;
}, 10);

process.on('SIGINT', function () {
    A.unexport();
    B.unexport();
    C.unexport();
    D.unexport();
    input.unexport();
});