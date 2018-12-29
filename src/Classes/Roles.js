const role = require('../Models/Role');
const claim = require('../Models/Claim');
const roleClaim = require('../Models/RoleClaim');
const userRole = require('../Models/UserRole');

class Roles{
    /**
     * @param {A string that represents the name of the claim you want to create} roleName
     * @param {A callback function that runs after the claim has been created} cb
     */
    createRole(roleName,cb){
        role.create({name: roleName},cb);
    }

    /**
     * Assigns a role to a user
     * @param {A mongoose object} role
     */
    assign(role){
        this.operation = 'assign';
        this.role = role;
        return this;
    }

    /**
     * Retracts a role from a user
     * @param {A mongoose object} role
     */
    retract(role){
        this.operation = 'retract';
        return role;
    }

    /**
     * Allows members of a role to perform a claim
     * @param {A mongoose object} role
     */
    allow(role){
        this.operation = 'allow';
        this.role = role;
        return this;
    }

    /**
     * Dissallows a member of a role from performing a claim
     */
    dissallow(role){
        this.operation = 'dissallow';
        this.role = role;
        return this;
    }

    /**
     * pass in the claim
     * @param {pass a claim as a string if you called allow/assign} claimOrUser 
     */
    to (claimOrUser){
        if (this.operation == 'allow'){
            //find the role, allow was meant to do this
            role.findOne({name: this.role}, (err, dbRole)=>{
                if (dbRole){
                    //assign role here
                    claim.where('name',claimOrUser).limit(1).exec((err, c)=>{
                        if(c.length > 0){
                            roleClaim.create({role:dbRole._id,claim:c[0]._id},function(err,roleClaim){
                                if(err) throw err;
                                return roleClaim;
                            });
                        }else{
                            claim.create({name:claimOrUser},(err,claimE) => { 
                                if(err) throw err;
                                roleClaim.create({role:dbRole._id,claim:claimE._id},function(err,roleClaim){
                                    if(err) throw err;
                                    return roleClaim;
                                });
                            });
                        }
                    }); 
                }else{
                    return "role not found";
                }
            });
        } else if (this.operation = 'assign'){
            //UserRole
            //No user model exists
            //find the role, allow was meant to do this
            role.findOne({name: this.role}, (err, dbRole)=>{
                if (dbRole){
                    //assign role here
                    user.where('name',claimOrUser).limit(1).exec((err, c)=>{
                        if(c.length > 0){
                            roleClaim.create({role:dbRole._id,claim:c[0]._id},function(err, ){
                                if(err) throw err;
                                return roleClaim;
                            });
                        }else{
                            claim.create({name:claimOrUser},(err,claimE) => {
                                if(err) throw err;
                                roleClaim.create({role:dbRole._id,claim:claimE._id},function(err,roleClaim){
                                    if(err) throw err;
                                    return roleClaim;
                                });
                            });
                        }
                    }); 
                }else{
                    return "role not found";
                }
            });
        }
    }

    /**
     * pass in the user
     * @param {the user to retract the role from} userOrClaim
     */
    from(userOrClaim){
        if (this.operation == 'dissallow'){
            role.findOne({name: this.role}, (err, role)=>{
                if (role){
                    claim.findOne({name: userOrClaim}, (err, claim)=>{
                        roleClaim.findOneAndDelete({role: role, claim: claim}, (err)=>{
                            console.log("see");
                            return;
                        });
                    });
                }
            });
        } else if (this.operation == 'retract'){
            userRole.findOneAndDelete({user: userOrClaim});
        }
    }
}

module.exports = Roles;