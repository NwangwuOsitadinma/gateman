var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GateManTest');

var GateMan = require('../GateMan');
var rolesAndAbilities = require('../HasRolesAndAbilities');
var express = require('express');
var role = require('../Models/Role');
var app = express();

app.listen(3000, function(err){
    console.log("Server started successfully...");
});

var myGateMan = new GateMan(mongoose);
var UserModel = new mongoose.Schema({
    name: String,
    phone: Number
});
new rolesAndAbilities(mongoose);
UserModel.loadClass(rolesAndAbilities);
var User = mongoose.model('Person', UserModel);

app.get('/allowRole/:role', (req, res)=>{
    myGateMan.Roles.createRole(req.params.role, (err, role)=>{
        res.json(myGateMan.allow(role.name).to('kill'));
    });
});
app.get('/dissallow/:role/:claim',(req, res)=>{
    res.json(myGateMan.dissallow(req.params.role).from(req.params.claim));
});
app.get('/roles', (req, res)=>{
    myGateMan.getRoles((err, data)=>{
        res.json(data);
    });
});
app.get('/mon',(req, res)=>{
   res.json(mongoose.modelNames());
});
app.get('/c/:claim', (req, res)=>{
    User.findOne({name: "ibe", phone: 090909}, async (err, user)=>{
        // var k = user.can("edit");
        // console.log(k)
        //user.assign("teacher");
        if (user){
            var a = await user.isNotAn(req.params.claim)//still not fluent
        console.log(a);
        res.json(a);
        }
        
    });
});