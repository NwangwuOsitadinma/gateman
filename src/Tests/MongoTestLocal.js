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

var UserModel = new mongoose.Schema({
    name: String
});
UserModel.loadClass(rolesAndAbilities);
var User = mongoose.model('User', UserModel);

function newClaim(req, res){
    myGateMan.createClaim(req.query.name, function(err, claim){
        if (err) { 
            res.json({err: err});
        } else {
            res.json({message: "Claim created successfully", claim: claim});
        }
    });
}
function newRole(req, res){
    myGateMan.createRole(req.query.name, function(err, role){
        if (err) {
            res.json({err: err});
        } else {
            res.json({message: 'Role created successfully', role: role});
        }
    });
}

app.get('/newClaim', newClaim);
app.get('/newRole', newRole);
app.get('/assignClaim', (req, res)=>{
    role.create({name: 'accountant'}, (err,role)=>{
        res.json({message: myGateMan.allow(role).to('edit')});
    })
});
app.get('/assignClaim/:name', (req, res)=>{
    role.findOne({name: req.params.name}, (err, role)=>{
        myGateMan.allow(role).to('edit');
    });
})
app.get('/assign/:name', (req, res)=>{
    User.create({name: req.params.name}, function(err, user){
        res.json(200, myGateMan.allow(user).to('edit'));
    });
});