var role = require('./Models/Role');
var claim = require('./Models/Claim');
var roleClaim = require('./Models/RoleClaim');

class GateMan {

    /**
     * Provide a valid mongoose connection object that will be used to store application credentials
     * @param {A mongoose connection object} mongoose 
     */
    constructor(mongoose){
        role = role(mongoose);
        claim = claim(mongoose);
        roleClaim = roleClaim(mongoose);
    }

     /**
     * @param {A string that represents the name of the claim you want to create} roleName
     * @param {A callback function that runs after the claim has been created} cb
     */
    createRole(roleName,cb){
        role.create({name: roleName},cb);
    }

    /**
     * Deletes a role from the system
     * @param {A string that represents the name of the role to be deleted} roleName 
     */
    removeRole(roleName){
        role.findOneAndDelete({name: roleName}, (err)=>{
            return;
        });
    }
    
    /**
     * Allows members of a role to perform a claim
     * @param {A mongoose object} role
     */
    allow(role){
        this.operation = 'allow';
        this.role = role;
        return this;
    }

    /**
     * Dissallows a member of a role from performing a claim
     */
    dissallow(role){
        this.operation = 'dissallow';
        this.role = role;
        return this;
    }

    /**
     * pass in the claim to be assigned to a role
     * @param {pass a claim as a string if you called allow} claimOrUser 
     */
    to (claimOrUser){
        if (this.operation == 'allow'){
            //find the role, allow was meant to do this
            role.findOne({name: this.role}, (err, dbRole)=>{
                if (dbRole){
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
                }else{
                    return "role not found";
                }
            });
        }
    }

    /**
     * pass in the claim
     * @param {the claim to retract from a role} Claim
     */
    from(Claim){
        if (this.operation == 'dissallow'){
            role.findOne({name: this.role}, (err, role)=>{
                if (role){
                    claim.findOne({name: Claim}, (err, claim)=>{
                        roleClaim.findOneAndDelete({role: role, claim: claim}, (err)=>{
                            return;
                        });
                    });
                }
            });
        }
    }

    /**
     * Returns roles existing in the system
     * @param {Callback function} cb 
     */
    getRoles(cb){
        role.find({}, cb);
    }

    /**
     * Creates a new claim
     * @param {A string that represents the name of the claim} claimName 
     * @param {A callback function that runs after the claim has been created} cb 
     */
    createClaim(claimName, cb){
        claim.create({name: claimName}, cb);
    }


    /**
     * Deletes a claim from the system
     * @param {A string that represents the name of the claim to be deleted} claimName 
     */
    removeClaim(claimName){
        claim.findOneAndDelete({name: claimName}, (err)=>{
            return;
        });
    }

    /**
     * Returns all claims existing in the system
     * @param {A callback function that runs after claims have been found} cb 
     */
    getClaims(cb){
        claim.find({}, cb);
    }


    /**
     * Returns an array of claims a role can perform
     * @param {A string that represents the name of the role} roleName 
     * @param {A callback function that runs after claims are found} cb 
     */
    getRoleClaims(roleName, cb){
        role.findOne({name: roleName}, (err, role)=>{
            if (role){
                roleClaim.find({role: role._id}, cb);
            }
        });
    }
}

module.exports = GateMan;