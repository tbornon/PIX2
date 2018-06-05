const http = require('http').createServer();
const httpMulti = require('http').createServer();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const io = require('socket.io')(http);
const ioMulti = require('socket.io')(httpMulti);
const ioClient = require('socket.io-client');
const User = require('./models/User');
const Score = require('./models/Score');
const fs = require('fs');
const wifi = require('node-wifi');
const os = require('os');
const { spawn } = require('child_process');
const { exec } = require('child_process');

var actualUser;
var db;
var config;
var wifi_AP;
var socketClient;
var connected = false;

wifi.init({
    iface: null // network interface, choose a random wifi interface if set to null
});

fs.readFile('config.json', 'utf8', (err, data) => {
    if (err) console.error(err);

    config = JSON.parse(data);

    mongoose.connect('mongodb://' + config.database.host + '/' + config.database.name);
    db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'))

    db.once('open', () => {
        console.log("Connected to database @ " + config.database.host);
        User.findOne({ 'mainUser': true }, (err, res) => {
            if (err) throw err;
            if (res != null) {
                actualUser = res;
                console.log("Main user successfuly loaded");
            } else console.log("No main user detected");

            app.listen(80, () => {
                console.log("Front listening on port 80");
            });

            http.listen(3000, () => {
                console.log("Socket io started listening on port 3000");
            });
        });
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/res', express.static('res'));

app.all('(?!*api)*', (req, res, next) => {
    if (req.originalUrl != '/config/welcome' && req.originalUrl != '/config/colors' && req.originalUrl != '/config/avatar' && !isUserComplete()) {
        if (actualUser == null)
            res.writeHead(302, { 'Location': '/config/welcome' })
        else if (actualUser.color == null)
            res.writeHead(302, { 'Location': '/config/colors' })
        else if (actualUser.avatar.seed == null)
            res.writeHead(302, { 'Location': '/config/avatar' })
        else if (actualUser.name == null)
            res.writeHead(302, { 'Location': '/config/pseudo' })
        res.end();
    } else
        next();
});

//#region WEB
app.get('/config/welcome', (req, res) => {
    if (actualUser == null) {
        actualUser = new User();
        actualUser.mainUser = true;
        actualUser.save((err) => {
            if (err) throw err;
            console.log("New main user has been created and saved successfuly")
            res.sendFile(__dirname + '/config/welcome.html');
        })
    } else {
        response.writeHead(302, { 'Location': '/' });
        response.end();
    }
});

app.get('/config/colors', (req, res) => {
    res.sendFile(__dirname + '/config/colors.html');
});

app.get('/config/avatar', (req, res) => {
    res.sendFile(__dirname + '/config/avatar.html');
});

app.get('/config/pseudo', (req, res) => {
    res.sendFile(__dirname + '/config/pseudo.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/menu.html');
    connected = false;
});

app.get('/parametres', (req, res) => {
    res.sendFile(__dirname + "/parametres.html");
});

app.get('/trophes', (req, res) => {
    res.sendFile(__dirname + "/trophes.html");
});

app.get('/choixJeu', (req, res) => {
    res.sendFile(__dirname + "/choixJeu.html");
});

app.get('/choixMulti', (req, res) => {
    res.sendFile(__dirname + "/choixMulti.html");
});

app.get('/createMulti', (req, res) => {
    res.sendFile(__dirname + "/createMulti.html");
});

app.get('/joinMulti', (req, res) => {
    res.sendFile(__dirname + "/joinMulti.html");
});

app.get('/debug', (req, res) => {
    res.sendFile(__dirname + '/debug.html');
});

app.get('/simon/*', (req, res) => {
    res.sendFile(__dirname + '/jeux/simon.html');
});

app.get('/simonMulti/', (req, res) => {
    res.sendFile(__dirname + '/jeux/simonMulti.html');
});

app.get('/couleur/*', (req, res) => {
    res.sendFile(__dirname + '/jeux/couleur.html');
});

app.get('/calculs/*', (req, res) => {
    res.sendFile(__dirname + '/jeux/calculs.html');
});

app.get('/ping', (req, res) => {
    console.log(req.connection.remoteAddress);
    res.send('pong');
});

app.get('/ping/:ip:', (req, res) => {
    console.log(req.params.ip);
    res.send('pong');
});
//#endregion

//#region API
app.post('/api/color', (req, res) => {
    console.log("Changing actual user color to : " + req.body.color);
    actualUser.color = req.body.color;
    actualUser.save((err) => {
        if (err) {
            res.send('error : ' + err);
            throw err;
        }
        else res.send('ok');
    });
});

app.get('/api/color', (req, res) => {
    res.json({ color: actualUser.color });
});

app.post('/api/avatar', (req, res) => {
    console.log("Changing actual user avatar to : " + req.body.gender + " " + req.body.seed);
    actualUser.avatar.seed = req.body.seed;
    actualUser.avatar.gender = req.body.gender;
    actualUser.save((err) => {
        if (err) {
            res.send(err);
            throw err;
        } else {
            res.send("ok");
        }
    });
});

app.get('/api/avatar', (req, res) => {
    res.json({
        "gender": actualUser.avatar.gender,
        "seed": actualUser.avatar.seed
    });
});

app.post('/api/name', (req, res) => {
    actualUser.name = req.body.name;
    actualUser.save((err) => {
        if (err) {
            throw err;
            res.send(err);
        } else {
            res.send("ok");
        }
    });
});

app.get('/api/name', (req, res) => {
    res.json({ name: actualUser.name });
});

app.get('/api/score/:game/:number', (req, res) => {
    Score.findMax(req.params.game.toLowerCase(), req.params.number, (err, data) => {
        if (err) {
            res.send(err);
            throw err;
        } else {
            res.json(data);
        }
    });
});

app.post('/api/score', (req, res) => {
    let score = new Score();
    score.userId = actualUser._id;
    score.game = req.body.game.toLowerCase();
    score.score = req.body.score;
    score.save((err) => {
        if (err) {
            res.send(err);
            throw err;
        }
        else {
            res.send('ok');
        }
    });
});

app.get('/api/user/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.send(err);
            throw err;
        } else {
            res.json(data);
        }
    })
});

