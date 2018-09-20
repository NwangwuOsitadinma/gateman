const mongoose = require('mongoose');

var RoleClaimSchema = mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }
})

module.exports = mongoose.model('RoleClaim',RoleClaimSchema);