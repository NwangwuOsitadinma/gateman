var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
// var gateman = require('../GateMan');
// var GateManClsss = require('../../index').GateMan(mongoose);
const hasRolesAndClaims = require('../../index').hasRolesAndClaims(mongoose);

var UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

UserSchema.loadClass(hasRolesAndClaims);
var userModel = mongoose.model('User',UserSchema);

describe('Roles and Abilities with Mongoose Objects',function(){
    before('ensuring db is fresh',async()=>{
        await mongoose.connect('mongodb://localhost:27017/GateManTest',{useNewUrlParser: true});
        await userModel.create({
            name: 'chioma',
            email: 'random@server.ng' 
        });
    });
    after('ensuring everything is cleaned up',function(done){
        mongoose.disconnect();
        userModel.findOneAndDelete({
            name: 'chioma',
            email: 'random@server.ng' 
        });
        
        done();
    });

    it('should allow user perform a claim', async ()=> {
        let user = await userModel.findOne({name: "chioma"});
        await user.allow('add');
        let hasClaim = await user.can('add');
        expect(hasClaim).to.be.true;
    });

    it('should check if user belongs to a role', async ()=> {
        let user = await userModel.findOne({name: "chioma"});
        let hasRole = await user.isAn('admin'); //role exists
        expect(hasRole).to.be.false;
    });

    it('should assign role to user', async ()=> {
        let user = await userModel.findOne({name: "chioma"});
        await user.assign('admin');
        let hasRole = await user.isAn('admin'); //role exists
        expect(hasRole).to.be.true;
    });

    it('should get user roles', async ()=> {
        let user = await userModel.findOne({name: "chioma"});
        let roles = await user.getRolesForUser();
        expect(roles).to.have.members(['admin']);
    });

    it('should get user claims', async ()=> {
        let user = await userModel.findOne({name: "chioma"});
        let claims = await user.getClaimsForUser();
        expect(claims).to.have.members(['add','delete']);
    });

    it('should retract role from user', async ()=> {
        let user = await userModel.findOne({name: "chioma"});
        await user.retract('admin');
        let hasRole = await user.isAn('admin'); //role exists
        expect(hasRole).to.be.false;
    });

});