const mongoose = require('mongoose');

var RoleClaimSchema = mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('RoleClaim',RoleClaimSchema);