app.get('/api/user', (req, res) => {
    User.findOne({ mainUser: true }, (err, data) => {
        if (err) {
            res.send(err);
            throw err;
        } else {
            res.json(data);
        }
    })
});

app.get('/api/arch', (req, res) => {
    res.send(config.arch);
});

app.get('/api/startMulti/', (req, res) => {
    //var ssid = "[PIX2]" + req.params.name;
    let ssid = "[PIX2]" + actualUser.name;

    var file = `interface=wlan0
driver=nl80211
ssid=${ssid}
hw_mode=g
channel=6
ieee80211d=0
#country_code=FR
ieee80211n=1
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=testtest
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP`;


    fs.writeFile('hostapd.conf', file, (err) => {
        if (err) console.error(err);
        console.log("Config file written !");

        wifi_AP = spawn('stdbuf', ['-i0', '-o0', '-e0', 'hostapd', 'hostapd.conf']);

        // Lecture des données entrantes
        wifi_AP.stdout.on('data', (data) => {
            if (data.indexOf("AP-ENABLED") !== -1) {
                console.log("AP point created successfuly");
                io.sockets.emit('multi', { msg: "AP-ENABLED" });

                if (!httpMulti.listening) {
                    httpMulti.listen(3001, () => {
                        console.log("Socket io multi started listening on port 3001");
                        io.sockets.emit('multi', { msg: "SOCKET-ENABLED" });
                    });
                }
            }
        });

        // Lecture des erreurs entrantes
        wifi_AP.stderr.on('data', (data) => {
            console.error(data);
        });

        // Lors de la fermeture du process
        wifi_AP.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    });

    res.send('ok');
});

