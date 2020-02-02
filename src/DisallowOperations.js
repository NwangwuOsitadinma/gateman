var role, claim, roleClaim;

class DisallowOperations {

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
                    await roleClaim.findOneAndDelete({ role: dbRole, claim: dbClaim });
                    return;
                }
            }
        } catch (error) {
            throw error;
        }
    }

}
module.exports = DisallowOperations;