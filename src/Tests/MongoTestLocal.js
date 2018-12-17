var GateMan = require('../GateMan');
var rolesAndAbilities = require('../HasRolesAndAbilities');
var mongoose = require('mongoose');
var express = require('express');
var role = require('../Models/Role')
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GateManTest');

var myGateMan = new GateMan();

app.listen(3000, function(err){
    console.log("Server started successfully...");
});

// var UserModel = new mongoose.Schema({
//     name: String
// });
// UserModel.loadClass(rolesAndAbilities);
// var User = mongoose.model('User', UserModel);

app.get('/allowRole/:role', (req, res)=>{
    myGateMan.Roles.createRole(req.params.role, (err, role)=>{
        res.json(myGateMan.Roles.allow(role.name).to('kill'));
    });
});