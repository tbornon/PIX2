var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String, 
    avatar: {
        seed: Number,
        gender: String
    }
})

