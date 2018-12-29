const role = require('./Models/Role');
const claim = require('./Models/Claim');
const roleClaim = require('./Models/RoleClaim');
const userClaim = require('./Models/UserClaim');
const userRole = require('./Models/UserRole');
const hasRoleAndAbilities = require('./HasRolesAndAbilities');
var mongoose = require('mongoose');

var Role = role;

class GateMann {
    to (claimOrUser){
        //find the role, allow was meant to do this
        Role.findOne({name: this.role}, (err, dbRole)=>{
            if (dbRole){
                console.log("I found a role ooo");
                //assign role here
                claim.where('name',claimOrUser).limit(1).exec((err, c)=>{
                    if(c.length > 0){
                        roleClaim.create({role:dbRole._id,claim:c[0]._id},function(err,roleClaim){
                            if(err) throw err;
                            return roleClaim;
                        });
                    }else{
                        claim.create({name:claimOrUser},(err,claimE) => {
                            if(err) throw err;
                            roleClaim.create({role:dbRole._id,claim:claimE._id},function(err,roleClaim){
                                 if(err) throw err;
                                return roleClaim;
                            });
                        });
                    }
                }); 
            }
        });
    }
    /**
     * Allows members of a role or a user to perform a claim
     * @param {A mongoose object} roleOrUser
     */
    allow(role){
        console.log("I WANT TO RETURN");
        this.role = role;
        return this;
    }
}
//RoleSchema.loadClass(RoleMethods)

module.exports = GateMann;