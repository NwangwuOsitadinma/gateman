const mongoose = require('mongoose');

var RoleClaimSchema = mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('RoleClaim',RoleClaimSchema);