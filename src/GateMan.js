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
      * creates a new gateman role 
     * @param {A string that represents the name of the claim you want to create} roleName
     * @returns Promise
     */
    createRole(roleName,){
        return role.create({name: roleName});
    }

    /**
     * deletes a gateman role
     * @param {A string that represents the name of the role to be deleted} roleName 
     * @returns Promise
     */
    removeRole(roleName){
        return role.findOneAndDelete({name: roleName});
    }
    /**
     * returns one gateman role specified by the name given
     * @param {A string that represents the name of the role to be returned} roleName 
     * @returns Promise
     */
    getRole(roleName){
        return role.findOne({name:roleName});
    }
    
    /**
     * Allows members of a role to perform a claim
     * @param {A mongoose object} role
     */
    allow(role){
        this.operation = 'allow';
        this.roler = role;
        return this;
    }

    /**
     * Dissallows a member of a role from performing a claim
     */
    dissallow(role){
        this.operation = 'dissallow';
        this.roler = role;
        return this;
    }

    /**
     * pass in the claim to be assigned to a role
     * @param {pass a claim as a string if you called allow} claimName 
     */
    to (claimName){
        return new Promise((resolve,reject)=>{
        if (this.operation == 'allow'){
            //find the role, allow was meant to do this
            role.findOne({name: this.roler}, (err, dbRole)=>{
                if (dbRole){
                    //assign role here
                    claim.where('name',claimName).limit(1).exec((err, c)=>{
                        if(c.length > 0){
                            roleClaim.create({role:dbRole._id,claim:c[0]._id},function(err,roleClaim){
                                if(err) reject(err);
                                resolve(true);//we should return a boolean instaed of the roleClaim(I don't thing it's needed for anything)
                            });
                        }else{
                            claim.create({name:claimName},(err,claimE) => { 
                                if(err) reject(err);
                                roleClaim.create({role:dbRole._id,claim:claimE._id},function(err,roleClaim){
                                    if(err) throw err;
                                    resolve(true);
                                });
                            });
                        }
                    });
                }else{
                    reject("role not found");
                }
            });
        }
    });
    }

    /**
     * pass in the claim
     * @param {the claim to retract from a role} claimName
     */
    from(claimName){
       return new Promise((resolve, reject)=>{
           if (this.operation == 'dissallow'){
            role.findOne({name: this.roler}, (err, role)=>{
                if (role){
                    claim.findOne({name: claimName}, (err, claim)=>{
                        if (err) {
                            reject(err);
                        } else {
                            roleClaim.findOneAndDelete({role: role, claim: claim}, (err)=>{
                            if (err) {
                                reject (err);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                    });
                }
            });
        }});
    }

    /**
     * Returns roles existing in the system
     * @returns {Promise}
     */
    getRoles(){
        return role.find({});
    }

    /**
     * Creates a new claim
     * @param {A string that represents the name of the claim} claimName 
     * @returns Promise 
     */
    createClaim(claimName){
        return claim.create({
            name: claimName
        });
    }


    /**
     * Deletes a gateman claim 
     * @param {A string that represents the name of the claim to be deleted} claimName 
     * @returns Promise
     */
    removeClaim(claimName){
        return claim.findOneAndDelete({name: claimName});
    }

    /**
     * Returns all claims existing in the system
     * @returns Promise
     */
    getClaims(){
        return claim.find({});
    }

    /**
     * Returns one claim that matches the claimName given
     * @param {String - The claimName you want to find} claimName 
     * @returns Promise
     */
    getClaim(claimName){
        return claim.findOne({name:claimName});
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

    /**
     * Checks if a Role can perform a Claim
     * @param {A string that represents the name of the role} roleName 
     */
    role(roleName){
        this.roleName = roleName;
        return this;
    }

    /**
     * Checks if a Role can perform a Claim
     * @param {A string that represents the name of the Claim} claimName 
     */
    can(claimName){
        //find claim, role, then check if it has the claimName
       return new Promise((resolve, reject)=>{
           claim.findOne({name: claimName}, (err, claim)=>{
               if (err){
                   reject(err);
               } else {
                   if (claim){
                        role.findOne({name: this.roleName}, (err, role)=>{
                            if (err) {
                                reject(err);
                            } else {
                                if (role){
                                    roleClaim.findOne({role: role._id, claim:claim._id}, (err, roleClaim)=>{
                                        if (err){
                                            reject(err);
                                        } else {
                                            if (roleClaim){
                                                resolve(true);
                                            } else {
                                                resolve(false);
                                            }
                                        }
                                    });
                                } else {
                                    resolve("role does not exist");
                                }
                            }
                            });
                   } else {
                       reject("claim does not exist");
                   }
               }
           });
       });
    }

    /**
     * Checks if a Role cannot perform a Claim
     * @param {A string that represents the name of the Claim} claimName 
     */
    cannot(claimName){
        //find claim, role, then check if it has the claimName
       return new Promise((resolve, reject)=>{
           claim.findOne({name: claimName}, (err, claim)=>{
               if (err){
                   reject(err);
               } else {
                   if (claim){
                        role.findOne({name: this.roleName}, (err, role)=>{
                            if (err) {
                                reject(err);
                            } else {
                                if (role){
                                    roleClaim.findOne({role: role._id, claim:claim._id}, (err, roleClaim)=>{
                                        if (err){
                                            reject(err);
                                        } else {
                                            if (roleClaim){
                                                resolve(false);
                                            } else {
                                                resolve(true);
                                            }
                                        }
                                    });
                                } else {
                                    resolve("role does not exist");
                                }
                            }
                            });
                   } else {
                       reject("claim does not exist");
                   }
               }
           });
       });
    }
}

module.exports = GateMan;