var chai = require('chai');
var should = chai.should();
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
var gateman = require('../GateMan');
var GateMan = new gateman(mongoose);


describe('Gateman', function(){
    beforeEach('ensuring the db is fresh',function(done){
        console.log('before');
        mongoose.connect('mongodb://localhost:27017/GateManTest',{useNewUrlParser: true});
        GateMan.removeClaim('turn-water-into-wine').then((d)=>{});
        done()
    });
    afterEach('ensuring everything is cleaned up',function(done){
        console.log('after');
        mongoose.disconnect();
        done();
    });

    describe('createClaim', function(){
        it ('should return a claim object if created successfully',(done)=>{
            
            var c = 'turn-water-into-wine';   
            GateMan.createClaim(c)
            .then((claim)=>{
                console.log(claim)
                should.equal(claim.name,c);
                done();
            });
        }).timeout(10000);
    });



    

});
