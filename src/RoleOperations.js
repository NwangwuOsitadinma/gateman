var role, claim, roleClaim;

class RoleOperations {

    /**
     * Contains methods for managing application roles and claims
     * * Provide a valid mongoose connection object that will be used to store application credentials
     * @mongoose a mongoose connection object
     */
    constructor(rol, clm, roleClm){
        role = rol;
        claim = clm;
        roleClaim = roleClm;
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
                    let roleClm = await roleClaim.findOne({ role: dbRole._id, claim: dbClaim._id });
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
    async cannot(claimName){
        //find claim, role, then check if it has the claimName
        try {
            let dbClaim = await claim.findOne({ name: claimName });
            if (dbClaim) {
                let dbRole = await role.findOne({ name: this.roleName });
                if (dbRole) {
                    let roleClm = await roleClaim.findOne({ role: dbRole._id, claim: dbClaim._id });
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
module.exports = RoleOperations;