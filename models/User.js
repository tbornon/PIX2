var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    avatar: {
        seed: Number,
        gender: String
    },
    color: String,
    mainUser: Boolean
})

var User = mongoose.model('User', userSchema)

module.exports = User