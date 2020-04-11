var role = require('./Models/Role');
var claim = require('./Models/Claim');
var roleClaim = require('./Models/RoleClaim');
var allowOps = require('./AllowOperations');
var disallowOps = require('./DisallowOperations');
var roleOps = require('./RoleOperations');

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
            if (roleName.trim() === "") throw {message:"role name cannot be empty", type:"gateman"};
            if (typeof(roleName) !== 'string') throw {message:"role name must be a string", type:"gateman"};
            let dbRole = await role.findOne({ name: roleName });
            if (dbRole) return dbRole;
            let newDbRole = await role.create({ name: roleName });
            return newDbRole;
        } catch (error) {
            throw {message:error, type:"mongoose"};
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
            if (typeof(roleName) !== 'string') throw{message:'role name must be a string', type:"gateman"};
            return await role.findOneAndDelete({name: roleName});
        } catch (error) {
            throw {message:error, type:"mongoose"};
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
            if (typeof(roleName) !== 'string') throw {message:'role name must be a string', type:"gateman"};
            let rol = await role.findOne({name:roleName});
            return rol;
        } catch (error) {
            throw {message:error, type:"mongoose"};
        }
    }
    
    /**
     * Allows members of a role to perform a claim
     * @param rolename {String} the rolename
     * #### Usage
     ```
    await gateman.allow("rolename").to("claim");
     ```
     */
    allow(rolename){
        let linker = new allowOps(role, claim, roleClaim);
        if (rolename.trim() === '') throw {message:'role name must be provided', type:"gateman"};
        if (typeof(rolename) !== 'string') throw {message:'role name must be a string', type:"gateman"};
        linker.operation = 'allow';
        linker.roler = rolename;
        return linker;
    }

    /**
     * Dissallows a member of a role from performing a claim
     * @param rolename {String} the rolename
     * #### Usage
     ```
     await gateman.disallow('rolename').from('claim');
    //Gateman does nothing if the role doesn't possess the claim
     ```
     */
    disallow(rolename){
        let linker = new disallowOps(role, claim, roleClaim);
        if (rolename.trim() === '') throw {type:'role name must be provided', type:"gateman"};
        if (typeof(rolename) !== 'string') throw {type:'role name must be a string', type:"gateman"};
        linker.operation = 'dissallow';
        linker.roler = rolename;
        return linker;
    }

    /**
     * Returns existing roles in the system
     * #### Usage
     ```
    let roles = await gateman.getRoles();
    console.log(roles); //prints collection of all existing roles
     ```
     */
    async getRoles(){
        try {
            return role.find({});
        } catch (error) {
            throw {message:error, type:"mongoose"};
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
            if (claimName === "") throw {message:"claim name cannot be empty", type:"gateman"};
            let dbClaim = await claim.findOne({ name: claimName });
            if (dbClaim) {
                return dbClaim;
            } else {
                let newDbClaim = await claim.create({ name: claimName });
                return newDbClaim;
            }
        } catch (error) {
            throw {message:error, type:"mongoose"};
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
    async removeClaim(claimName){
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
    async getClaims(){
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
    async getClaim(claimName){
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
            let result = [];
            let dbRole = await role.findOne({ name: roleName });
            if (dbRole) {
                let roleClaims = await roleClaim.find({ role: dbRole._id }).populate('role claim');
                if (roleClaims.length === 0) return result;
                for (let i=0; i<roleClaims.length; i++){
                    result.push(roleClaims[i].claim && roleClaims[i].claim.name);
                    if (i === roleClaims.length - 1) return result;
                }
            } else {
                throw {message:'role does not exist', type:"gateman"};
            }
        } catch (error) {
            throw {message:error, type:"mongoose"};
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
        let linker = new roleOps(role, claim, roleClaim);
        if (roleName.trim() === '') throw {message:'role name must be provided', type:"gatemen"};
        if (typeof(roleName) !== 'string') throw {messaqge:'role name must be a string', type:"gateman"};
        linker.roleName = roleName;
        return linker;
    }

}

module.exports = GateMan;