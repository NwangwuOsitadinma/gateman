const mongoose = require('mongoose');

var RoleClaimSchema = mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'Sorry, the role is required']
    },
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'Sorry! the claim is required']
    }
})

module.exports = mongoose.model('RoleClaim',RoleClaimSchema);