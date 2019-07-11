var role = require('./Models/Role');
var claim = require('./Models/Claim');
var roleClaim = require('./Models/RoleClaim');

class GateMan {

    /**
     * Contains methods for managing application roles and claims
     * * Provide a valid mongoose connection object that will be used to store application credentials
     * @mongoose a mongoose connection object
     */
    constructor(mongoose){
        role = role(mongoose);
        claim = claim(mongoose);
        roleClaim = roleClaim(mongoose);
    }

     /**
     * creates a new gateman role and returns a role
     * @param roleName {String} A string that represents the name of the role to be created
     * #### Usage
     ```
     gateman.createRole("rolename").then((role)=>{
        console.log(role);
    }).catch((err)=>{
        console.log(err);
    });
    ```
     */
    createRole(roleName){
        if (roleName=="") return "role name cannot be empty";
        return new Promise((resolve,reject)=>{
            role.findOne({name: roleName}, (err, dbRole)=>{
                if (err){
                   reject(err)
                } else if(dbRole){
                    resolve(dbRole)
                }else{
                    role.create({name: roleName}, (err, newDbRole)=>{
                        if(err)reject(err)
                        resolve(newDbRole)
                    });
                }
            });
        })
    }

    /**
     * deletes an existing gateman role, does nothing if role does not exist
     * @param roleName {String} A string that represents the name of the role to be removed
     * #### Usage
     ```
     gateman.removeRole("rolename");
     ``` 
     */
    removeRole(roleName){
        return role.findOneAndDelete({name: roleName});
    }
    /**
     * returns a gateman role specified by the name given
     * @param roleName {String} A string that represents the name of the role to be returned
     * #### Usage
     ```
     gateman.getRole("rolename").then((role)=>{
         console.log(role);
     });
     ```
     */
    getRole(roleName){
        return role.findOne({name:roleName});
    }
    
    /**
     * Allows members of a role to perform a claim
     * @param role {String} the rolename
     * #### Usage
     ```
     gateman.allow("rolename").to("claim").then(result=>{
        //result is true if claim was assigned successfully
    }).catch(err=>{
        //err contains the error message, if any
    });
     ```
     */
    allow(role){
        this.operation = 'allow';
        this.roler = role;
        return this;
    }

    /**
     * Dissallows a member of a role from performing a claim
     * @param role {String} the rolename
     * #### Usage
     ```
     gateman.disallow('rolename').from('claim').then(result=>{
        //result is true if claim was retracted
    }).catch(err=>{
        //err contains any error message, if any
    });
    //Gateman does nothing if the role doesn't possess the claim
     ```
     */
    disallow(role){
        this.operation = 'dissallow';
        this.roler = role;
        return this;
    }

    /**
     * pass in the claim to be assigned to a role
     * @param claimName {String} pass a claim as a string if you called allow
     * #### Usage
     ```
     gateman.allow("rolename").to("claim").then(result=>{
        //result is true if claim was assigned successfully
    }).catch(err=>{
        //err contains the error message, if any
    });
     ```
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
                            roleClaim.findOne({role:dbRole._id, claim:c[0]._id}, (err, rlclm)=>{
                                if (err) {
                                    reject(err);
                                } else {
                                    if (rlclm){
                                        reject("Claim has already been assigned to Role");
                                    } else {
                                        roleClaim.create({role:dbRole._id,claim:c[0]._id},function(err,roleClaim){
                                            if(err) reject(err);
                                            resolve(true);//we should return a boolean instaed of the roleClaim(I don't thing it's needed for anything)
                                        });
                                    }
                                }
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
     * pass in the claim to be retracted from a role
     * @param claimName {String} the claim to retract from a role
     * #### Usage
     ```
     gateman.disallow('rolename').from('claim').then(result=>{
        //result is true if claim was retracted
    }).catch(err=>{
        //err contains any error message, if any
    });
    //Gateman does nothing if the role doesn't possess the claim
     ```
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
     * Returns existing roles in the system
     * #### Usage
     ```
     gateman.getRoles().then(roles=>{
        //roles is a collection of existing roles
    }).catch(err=>{
        //err contains the error message, if any
    });
     ```
     */
    getRoles(){
        return role.find({});
    }

    /**
     * Creates a new claim
     * @param claimName {String} A string that represents the name of the claim
     * #### Usage
     ```
     gateman.createClaim("delete").then((claim)=>{
        console.log(claim);
    }).catch((err)=>{
        console.log(err);
    });
     ```
     * @returns Promise 
     */
    createClaim(claimName){

        if (claimName=="") return "claim name cannot be empty";
        return new Promise((resolve,reject)=>{
            claim.findOne({name: claimName})
            .then((dbClaim)=>{
                if(dbClaim){
                    resolve(dbClaim);
                }else{
                    return claim.create({name: claimName})
                }
            }).then((newDbClaim)=>{
                resolve(newDbClaim)
            }).catch((err)=>{
                reject(err);
            })
        })
        // return new Promise((resolve, reject)=>{
        //     claim.findOne({name: claimName}, (err, dbClaim)=>{
        //         if(err){
        //             reject(err)
        //         }
        //         else if (dbClaim){
        //             resolve(dbClaim)
        //         } else {
        //              claim.create({name: claimName}, (err, newDbClaim)=>{
        //                  if(err)reject(err)
        //                  resolve(newDbClaim)
        //              });
        //         }
        //     });
        // })
    }


