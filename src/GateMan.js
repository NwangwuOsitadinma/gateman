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
     * creates a new gateman role and returns the role
     * @param roleName {String} A string that represents the name of the role to be created
     * #### Usage
     ```
     let role = await gateman.createRole("rolename");
    ```
     */
    async createRole(roleName) {
        try {
            if (roleName.trim() === "") throw new Error("role name cannot be empty");
            if (typeof(roleName) !== 'string') throw new Error("role name must be a string");
            let dbRole = await role.findOne({ name: roleName });
            if (dbRole) return dbRole;
            let newDbRole = await role.create({ name: roleName });
            return newDbRole;
        } catch (error) {
            throw error;
        }
    }

    /**
     * deletes an existing gateman role, does nothing if role does not exist
     * @param roleName {String} A string that represents the name of the role to be removed
     * #### Usage
     ```
     gateman.removeRole("rolename");
     ``` 
     */
    async removeRole(roleName){
        try {
            if (typeof(roleName) !== 'string') throw new Error('role name must be a string');
            return await role.findOneAndDelete({name: roleName});
        } catch (error) {
            throw error;
        }        
    }

    /**
     * returns a gateman role specified by the name given
     * @param roleName {String} A string that represents the name of the role to be returned
     * #### Usage
     ```
     let role = await gateman.getRole("rolename");
     ```
     */
    async getRole(roleName){
        try {
            if (roleName.trim() === '') return {};
            if (typeof(roleName) !== 'string') throw new Error('role name must be a string');
            let role = await role.findOne({name:roleName});
            return role;
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Allows members of a role to perform a claim
     * @param role {String} the rolename
     * #### Usage
     ```
    await gateman.allow("rolename").to("claim");
     ```
     */
    allow(role){
        if (role.trim() === '') throw new Error('role name must be provided');
        if (typeof(role) !== 'string') throw new Error('role name must be a string');
        this.operation = 'allow';
        this.roler = role;
        return this;
    }

    /**
     * Dissallows a member of a role from performing a claim
     * @param role {String} the rolename
     * #### Usage
     ```
     await gateman.disallow('rolename').from('claim');
    //Gateman does nothing if the role doesn't possess the claim
     ```
     */
    disallow(role){
        if (role.trim() === '') throw new Error('role name must be provided');
        if (typeof(role) !== 'string') throw new Error('role name must be a string');
        this.operation = 'dissallow';
        this.roler = role;
        return this;
    }

    /**
     * pass in the claim to be assigned to a role
     * @param claimName {String} pass a claim as a string if you called allow
     * #### Usage
     ```
     await gateman.allow("rolename").to("claim");
     ```
     */
    async to(claimName) {
        try {
            if (this.operation === 'allow') {
                //find the role, allow was meant to do this
                let dbRole = await role.findOne({ name: this.roler });
                if (dbRole) {
                    //assign role here
                    let c = await claim.where('name', claimName).limit(1).exec();
                    if (c.length > 0) {
                        let rlclm = await roleClaim.findOne({ role: dbRole._id, claim: c[0]._id });
                        if (rlclm) {
                            return "Claim has already been assigned to Role";
                        } else {
                            await roleClaim.create({ role: dbRole._id, claim: c[0]._id });
                            return;
                        }
                    } else {
                        claim.create({ name: claimName }, (err, claimE) => {
                            if (err) throw new Error(err);
                            roleClaim.create({ role: dbRole._id, claim: claimE._id }, function (err, roleClaim) {
                                if (err) throw err;
                                return;
                            });
                        });
                    }
                } else {
                    throw new Error("role not found");
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * pass in the claim to be retracted from a role
     * @param claimName {String} the claim to retract from a role
     * #### Usage
     ```
     await gateman.disallow('rolename').from('claim')
     //Gateman does nothing if the role doesn't possess the claim
     ```
     */
    async from(claimName) {
        try {
            if (this.operation === 'dissallow') {
                let dbRole = await role.findOne({ name: this.roler });
                if (dbRole) {
                    let dbClaim = await claim.findOne({ name: claimName });
                    roleClaim.findOneAndDelete({ role: dbRole, claim: dbClaim });
                    return;
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns existing roles in the system
     * #### Usage
     ```
    let roles = await gateman.getRoles();
    console.log(roles); //prints collection of all existing roles
     ```
     */
    getRoles(){
        try {
            return role.find({});
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates a new claim
     * @param claimName {String} A string that represents the name of the claim
     * #### Usage
     ```
     await gateman.createClaim("delete");
     ```
     * @returns Promise 
     */
    async createClaim(claimName) {
        try {
            if (claimName === "") return "claim name cannot be empty";
            let dbClaim = await claim.findOne({ name: claimName });
            if (dbClaim) {
                return dbClaim;
            } else {
                let newDbClaim = await claim.create({ name: claimName });
                return newDbClaim;
            }
        } catch (error) {
            throw error;
        }
    }


    /**
     * Deletes an existing claim 
     * @param claimName {String} A string that represents the name of the claim to be deleted 
     * #### Usage
     ```
     await gateman.removeClaim("claimname");
     ``` 
     */
    removeClaim(claimName){
        return claim.findOneAndDelete({name: claimName});
    }

    /**
     * Returns all claims existing in the system
     * #### Usage
     ```
     let claims = await gateman.getClaims();
     //claims is a collection of existing claims
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
     let claim = await gateman.getClaim();
     ```
     */
    getClaim(claimName){
        return claim.findOne({name:claimName});
    }

    /**
     * Returns an array of claims a role can perform
     * @param roleName {String} represents the name of the role
     * #### Usage
     ```
     let roleClaims = await gateman.getRoleClaims("rolename");
     ```
     */
    async getRoleClaims(roleName){
        try {
            let dbRole = await role.findOne({ name: roleName });
            if (dbRole) {
                let roleClaims = await roleClaim.find({ role: dbRole._id });
                return roleClaims;
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Checks if a Role can perform a Claim, must be used with `can`
     * @param roleName {String} A string that represents the name of the role 
     * #### Usage
     ```
     let result = await gateman.role('rolename').can('claimname');
     //should be true if role has the claim
     ```
     */
    role(roleName){
        if (roleName.trim() === '') throw new Error('role name must be provided');
        if (typeof(roleName) !== 'string') throw new Error('role name must be a string');
        this.roleName = roleName;
        return this;
    }

    /**
     * Checks if a Role can perform a Claim, must be used after `gateman.role()`
     * @param claimName {String} A string that represents the name of the Claim 
     * #### Usage
      ```
      let result = await gateman.role('rolename').can('claimname');
      //should be true if role has the claim
     ```
     */
    async can(claimName) {
        //find claim, role, then check if it has the claimName
        try {
            let dbClaim = await claim.findOne({ name: claimName });
            if (dbClaim) {
                let dbRole = await role.findOne({ name: this.roleName });
                if (dbRole) {
                    let roleClm = roleClaim.findOne({ role: dbRole._id, claim: dbClaim._id });
                    return roleClm ? true : false;
                } else {
                    return "role does not exist";
                }
            } else {
                throw new Error("claim does not exist");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Checks if a Role cannot perform a Claim, must be used after `gateman.role()`
     * @param claimName {String} A string that represents the name of the Claim 
     * #### Usage
      ```
      let result = await gateman.role('rolename').cannnot('claimname');
      //result is false if the role has the claim
     ```
     */
    cannot(claimName){
        //find claim, role, then check if it has the claimName
        try {
            let dbClaim = await claim.findOne({ name: claimName });
            if (dbClaim) {
                let dbRole = await role.findOne({ name: this.roleName });
                if (dbRole) {
                    let roleClm = roleClaim.findOne({ role: dbRole._id, claim: dbClaim._id });
                    return roleClm ? false : true;
                } else {
                    return "role does not exist";
                }
            } else {
                throw new Error("claim does not exist");
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = GateMan;