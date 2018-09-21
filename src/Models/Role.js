const mongoose = require('mongoose');
const roleClaim = require('./RoleClaim');
const userRole = require('./UserRole');
const claim = require('./Claim');

var RoleSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,'Sorry, the role name is required'],
        unique: true
    }
});

RoleSchema.methods.to = (claimOrUser) =>{
    if(typeof claimOrUser === String){
        var c = claim.where('name',claimOrUser);
        if(c !== null){
            roleClaim.create({role:this._id,claim:c._id},function(err,roleClaim){
                if(err) throw err;
            })
        }else{
            claim.create({name:claimOrUser},(err,claimE) => {
                if(err) throw err;
                roleClaim.create({role:this._id,claim:claimE._id},function(err,roleClaim){
                    if(err) throw err;
                })
            })
        }
    }else{
        userRole.create({user:claimOrUser._id,role: this._id}, function(err,usrRole){
            if(err) throw err;
        })
    }

}
RoleSchema.methods.from = () => {
    
}

module.exports = mongoose.model('Role',RoleSchema); 