const mongoose = require('mongoose');
const roleClaim = require('./RoleClaim');
const userRole = require('./UserRole');
const claim = require('./Claim');
var rolesAndAbilities = require('../HasRolesAndAbilities');

var RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Sorry, the role name is required'],
        unique: true
    }
});

class RoleMethods{
    to (claimOrUser){
        console.log("Role TO was called")
        if (claimOrUser == null){
             return console.log("I stopped because I was null")
        }
        if(typeof(claimOrUser) === "string"){
          claim.where('name',claimOrUser).limit(1).exec((err, c)=>{
            if(c.length > 0){
                roleClaim.create({role:this._id,claim:c[0]._id},function(err,roleClaim){
                    if(err) throw err;
                    return roleClaim;
                });
            }else{
                claim.create({name:claimOrUser},(err,claimE) => {
                    if(err) throw err;
                    roleClaim.create({role:this._id,claim:claimE._id},function(err,roleClaim){
                        if(err) throw err;
                        return roleClaim;
                    });
                });
            }
        });
        } else{
            userRole.create({user:claimOrUser._id,role: this._id}, function(err,usrRole){
                if(err) throw err;
                return usrRole;
            })
        } 
}
    modelName(){
        return 'Role'
    }
}

RoleSchema.loadClass(RoleMethods)

module.exports = mongoose.model('Role',RoleSchema); 