const mongoose = require('mongoose');

var RoleSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,'Sorry, the role name is required'],
        unique: [true,'Sorry, the role already exists']
    }
})

module.exports = mongoose.model('Role',RoleSchema); 