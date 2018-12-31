const claim = require('./Models/Claim');
const userClaim = require('./Models/UserClaim');
const userRole =  require('./Models/UserRole');
const role = require('./Models/Role');

class HasRolesAndAbilities {
    description(){
        return 'User'
    }

    /**
     * allows a user perform a claim, does nothing if user already has the claim
     * @param {A string that represents the claim  you want to assign to a user} claim 
     */
    allow(Claim){
        claim.findOne({name: Claim}, (err, claim)=>{
            if (claim) {
                userClaim.findOne({user: this._id,claim:claim._id},(err,uc) => {
                    if(uc){
                        return {message: 'this claim has already been assigned to this user'};
                    } else{
                        userClaim.create({user:this._id,claim:claim._id},(err,usrClaim) => {
                            if(err) throw err;
                            return usrClaim;
                        });
                    }
                });
            }
        });
    }

    /**
     * disallows a user from performing a particular claim
     * @param {A string that represents the claim you want to retract from a user} claim 
     */
    disallow(Claim){
        claim.findOne({name: Claim}, (err, claim)=>{
            if (claim) {
                userClaim.findOne({user: this._id,claim:claim._id},(err,uc) => {
                    if(uc){
                        userClaim.deleteOne({_id:uc._id}, (err)=>{
                            return {message: 'the claim has been removed from the user'};
                        });
                    } else{
                        return{message: 'invalid action, user claim does not exist'}
                    }
                });
            }
        });
    }

    /**
     * assigns a role to a user directly
     * @param {A string that represents the role you want to assign to a user} Role 
     */
    assign(Role){
        role.findOne({name: Role}, (err, role)=>{
            if (role){
                userRole.findOne({user: this._id,role:role._id},(err,r)=>{
                    if(r){
                        return {message: 'this role has already been assigned to the user'};
                    } else{
                        userRole.create({user:this._id,role:role._id},function(err,ur){
                            if(err) throw err;
                            return ur;
                        });
                    }
                });
            }
        });
    }

    /**
     * retracts a role from a user directly
     * @param {A string that represents the role you want to retract from the user} Role 
     */
    retract(role){
        userRole.findOne({user: this._id,claim:role._id},(err,ur) => {
            if(ur.length>0){
                userRole.deleteOne({user:this._id,claim:ur._id},(err) =>{
                    if(err) throw err;
                    return {message: 'the claim has been removed from the user'}
                })
            } else{
                return{message: 'invalid action'}
            }
        })
    }

    /**
     * checks whether a user has the ability to perform an action
     * @param {a string representing the claim name} claimName 
     */
    can(claimName){
        return new Promise (resolve=>{
            claim.findOne({name: claimName}, (err,c)=>{
                if(c){
                    userClaim.findOne({user:this._id,claim:c._id},(err,uc)=>{
                        if(uc){
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                } else{
                    resolve(false);
                }
            });
        }, reject=>{
            reject("Error, user or claim does not exist");
        });
    }

    /**
     * checks whether a user does not have the ability to perform an action
     * @param {a string representing the claim name} claimName
     */
    cannot(claimName){
        return new Promise (resolve=>{
            claim.findOne({name: claimName}, (err,c)=>{
                if(c){
                    userClaim.findOne({user:this._id,claim:c._id},(err,uc)=>{
                        if(uc){
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                    });
                } else{
                    resolve(true);
                }
            });
        }, reject=>{
            reject("Error, user or claim does not exist");
        });
    }

    /**
     * checks  if a user is a member of a role
     * @param {A string representing the role name} roleName 
     */
    isA(roleName){
        return new Promise (resolve=>{
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
                    resolve(false);
                }
            });
        }, reject=>{
            reject("Error, user or role does not exist");
        });
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
        return new Promise (resolve=>{
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
                    resolve(true);
                }
            });
        }, reject=>{
            reject("Error, user or role does not exist");
        });
    }

    /**
     * checks  if a user is not a member of a role
     * @param {A string representing the role name} roleName 
    */
    isNotAn(roleName){
       return this.isNotA(roleName);
    }

    getRolesForUser(cb){
        userRole.find({},cb)
    }

    getClaimsForUser(cb){
        userClaim.find({},cb)
    }
}

module.exports = HasRolesAndAbilities;