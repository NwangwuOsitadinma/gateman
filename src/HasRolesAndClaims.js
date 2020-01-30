var userClaim = require('./Models/UserClaim');
var userRole = require('./Models/UserRole');
var role = require('./Models/Role');
var roleClaim = require('./Models/RoleClaim');
var claim = require('./Models/Claim');

class HasRolesAndClaims {
    /**
     * Provide a valid mongoose connection object that will be used to store application credentials
     * @param {A mongoose connection object} mongoose 
     */
    constructor(mongoose) {
        userClaim = userClaim(mongoose);
        userRole = userRole(mongoose);
        role = role(mongoose);
        claim = claim(mongoose);
        roleClaim = roleClaim(mongoose);
    }

    /**
     * allows a user perform a claim, does nothing if user already has the claim
     * @param claimName {String} represents the claim  you want to assign to a user
     * #### Usage
     ```
     UserModel.findOne({name: "chioma"}, (err, user)=>{
        user.allow("claim")
            .then((userClaim)=>{
                console.log(userClaim);
        }).catch((err)=>{
            console.log(err);
        });
     });
     ```
     */

    async allow(claimName) {
        try {
            let dbClaim = await claim.findOne({ name: claimName });
            if (dbClaim) {
                let uc = await userClaim.findOne({ user: this._id, claim: dbClaim._id });
                if (uc) {
                    return "this claim was already assigned to the user";
                } else {
                    let usrClaim = await userClaim.create({ user: this._id, claim: dbClaim._id });
                    return usrClaim;
                }
            } else {
                throw new Error({
                    message: "The claim does not exist. Consider creating it first"
                });
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * disallows a user from performing a particular claim
     * @param claimName {string} represents the claim you want to retract from a user
     * #### Usage
     ```
     UserModel.findOne({name: "chioma"}, (err, user)=>{
        user.disallow("claim")
            .then((message)=>{
                console.log(message);
            }).catch((err)=>{
                console.log(err);
            });
        });
     ```
     */
    async disallow(claimName) {
        try {
            let dbClaim = await claim.findOne({ name: claimName });
            if (dbClaim) {
                let uc = await userClaim.findOne({ user: this._id, claim: dbClaim._id });
                if (uc) {
                    await userClaim.delete({ user: this._id, claim: uc._id });
                    return;
                } else {
                    return "this claim was not assigned to the user";
                }
            } else {
                throw new Error({
                    message: "The claim does not exist. Consider creating it first"
                });
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * assigns a role to a user directly
     * @param roleName {string} represents the role you want to assign to a user
     * #### Usage
     ```
     UserModel.findOne({name: "chioma"}, (err, user)=>{
        user.assign("role")
            .then((userRole)=>{
                console.log(userRole);
            }).catch((err)=>{
                console.log(err);
            });
        });
     ```
     */

    async assign(roleName) {
        try {
            let dbRole = await role.findOne({ name: roleName });
            if (dbRole) {
                let rc = await userRole.findOne({ user: this._id, role: dbRole._id });
                if (rc) {
                    return "this role was already assigned to the user";
                } else {
                    let usrRole = await userRole.create({ user: this._id, role: role._id });
                    return usrRole;
                }
            } else {
                throw new Error({
                    message: "The role does not exist. Consider creating it first"
                });
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * retracts a role from a user directly
     * @param roleName {string} represents the role you want to retract from the user 
     * #### Usage
     ```
     UserModel.findOne({name: "chioma"}, (err, user)=>{
        user.retract("role")
            .then((message)=>{
                console.log(message);
            }).catch((err)=>{
                console.log(err);
            });
        });
     ```
     */
    async retract(roleName) {
        try {
            let dbRole = await role.findOne({ name: roleName });
            if (dbRole) {
                let rc = await userRole.findOne({ user: this._id, role: dbRole._id });
                if (rc) {
                    await userRole.delete({ user: this._id, role: dbRole._id });
                    return;
                } else {
                    return "this role was not assigned to the user";
                }
            } else {
                throw new Error({
                    message: "The role does not exist. Consider creating it first"
                });
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * checks whether a user has the ability to perform a claim
     * @param claimName {string} represents the claim name 
     * #### Usage
     ```
     User.findOne({name: "chioma"}, (err, user)=>{
        user.can("claim").then((userHasClaim)=>{
            if (userHasClaim){
                //user can perform claim
            }
        });
    });
     ```
     */
    async can(claimName) {
        try {
            let c = await claim.findOne({ name: claimName });
            if (c) {
                let ur = await userRole.find({ user: this._id });
                if (ur) {
                    ur.forEach((u) => {
                        let rc = await roleClaim.findOne({ role: u.role, claim: c._id });
                        if (rc) {
                            return true;
                        } else {
                            let uc = await userClaim.findOne({ user: u.user, claim: c._id });
                            return uc ? true : false;
                        }
                    });
                } else {
                    let uc = await userClaim.findOne({ user: u.user, claim: claimName });
                    return uc ? true : false;
                }
            } else {
                throw new Error("Error, user or claim does not exist");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * checks whether a user does not have the ability to perform a claim
     * @param claimName {string} represents the claim name
     * #### Usage
     ```
      User.findOne({name: "chioma"}, (err, user)=>{
        user.cannot("claim").then((noClaim)=>{
            if (noClaim){
                //user cannot perform claim
            }
        });
    });
     ```
     */
    async cannot(claimName) {
        try {
            let c = await claim.findOne({ name: claimName });
            if (c) {
                let urs = await userRole.find({ user: this._id });
                if (urs) {
                    urs.forEach(async (ur) => {
                        let rc = await roleClaim.findOne({ role: ur.role, claim: c._id });
                        if (rc) {
                            return false;
                        } else {
                            let uc = await userClaim.findOne({ user: ur.user, claim: c._id });
                            return uc ? false : true;
                        }
                    });
                } else {
                    let uc = await userClaim.findOne({ user: ur.user, claim: c._id });
                    return uc ? false : true;
                }
            } else {
                throw new Error("Error, user or claim does not exist");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * checks if a user is a member of a role
     * @param roleName {string} represents the role name
     * #### Usage
     ```
     User.findOne({name: "chioma"}, (err, user)=>{
        user.isA("role").then((userHasRole)=>{
            if (userHasRole){
                //user belongs to role
            }
        });
    });
     ```
     */
    async isA(roleName) {
        try {
            let r = await role.findOne({ name: roleName });
            if (r) {
                let ur = await userRole.findOne({ user: this._id, role: r._id });
                return ur ? true : false;
            } else {
                throw new Error("Error, user or role does not exist");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * checks if a user is a member of a role
     * @param roleName {string} representing the role name
     * #### Usage
     ```
     User.findOne({name: "chioma"}, (err, user)=>{
        user.isAn("role").then((userHasRole)=>{
            if (userHasRole){
                //user belongs to role
            }
        });
    });
     ```
     */
    async isAn(roleName) {
        return await this.isA(roleName);
    }

    /**
     * checks if a user is not a member of a role
     * @param roleName {string} represents the role name 
     * #### Usage
     ```
     User.findOne({name: "chioma"}, (err, user)=>{
        user.isNotA("role").then((result)=>{
            if (result){
                //user does not belongs to role
            }
        });
    });
     ```
    */
    async isNotA(roleName) {
        try {
            let r = await role.findOne({ name: roleName });
            if (r) {
                let ur = await userRole.findOne({ user: this._id, role: r._id });
                return ur ? false : true;
            } else {
                throw new Error("Error, user or role does not exist");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * checks if a user is not a member of a role
     * @param roleName {string} represents the role name
     * #### Usage
     ```
     User.findOne({name: "chioma"}, (err, user)=>{
        user.isNotAn("role").then((result)=>{
            if (result){
                //user does not belongs to role
            }
        });
    });
     ``` 
    */
    async isNotAn(roleName) {
        return await this.isNotA(roleName);
    }

    /**
     * Returns a collection of Roles assigned to a User
     * #### Usage
     ```
     User.findOne({name: "chioma"}, (err, user)=>{
        user.getRolesForUser().then((roles)=>{
            console.log(roles);
        });
    });
     ```
     */
    async getRolesForUser() {
        try {
            var result = [];
            let roles = await userRole.find({ user: this._id });
            if (roles.length < 1) {
                return result;
            } else {
                for (var item of roles) {
                    let data = await item.populate('role');
                    result.push(data.role.name);
                    if (roles[roles.length - 1] == item) {
                        //return only when you've added every role
                        //Node is non-blocking, so the engine will return an empty array if resolve(code) is place outside the for-loop
                        return result;
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns a collection of Claims a User can perform
     * #### Usage
     ```
     User.findOne({name: "chioma"}, (err, user)=>{
        user.getClaimsForUser().then((claims)=>{
            console.log(claims);
        });
    });
     ```
     */
    async getClaimsForUser() {
        try {
            var result = [];
            let userRoles = await userRole.find({ user: this._id });
            if (userRoles.length >= 1) {
                for (var userRole of userRoles) {
                    let roleClaims = await roleClaim.find({ role: userRole.role });
                    if (roleClaims.length >= 1) {
                        for (var item of roleClaims) {
                            let roleClm = await item.populate('claim');
                            result.push(roleClm.claim.name);
                            if (roleClaims[roleClaims.length - 1] == item) {
                                let userClaims = await userClaim.find({ user: this._id });
                                if (userClaims.length >= 1) {
                                    for (var item of userClaims) {
                                        let data = await item.populate('claim');
                                        result.push(data.claim.name);
                                        if (userClaims[userClaims.length - 1] == item) {
                                            return result.filter(this.onlyUnique);
                                        }
                                    }
                                } else {
                                    return result.filter(this.onlyUnique);
                                }
                            }
                        }
                    } else {
                        let userClaims = await userClaim.find({ user: this._id });
                        if (userClaims.length >= 1) {
                            for (var item of userClaims) {
                                let data = await item.populate('claim');
                                result.push(data.claim.name);
                                if (userClaims[userClaims.length - 1] == item) {
                                    return result.filter(this.onlyUnique);
                                }
                            }
                        }
                    }
                }
            } else {
                let userClaims = await userClaim.find({ user: this._id });
                if (userClaims.length >= 1) {
                    for (var item of userClaims) {
                        let data = await item.populate('claim');
                        result.push(data.claim.name);
                        if (userClaims[userClaims.length - 1] == item) {
                            return result.filter(this.onlyUnique);
                        }
                    }
                } else {
                    return result.filter(this.onlyUnique);
                }
            }
        } catch (error) {
            throw error;
        }

    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
}

module.exports = HasRolesAndClaims;