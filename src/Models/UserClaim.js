const mongoose = require('mongoose');

var UserClaimSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'Sorry, the user is required']
    },
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'Sorry, the claim is required']
    }
})

module.exports = mongoose.model('UserClaim',UserClaimSchema);