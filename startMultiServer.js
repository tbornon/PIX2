const io = require('socket.io-client');
const fs = require('fs');
const { spawn } = require('child_process');

// Connexion à la websocket
const socket = io('http://localhost:3000');

var file =
    `interface=wlan0
driver=nl80211
ssid=${process.argv[2]}
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

fs.writeFile('./hostapd.conf', file, (err) => {
    if (err) console.error(err);
    console.log("Config file written !");

    let ls = spawn('stdbuf', ['-i0', '-o0', '-e0', 'hostapd', 'hostapd.conf']);

    // Lecture des données entrantes
    ls.stdout.on('data', (data) => {
        if (data.indexOf("AP-ENABLED") !== -1) {
            console.log("AP point created successfuly");
            socket.emit('multi', { msg: "AP-ENABLED" })
        }
    });

    // Lecture des erreurs entrantes
    ls.stderr.on('data', (data) => {
        console.error(data);
    });

    // Lors de la fermeture du process
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});
