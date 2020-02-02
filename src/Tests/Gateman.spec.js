var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
var gateman = require('../GateMan');
var GateMan = new gateman(mongoose);


describe('Gateman Claims', function(){
    before('ensuring the db is fresh',function(done){
        mongoose.connect('mongodb://localhost:27017/GateManTest',{useNewUrlParser: true});
        done();
    });
    after('ensuring everything is cleaned up',function(done){
        mongoose.disconnect();
        done();
    });

    describe('createClaim', function () {
        it('should return a claim object if created successfully', async() => {
            var c = 'turn-water-into-wine';
            let claim = await GateMan.createClaim(c);
            should.equal(claim.name, c);
        }).timeout(10000);
    });

    describe('removeClaim', function(){
        it('should not return anything if it actually deleted', async()=>{
            var c = 'turn-water-into-wine';
            let claim = await GateMan.createClaim(c);
            await GateMan.removeClaim(claim.name);
            let clm = await GateMan.getClaim(claim.name);
            should.equal(clm,null);
        }).timeout(10000);
    });

    describe('getClaim',function(){
        it('should return one valid claim', async()=>{
            var c = 'turn-water-into-wine';
            let claim = await GateMan.createClaim(c);
            await GateMan.getClaim(c);
            should.equal(claim.name,c);
        }).timeout(10000);
    });

    describe('getClaims',function(){
        it('should return a collection of claims with at least one member', async()=>{
            var c = 'turn-water-into-wine';
            var c2 = 'claim2';
            await GateMan.createClaim(c);
            await GateMan.createClaim(c2);
            let claims = await GateMan.getClaims();
            claims.should.not.be.empty;
        }).timeout(10000);
    });

});

describe('Gateman Roles',function(){
    before('ensuring db is fresh',(done)=>{
        mongoose.connect('mongodb://localhost:27017/GateManTest',{useNewUrlParser: true});
        done();
    });
    after('ensuring everything is cleaned up',function(done){
        mongoose.disconnect();
        done();
    });
    describe('createRole', function(){
        it ('should return a role object if created successfully', async()=>{            
            var r = 'admin';
            let role = await GateMan.createRole(r);
            should.equal(role.name,r);
        }).timeout(10000);
    });
    describe('removeRole',function(){
        it('should not return anything if it actually deleted',async ()=>{
            var r = 'roler'; 
            let role = await GateMan.createRole(r);
            await GateMan.removeRole(role.name);
            let rol = await GateMan.getRole(role.name);
            should.equal(rol, null);
        }).timeout(10000);
    });

    describe('getRole',function(){
        it('should return one valid role', async()=>{
            var r = "admin";
            await GateMan.createRole(r)
            let role = await GateMan.getRole(r);
            should.equal(role.name,r);
        }).timeout(10000);
    });

    describe('getRoles',function(){
        it('should return a collection of at least one valid role', async()=>{
            var r = "admin";
            await GateMan.createRole(r);
            let roles = await GateMan.getRoles();
            roles.should.not.be.empty;
        }).timeout(10000)
    });

    describe('Roles with claims', function(){
        it('should return a role that has 2 claims', async()=>{
            await GateMan.createRole('admin');
            await GateMan.allow('admin').to('add');
            await GateMan.allow('admin').to('delete');
            let roleClaims = await GateMan.getRoleClaims('admin');
            expect(roleClaims).to.be.an('array');
            expect(roleClaims).to.have.members(['add','delete']);
        });

        it('should return a role that has no claims', async()=>{
            await GateMan.createRole('teacher');
            await GateMan.allow('teacher').to('add');
            await GateMan.disallow('teacher').from('add');
            let roleClaims = await GateMan.getRoleClaims('teacher');
            expect(roleClaims).to.be.an('array');
            expect(roleClaims).to.have.members([]);
        });

        it('should return true if role has claim', async ()=> {
            await GateMan.createRole('manager');
            await GateMan.createClaim('edit');
            await GateMan.allow('manager').to('edit');
            let hasClaim = await GateMan.role('manager').can('edit');
            expect(hasClaim).to.be.true;
        });

        it('should return false if role does not have claim', async ()=> {
            await GateMan.createRole('manager');
            let hasClaim = await GateMan.role('manager').can('add');
            expect(hasClaim).to.be.false;
        });

        it('should return false if role has claim', async ()=> {
            await GateMan.createRole('manager');
            await GateMan.createClaim('edit');
            await GateMan.allow('manager').to('edit');
            let hasClaim = await GateMan.role('manager').cannot('edit');
            expect(hasClaim).to.be.false;
        });

        it('should return true if role does not have claim', async ()=> {
            await GateMan.createRole('manager');
            let hasClaim = await GateMan.role('manager').cannot('delete');
            expect(hasClaim).to.be.true;
        });

    });
});