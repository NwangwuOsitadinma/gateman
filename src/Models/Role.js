const mongoose = require('mongoose');
const roleClaim = require('./RoleClaim');
const userRole = require('./UserRole');
const claim = require('./Claim');
var rolesAndAbilities = require('../HasRolesAndAbilities');

var RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Sorry, the role name is required'],
        unique: true
    }
});


//RoleSchema.loadClass(RoleMethods);

module.exports = mongoose.model('Role',RoleSchema);