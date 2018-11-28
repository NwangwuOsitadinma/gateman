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
    modelName(){
        return 'Role'
    }
    /**
     * either assigns claim to a role or role to user
     * @param {pass a claim as a string if you called allow or a mongoose object as user if you called assign} claimOrUser 
     */
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
                userRole.f
                if(err) throw err;
                return usrRole;
            })
        } 
    }
    from(claimOrUser){
        if(typeof(claimOrUser) === "string"){
            claim.findOne({name:claimOrUser},(err,c) =>{
                if(c.length>0){
                    roleClaim.deleteOne({role:this._id,claim:c._id},(err) => {
                        if (err) throw err;
                        return true;
                    })
                }else{
                    return false
                }
            })
        } else{
            userRole.create({user:claimOrUser._id,role:this._id},(err,rc)=>{
                if(err) throw err;
                return rc;
            })
        }
    }

}

RoleSchema.loadClass(RoleMethods)

module.exports = mongoose.model('Role',RoleSchema); 