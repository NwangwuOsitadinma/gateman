var userClaim = require('./Models/UserClaim');
var userRole =  require('./Models/UserRole');
var role = require('./Models/Role');
var roleClaim = require('./Models/RoleClaim');
var claim = require('./Models/Claim');

class HasRolesAndClaims {
    /**
     * Provide a valid mongoose connection object that will be used to store application credentials
     * @param {A mongoose connection object} mongoose 
     */
    constructor(mongoose){
        userClaim = userClaim(mongoose);
        userRole = userRole(mongoose);
        role = role(mongoose);
        claim = claim(mongoose);
        roleClaim = roleClaim(mongoose);
    }

    /**
     * allows a user perform a claim, does nothing if user already has the claim
     * @param {A string that represents the claim  you want to assign to a user} claimName 
     */

  allow(claimName){
        return new Promise ((resolve,reject)=>{
            claim.findOne({name: claimName}, (err, claim)=>{
                if(claim){
                    userClaim.findOne({user:this._id,claim:claim._id},(e,uc)=>{
                        if(e){
                            reject(e)
                        }
                        else if(uc){
                            reject({
                                message: "this claim was already assigned to the user"
                            });
                        } else{
                            userClaim.create({user:this._id,claim:claim._id},(err,usrClaim) => {
                                if(err) reject(err);
                                resolve(usrClaim);
                            });
                        }
                        
                    });
                } else{
                    reject({
                        message: "The claim does not exist. Consider creating it first"
                    });
                }
            });
        });
    }

    /**
     * disallows a user from performing a particular claim
     * @param {A string that represents the claim you want to retract from a user} claimName 
     */
    disallow(claimName){
        return new Promise((resolve,reject)=>{
            claim.findOne({name: claimName}, (err, claim)=>{
                if(claim){
                    userClaim.findOne({user:this._id,claim:claim._id}, (e,uc)=>{
                        if(e){
                            reject(e)
                        }else if(uc){
                            userClaim.delete({user:this._id,claim:uc._id},(err,usrClaim)=>{
                                if(err) reject(err);
                                resolve(usrClaim);
                            })
                        } else{
                            reject({
                                message: "this claim was not assigned to the user"
                            });
                        }
                    });
                }else{
                    reject({
                        message: "The claim does not exist. Consider creating it first"
                    });
                }
            });
        });
    }

    /**
     * assigns a role to a user directly
     * @param {A string that represents the role you want to assign to a user} roleName 
     */

    assign(roleName){
        return new Promise ((resolve,reject)=>{
            role.findOne({name: roleName}, (err, role)=>{
                if(role){
                    userRole.findOne({user:this._id,role:role._id},(e,rc)=>{
                        if(e){
                            reject(e)
                        }
                        else if(rc){
                            reject({
                                message: "this role was already assigned to the user"
                            });
                        } else{
                            userRole.create({user:this._id,role:role._id},(err,usrRole) => {
                                if(err) reject(err);
                                resolve(usrRole);
                            });
                        }
                        
                    });
                } else{
                    reject({
                        message: "The role does not exist. Consider creating it first"
                    });
                }
            });
        });
    }

    /**
     * retracts a role from a user directly
     * @param {A string that represents the role you want to retract from the user} roleName 
     */
    retract(roleName){
        return new Promise((resolve,reject)=>{
            role.findOne({name: roleName},(err,role)=>{
                if(role){
                    userRole.findOne({user:this._id,role:role._id},(e,rc)=>{
                        if(e){
                            reject(e)
                        }else if(rc){
                            userRole.delete({user:this._id,role:role._id},(err,usrRole)=>{
                                if(err) reject(err);
                                resolve(usrRole);
                            });
                        }else{
                            reject({
                                message: "this role was not assigned to the user"
                            });
                        }
                    });
                }else{
                    reject({
                        message: "The role does not exist. Consider creating it first"
                    });
                }
            });
        });
    }

    /**
     * checks whether a user has the ability to perform an action
     * @param {a string representing the claim name} claimName 
     */
    can(claimName){
        return new Promise ((resolve,reject)=>{
            claim.findOne({name: claimName}, (err,c)=>{
                if(c){
                    userRole.find({user:this._id},(e,ur) =>{
                        if(e){
                            reject(e)
                        } 
                        else if(ur){
                            ur.forEach((u) => {
                                roleClaim.findOne({role:u.role,claim:c._id},(err,rc)=>{
                                    if(err){
                                        reject(err)
                                    }
                                    else if(rc){
                                        resolve(true);
                                    }else{
                                        userClaim.findOne({user:u.user,claim:c._id},(err,uc)=>{
                                            if(err){
                                                reject(err);
                                            }
                                            else if(uc){
                                                resolve (true);
                                            }else{
                                                resolve(false);
                                            }
                                        });
                                    }
                                });
                            });
                        }else{
                            userClaim.findOne({user:u.user,claim:claimName},(err,uc)=>{
                                if(err){
                                    reject(err);
                                }
                                else if(uc){
                                    resolve (true);
                                }else{
                                    resolve(false);
                                }
                            });
                        }
                    });
                } else{
                    reject("Error, user or claim does not exist");
                }
            });
        });
    }