    /**
     * Deletes an existing claim 
     * @param claimName {String} A string that represents the name of the claim to be deleted 
     * #### Usage
     ```
     gateman.removeClaim("claimname");
     ``` 
     */
    removeClaim(claimName){
        return claim.findOneAndDelete({name: claimName});
    }

    /**
     * Returns all claims existing in the system
     * #### Usage
     ```
     gateman.getClaims().then(claims=>{
        //claims is a collection of existing claims
    }).catch(err=>{
        //err contains the error message, if any
    });
     ```
     */
    getClaims(){
        return claim.find({});
    }

    /**
     * Returns one claim that matches the claimName given
     * @param claimName {String} - The name of the claim to find
     * #### Usage
     ```
     gateman.getClaim().then(claim=>{
        //use claim here
    }).catch(err=>{
        //err contains the error message, if any
    });
     ```
     */
    getClaim(claimName){
        return claim.findOne({name:claimName});
    }


    /**
     * Returns an array of claims a role can perform
     * @param roleName {String} represents the name of the role
     * @param cb {Function} A callback function that runs after claims are found
     * #### Usage
     ```
     gateman.getRoleClaims("admin", function(err, claims){
         console.log(claims);
     })
     ```
     */
    getRoleClaims(roleName, cb){
        role.findOne({name: roleName}, (err, role)=>{
            if (role){
                roleClaim.find({role: role._id}, cb);
            }
        });
    }

    /**
     * Checks if a Role can perform a Claim, must be used with `can`
     * @param roleName {String} A string that represents the name of the role 
     * #### Usage
     ```
     gateman.role('rolename').can('claimname').then(result=>{
        //result is true if the claim has been assigned, else it will be false
    });
     ```
     */
    role(roleName){
        this.roleName = roleName;
        return this;
    }

    /**
     * Checks if a Role can perform a Claim, must be used after `gateman.role()`
     * @param claimName {String} A string that represents the name of the Claim 
     * #### Usage
      ```
     gateman.role('rolename').can('claimname').then(result=>{
        //result is true if the claim has been assigned, else it will be false
    });
     ```
     */
    can(claimName){

        //find claim, role, then check if it has the claimName
        return new Promise((resolve,reject)=>{
            claim.findOne({name: claimName})
            .then((claim)=>{
                if(claim){
                    return role.findOne({name: this.roleName});
                }else{
                    reject('Claim does not exist');
                }
            }).then((role)=>{
                if(role){
                    return roleClaim.findOne({role: role._id, claim: claim._id});
                }else{
                    reject('Role does not exist');
                }
            }).then((roleClaim) =>{
                if(roleClaim){
                    resolve(true);
                }else{
                    resolve(false);
                }
            }).catch((err)=>{
                reject(err);
            });
        })
        
    //    return new Promise((resolve, reject)=>{
    //        claim.findOne({name: claimName}, (err, claim)=>{
    //            if (err){
    //                reject(err);
    //            } else {
    //                if (claim){
    //                     role.findOne({name: this.roleName}, (err, role)=>{
    //                         if (err) {
    //                             reject(err);
    //                         } else {
    //                             if (role){
    //                                 roleClaim.findOne({role: role._id, claim:claim._id}, (err, roleClaim)=>{
    //                                     if (err){
    //                                         reject(err);
    //                                     } else {
    //                                         if (roleClaim){
    //                                             resolve(true);
    //                                         } else {
    //                                             resolve(false);
    //                                         }
    //                                     }
    //                                 });
    //                             } else {
    //                                 resolve("role does not exist");
    //                             }
    //                         }
    //                         });
    //                } else {
    //                    reject("claim does not exist");
    //                }
    //            }
    //        });
    //    });
    }

    /**
     * Checks if a Role cannot perform a Claim, must be used after `gateman.role()`
     * @param claimName {String} A string that represents the name of the Claim 
     * #### Usage
      ```
     gateman.role('rolename').cannnot('claimname').then(result=>{
        //result is false if the claim has been assigned, else it will be true
    });
     ```
     */
    cannot(claimName){
        return new Promise((resolve, reject) => {
            claim.findOne({name: claimName})
            .then((claim)=>{
                if(claim){
                    return role.findOne({name: this.roleName})
                }else{
                    reject('Claim does not exist');
                }
            }).then((role) => {
                if(role){
                    return roleClaim.findOne({role: role._id, claim:claim_id});
                }else{
                    reject('Role does not exist')
                }                
            }).then((roleClaim) => {
                if(roleClaim){
                    resolve(false);
                } else{
                    resolve(true);
                }
            }).catch((err) => {
                reject(err);
            })
        })

        //find claim, role, then check if it has the claimName
    //    return new Promise((resolve, reject)=>{
    //        claim.findOne({name: claimName}, (err, claim)=>{
    //            if (err){
    //                reject(err);
    //            } else {
    //                if (claim){
    //                     role.findOne({name: this.roleName}, (err, role)=>{
    //                         if (err) {
    //                             reject(err);
    //                         } else {
    //                             if (role){
    //                                 roleClaim.findOne({role: role._id, claim:claim._id}, (err, roleClaim)=>{
    //                                     if (err){
    //                                         reject(err);
    //                                     } else {
    //                                         if (roleClaim){
    //                                             resolve(false);
    //                                         } else {
    //                                             resolve(true);
    //                                         }
    //                                     }
    //                                 });
    //                             } else {
    //                                 resolve("role does not exist");
    //                             }
    //                         }
    //                         });
    //                } else {
    //                    reject("claim does not exist");
    //                }
    //            }
    //        });
    //    });
    }
}

module.exports = GateMan;