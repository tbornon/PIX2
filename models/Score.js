var mongoose = require('mongoose');

var scoreSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    game: String,
    score: Number
});

scoreSchema.statics.findMax = function (game, quantity, callback) {
    this.find({game: game}) // 'this' now refers to the Member class
        .sort('-score')
        .limit(parseInt(quantity))
        .exec(callback);
}

var Score = mongoose.model('Score', scoreSchema);

module.exports = Score;