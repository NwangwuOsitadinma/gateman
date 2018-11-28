const claim = require('./Models/Claim');
const userClaim = require('./Models/UserClaim');
const role = require('./Models/Role');
const userRole =  require('./Models/UserRole');

class HasRolesAndAbilities {
    modelName(){
        return 'User'
    }

   /**
    * accepts a claim name and assigns it to the user
    * @param {A string that represents the claim to be assigned} claimName 
    */ 
   to(claimName){
       console.log("HasRolesAndAbilities")
       claim.where('name', claimName).limit(1).exec((err, c)=>{
        if(c.length>0){
            userClaim.create({user: this._id, claim: c[0]._id},function(err,usrClaim){
                if(err) throw err;
                return usrClaim;
            });
        }else{
            claim.create({name:claimName},(err,clm) =>{
                 if(err) throw err;
                 userClaim.create({user: this._id,claim: clm._id},function(err,usrClaim){
                     if(err) throw err;
                     return usrClaim;
                 })
            })
        }
       });
    }

    /**
     * assigns the given claim to the user on which it is called
     * @param {A mongoose object that represents the claim  you want to assign to a user} claim 
     */
    allow(claim){
        userClaim.findOne({user: this._id,claim:claim._id},(err,uc) => {
            if(uc.length>0){
                return {message: 'this claim has already been assigned to this user'};
            } else{
                userClaim.create({user:this._id,claim:uc._id},(err,usrClaim) => {
                    if(err) throw err;
                    return usrClaim
                })
            }
        })
    }

    /**
     * disallows a user from performing a particular claim
     * @param {A mongoose object that represents the claim  you want to assign to a user} claim 
     */
    disallow(claim){
        userClaim.findOne({user: this._id,claim:claim._id},(err,uc) => {
            if(uc.length>0){
                userClaim.deleteOne({user:this._id,claim:uc._id},(err) =>{
                    if(err) throw err;
                    return {message: 'the claim has been removed from the user'}
                })
            } else{
                return{message: 'invalid action'}
            }
        })
    }

    /**
     * assigns a role to a user directly
     * @param {A mongoose object that represents the role you want to assign to a user} role 
     */
    assign(role){
        userRole.findOne({user: this._id,role:role._id},(err,r)=>{
            if(r.length>0){
                return {message: 'this role has already been assigned to the user'};
            } else{
                userRole.create({user:this._id,role:r._id},function(err,ur){
                    if(err) throw err;
                    return ur;
                })
            }
        })
    }

    /**
     * retracts a role from a user directly
     * @param {A mongoose model that represents the role you want to retract from the user} role 
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

    from(claimname){
        console.log("HasRolesAndAbilities");
        claim.where('name',claimname).limit(1).exec((err,c)=>{
            if(c.length>0){
                userClaim.deleteOne({user: this._id, claim: c._id},function(err){
                    if(err) throw err;
                })
            }else{
                return {message: "the claim does not exist"};
            }
        })
    }
}

module.exports = HasRolesAndAbilities;