    /**
     * checks whether a user does not have the ability to perform an action
     * @param {a string representing the claim name} claimName
     */
    cannot(claimName){
        return new Promise((resolve,reject)=>{
            claim.findOne({name: claimName},(err,c)=>{
                if(c){
                    userRole.find({user:this._id},(e,urs)=>{
                        if(e){
                            reject(e);
                        }else if(urs){
                            urs.forEach((ur)=>{
                                roleClaim.findOne({role:ur.role,claim:c._id},(err,rc)=>{
                                    if(err){
                                        reject(err);
                                    }
                                    else if(rc){
                                        resolve(false);
                                    } else{
                                        userClaim.findOne({user:ur.user,claim:c._id},(err,uc)=>{
                                            if(err){
                                                reject(err);
                                            }else if(uc){
                                                resolve(false);
                                            }else{
                                                resolve(true);
                                            }
                                        });
                                    }
                                })
                            })
                        }else{
                            userClaim.findOne({user:ur.user,claim:c._id},(err,uc)=>{
                                if(err){
                                    reject(err);
                                }else if(uc){
                                    resolve(false);
                                }else{
                                    resolve(true);
                                }
                            });
                        }

                    })
                } else{
                    reject("Error, user or claim does not exist");
                }
            })
        })
    }

    /**
     * checks  if a user is a member of a role
     * @param {A string representing the role name} roleName 
     */
    isA(roleName){
        return new Promise ((resolve, reject)=>{
            role.findOne({name: roleName}, (err,r)=>{
                if(r){
                    userRole.findOne({user:this._id,role:r._id},(err,ur)=>{
                        if(ur){
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                } else{
                    reject("Error, user or role does not exist");
                }
            });
        }
        );
    }

    /**
     * checks  if a user is a member of a role
     * @param {A string representing the role name} roleName 
     */
    isAn(roleName){
        return this.isA(roleName);
    }

    /**
     * checks  if a user is not a member of a role
     * @param {A string representing the role name} roleName 
    */
    isNotA(roleName){
        return new Promise ((resolve,reject)=>{
            role.findOne({name: roleName}, (err,r)=>{
                if(r){
                    userRole.findOne({user:this._id,role:r._id},(err,ur)=>{
                        if(ur){
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                    });
                } else{
                    reject("Error, user or role does not exist");
                }
            });
        });
    }

    /**
     * checks  if a user is not a member of a role
     * @param {A string representing the role name} roleName 
    */
    isNotAn(roleName){
       return this.isNotA(roleName);
    }

    /**
     * Returns a collection of Roles assigned to a User
     */
    getRolesForUser(){
        var result = [];
        return new Promise ((resolve, reject)=>{
            userRole.find({user: this._id},(err, roles)=>{
            if (err){
                reject(err);
            } else if (roles.length < 1){
                resolve(result);
            }
            else {
                for (var item of roles){
                    item.populate('role', (err, data)=>{
                        if (err){
                            reject(err);
                        } else {
                            result.push(data.role.name);
                            if (roles[roles.length-1] == item){
                                //return only when you've added every role
                                //Node is non-blocking, so the engine will return an empty array if resolve(code) is place outside the for-loop
                                resolve(result);
                            }
                        }
                    });
                }
            }
        })
    })
}

    /**
     * Returns a collection of Claims a User can perform
     * @param {A callback function to execute after fetching claims} cb 
     */
    getClaimsForUser(cb){
        var result = [];
        return new Promise ((resolve,reject)=>{
            userRole.find({user:this._id},(err,userRoles)=>{
                if(err){
                    reject(err);
                } else if (userRoles.length>=1){
                    for(var userRole of userRoles){
                        roleClaim.find({role:userRole.role},(err,roleClaims)=>{
                            if(err){
                                reject(err);
                            }else if(roleClaims.length >= 1){
                                for(var item of roleClaims){
                                    item.populate('claim',(err,roleClm)=>{
                                        if(err){
                                            reject(err)
                                        } else{
                                            result.push(roleClm.claim.name);
                                            if(roleClaims[roleClaims.length-1] == item){
                                                userClaim.find({user:this._id},(err,userClaims)=>{
                                                    if(err){
                                                        reject(err);
                                                    }else if (userClaims.length >= 1){
                                                        for(var item of userClaims){
                                                            item.populate('claim',(err,data)=>{
                                                                if(err){
                                                                    reject(err);
                                                                } else{
                                                                    result.push(data.claim.name);
                                                                    if(userClaims[userClaims.length-1] == item){
                                                                        resolve(result.filter(this.onlyUnique));
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    } else {
                                                        resolve(result.filter(this.onlyUnique));
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            } else {
                                userClaim.find({user:this._id},(err,userClaims)=>{
                                    if(err){
                                        reject(err);
                                    }else if (userClaims.length >= 1){
                                        for(var item of userClaims){
                                            item.populate('claim',(err,data)=>{
                                                if(err){
                                                    reject(err);
                                                } else{
                                                    result.push(data.claim.name);
                                                    if(userClaims[userClaims.length-1] == item){
                                                        resolve(result.filter(this.onlyUnique));
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                } else {
                    userClaim.find({user:this._id},(err,userClaims)=>{
                        if(err){
                            reject(err);
                        }else if (userClaims.length >= 1){
                            for(var item of userClaims){
                                item.populate('claim',(err,data)=>{
                                    if(err){
                                        reject(err);
                                    } else{
                                        result.push(data.claim.name);
                                        if(userClaims[userClaims.length-1] == item){
                                            resolve(result.filter(this.onlyUnique));
                                        }
                                    }
                                });
                            }
                        } else {
                            resolve(result.filter(this.onlyUnique));
                        }
                    });
                }
            });
        });

    }

    onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
}

module.exports = HasRolesAndClaims;