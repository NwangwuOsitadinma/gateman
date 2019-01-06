var assert =  require('assert');
var should = require('chai').should();
var expect = require('chai').expect();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GateManTest');
var Gateman = require('../GateMan')(mongoose);


describe('Gateman', function(){
    describe('createClaim', function(){
        it ('should return a claim object if created successfully',function(done){
            Gateman.createClaim('turn-water-into-wine',(claim)=>{
                assert.equal(claim,!null);
            })
        })
    })
})