app.get('/api/stopMulti', (req, res) => {
    wifi_AP.kill('SIGINT', () => {
        console.log("Wifi AP killed");
    });
    res.send('ok');
});
//#endregion

//#region Socket.io
io.on('connection', (socket) => {
    console.log("User connected");
    socket.on('keypressed', (data) => {
        socket.broadcast.emit('keypressed', data);
        console.log("Keypressed :", data);
        playSound(data.number);
    });

    socket.on('multi', (data) => {
        // Affiche les données reçues
        console.log("Multi :", data);

        // Si on cherche une partie multi
        if (data.msg == "LOOKING_FOR_PLAYER") {
            // Scan les réseaux wifi
            wifi.scan(function (err, networks) {
                if (err) {
                    console.error(err);
                } else {
                    for (var i = 0; i < networks.length; i++) {
                        // Si un des réseaux est un piano magique
                        if (networks[i].ssid.indexOf('[PIX2]') !== -1) {
                            // On se connecte au réseau
                            if (!connected) {
                                connected = true;
                                wifi.connect({ ssid: networks[i].ssid, password: 'testtest' }, (err) => {
                                    if (err) console.error(err);
                                    console.log("Connected");
                                    // On envoie un message sur la page web informant qu'on est connecté
                                    socket.emit('multi', { msg: 'CONNECTED' });

                                    socketClient = ioClient('http://192.168.2.1:3001');

                                    socketClient.on('connect', () => {
                                        socketClient.emit('player_info', actualUser);
                                    });

                                    socketClient.on('player_info', (data) => {
                                        console.log("player_info");
                                        Score.find({ "userId": actualUser._id }, (err, data) => {
                                            if (err) console.error(err);

                                            socketClient.emit('highscores', data);
                                        })
                                    });

                                    socketClient.on('highscores', (data) => {
                                        data.forEach(highscore => {
                                            //console.log(highscore);
                                        });
                                        console.log("highscore");
                                        partieMulti = true;
                                        socket.emit('multi', { msg: 'START_SIMON' });
                                    });
                                });
                            }
                        }
                    }
                }
            });
        }
    });

    socket.on('playsound', (data) => {
        console.log("Joue le son " + data.number);
    });
});

ioMulti.on('connection', (socketMulti) => {
    console.log("User connected on multi websocket");

    socketMulti.on('player_info', (data) => {
        console.log("player_info");
        socketMulti.emit('player_info', actualUser);
    });

    socketMulti.on('simon', (data) => {
        console.log(data);
        socketMulti.broadcast.emit('simon', data);
    });

    socketMulti.on('highscores', (data) => {
        console.log("highscore");
        data.forEach(highscore => {
        });
        
        Score.find({ "userId": actualUser._id }, (err, data) => {
            if (err) console.error(err);
            socketMulti.emit('highscores', data);

            partieMulti = true;

            io.sockets.emit('multi', { msg: "START_SIMON" });
        });
    });
});
//#endregion

function isUserComplete() {
    if (actualUser == null) return false;
    else if (actualUser.color == null) return false;
    else if (actualUser.avatar.seed == null) return false;
    else return true;
}

function playSound(number) {
    if (config.arch == "raspberry") {
        let file = "./res/";
        switch (number) {
            case 0:
                file += "Do_1.mp3";
                break;
            case 1:
                file += "Re_1.mp3";
                break;
            case 2:
                file += "Mi_1.mp3";
                break;
            case 3:
                file += "Fa_1.mp3";
                break;
            case 4:
                file += "Sol_1.mp3";
                break;
            case 5:
                file += "La_1.mp3";
                break;
            case 6:
                file += "Si_1.mp3";
                break;
            case 7:
                file += "Do_2.mp3";
                break;
            case 8:
                file += "Re_2.mp3";
                break;
            case 9:
                file += "Mi_2.mp3";
                break;
        }

        console.log("Joue le son : " + file);
        exec('omxplayer', [file], (err, stdout, stderr) => {
            if (err) console.error(err);
            console.log("Sound played");
        });
    }
}