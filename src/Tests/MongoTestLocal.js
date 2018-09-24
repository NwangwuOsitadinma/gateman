var GateMan = require('../GateMan');
var mongoose = require('mongoose');
var express = require('express');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GateManTest');

var myGateMan = new GateMan();

app.listen(3000, function(err){
    console.log("Server started successfully...");
});

app.get('/newClaim', newClaim);

function newClaim(){
    myGateMan.createClaim('canCreate', function(err, claim){
        if (err) { 
            console.log(err);
        } else {
            console.log("Success -> " + claim);
        }
    });
}