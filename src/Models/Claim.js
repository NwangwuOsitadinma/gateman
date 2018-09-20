const mongoose = require('mongoose');

var ClaimSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,'Sorry, the claim is required'],
        unique: [true,'Sorry, this claim already exists']
    }
})

module.exports = mongoose.model('Claim',ClaimSchema);