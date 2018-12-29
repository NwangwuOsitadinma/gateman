var GateMan = require('../GateMan');
var rolesAndAbilities = require('../HasRolesAndAbilities');
var mongoose = require('mongoose');
var express = require('express');
var role = require('../Models/Role');
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GateManTest');

var myGateMan = new GateMan();

app.listen(3000, function(err){
    console.log("Server started successfully...");
});

var UserModel = new mongoose.Schema({
    name: String,
    phone: Number
});
// UserModel.loadClass(rolesAndAbilities);
//var User = mongoose.model('User', UserModel);

app.get('/allowRole/:role', (req, res)=>{
    myGateMan.Roles.createRole(req.params.role, (err, role)=>{
        res.json(myGateMan.allow(role.name).to('kill'));
    });
});
app.get('/dissallow/:role/:claim',(req, res)=>{
    res.json(myGateMan.Roles.dissallow(req.params.role).from(req.params.claim));
});
app.get('/roles', (req, res)=>{
    myGateMan.getRoles((err, data)=>{
        res.json(data);
    });
});
app.get('/c', (req, res)=>{

    myGateMan.getRoleClaims('accountant', (err, data)=>{
        res.json(data);
    });
});