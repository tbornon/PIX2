var wifi = require('node-wifi');

// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null
});

// Scan networks
wifi.scan(function(err, networks) {
    if (err) {
        console.log(err);
    } else {
        for(var i = 0; i < networks.length; i++) {
            if(networks[i].ssid.indexOf('[PIX2]') !== -1) {
                console.log(networks[i]);

                wifi.connect({ssid: networks[i].ssid, password: 'testtest'}, (err) => {
                    if(err) console.error(err);
                    console.log("Connected")
                })
            }
        }
    }
});