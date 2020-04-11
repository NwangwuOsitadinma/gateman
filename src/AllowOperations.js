var role, claim, roleClaim;

class AllowOperations {

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
                            return false;
                        } else {
                            await roleClaim.create({ role: dbRole._id, claim: c[0]._id });
                            return;
                        }
                    } else {
                        claim.create({ name: claimName }, (err, claimE) => {
                            if (err) throw new Error({
                                message:"error creating claim",
                                type:"mongoose"
                            });
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

}
module.exports = AllowOperations;