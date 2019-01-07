var chai = require('chai');
var should = chai.should();
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
var gateman = require('../GateMan');
var GateMan = new gateman(mongoose);


describe('Gateman Claims', function(){
    beforeEach('ensuring the db is fresh',function(done){
        console.log('before');
        mongoose.connect('mongodb://localhost:27017/GateManTest',{useNewUrlParser: true});
        GateMan.removeClaim('turn-water-into-wine')
        .then((d)=>{})
        .catch((err)=>{console.log(err)});
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
                should.equal(claim.name,c);
                done();
            })
            .catch((err)=>{
                console.log(err)
            });
        }).timeout(10000);
    });
    describe('removeClaim',function(){
        it('should not return anything if it actually deleted',(done)=>{
            var c = 'turn-water-into-wine';
            GateMan.createClaim(c)
            .then((claim)=>{
                return GateMan.removeClaim(claim.name)
            })
            .then((claim)=>{
                return GateMan.getClaim(claim.name)
            })
            .then((claim)=>{
                should.equal(claim,null);
                done();
            })
            .catch((err)=>{
                console.log(err)
            });

        }).timeout(10000);
    });

    describe('getClaim',function(){
        it('should return one valid claim',(done)=>{
            var c = 'turn-water-into-wine';
            GateMan.createClaim(c)
            .then((claim)=>{
                return GateMan.getClaim(claim.name);
            })
            .then((claim)=>{
                should.equal(claim.name,c);
                done();
            })
            .catch((err)=>{
                console.log(err)
            });
        }).timeout(10000);
    });

    describe('getClaims',function(){
        it('should return a collection of claims with at least one member',(done)=>{
            var c = 'turn-water-into-wine';
            GateMan.createClaim(c)
            .then((claim)=>{
                return GateMan.getClaims();
            })
            .then((claims)=>{
                claims.should.not.be.empty
                done()
            })
            .catch((err)=>{
                console.log(err)
            });
        }).timeout(10000);
    });

});

describe('Gateman Roles',function(){
    beforeEach('ensuring db is fresh',(done)=>{
        console.log('before roles');
        mongoose.connect('mongodb://localhost:27017/GateManTest',{useNewUrlParser: true});
        GateMan.removeRole('admin')
        .then((d)=>{})
        .catch((err)=>{console.log(err)});
        done()
    });
    afterEach('ensuring everything is cleaned up',function(done){
        console.log('after');
        mongoose.disconnect();
        done();
    });
    describe('createRole', function(){
        it ('should return a role object if created successfully',(done)=>{            
            var r = 'admin';   
            GateMan.createRole(r)
            .then((role)=>{
                should.equal(role.name,r);
                done();
            })
            .catch((err)=>{
                console.log(err)
            });
        }).timeout(10000);
    });
    describe('removeRole',function(){
        it('should not return anything if it actually deleted',(done)=>{
            var r = 'admin'; 
            GateMan.createRole(r)
            .then((role)=>{
                return GateMan.removeRole(role.name)
            })
            .then((role)=>{
                return GateMan.getRole(role.name)
            })
            .then((role)=>{
                should.equal(role,null);
                done();
            })
            .catch((err)=>{
                console.log(err)
            });

        }).timeout(10000);
    });

    describe('getRole',function(){
        it('should return one valid role',(done)=>{
            var r = "admin";
            GateMan.createRole(r)
            .then((role)=>{
                return GateMan.getRole(r);
            })
            .then((role)=>{
                should.equal(role.name,r);
                done()
            })
            .catch((err)=>{
                console.log(err);
            });
        }).timeout(10000);
    });

    describe('getRoles',function(){
        it('should return a collection of at least one valid role',(done)=>{
            var r = "admin";
            GateMan.createRole(r)
            .then((role)=>{
                return GateMan.getRoles();
            })
            .then((roles)=>{
                roles.should.not.be.empty;
                done();
            })
            .catch((err)=>{
                console.log(err)
            });
        }).timeout(10000)
    })
})

describe('Role and Claim Assignment', function(){
    beforeEach('ensuring everything is set up',function(done){
        console.log('before assignment');
        mongoose.connect('mongodb://localhost:27017/GateManTest',{useNewUrlParser: true});
        GateMan.removeClaim('turn-water-into-wine')
        .then((d)=>{})
        .catch((err)=>{console.log(err)});
        done()
    });
    afterEach('ensuring everything is cleaned up',function(done){
        console.log('after');
        mongoose.disconnect();
        done();
    });
})
