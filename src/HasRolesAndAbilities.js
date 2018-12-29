const claim = require('./Models/Claim');
const userClaim = require('./Models/UserClaim');
const role = require('./Models/Role');
const userRole =  require('./Models/UserRole');

class HasRolesAndAbilities {
    description(){
        return 'User'
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

    /**
     * checks whether a user has the ability to perform an action
     * @param {a string representing the claim name} claimName 
     */
    can(claimName){
        claim.findOne({name: claimName},(err,c)=>{
            if(c.length>0){
                userClaim.findOne({user:this._id,claim:c._id},(err,uc)=>{
                    if(uc.length>0){
                        return true;
                    }else{
                        return false;
                    }
                })
            } else{
                return false;
            }
        })
    }
    /**
     * checks whether a user does not have the ability to perform an action
     * @param {a string representing the claim name} claimName 
     */
    cannot(claimName){
        claim.findOne({name: claimName},(err,c)=>{
            if(c.length>0){
                userClaim.findOne({user:this._id,claim:c._id},(err,uc)=>{
                    if(uc.length>0){
                        return false;
                    }else{
                        return true;
                    }
                })
            } else{
                return true;
            }
        })
    }

    /**
     * checks  if a user is a member of a role
     * @param {A string representing the role name} roleName 
     */
    isA(roleName){
        role.findOne({name:roleName},(err,r) =>{
            if(r.length>0){
                userRole.findOne({user:this._id,role:r._id},(err,ur)=>{
                    if(ur.length>0){
                        return true;
                    }else{
                        return false;
                    }
                })
            }else{
                return false;
            }
        })
    }

    /**
     * checks  if a user is a member of a role
     * @param {A string representing the role name} roleName 
     */
    isAn(roleName){
        role.findOne({name:roleName},(err,r) =>{
            if(r.length>0){
                userRole.findOne({user:this._id,role:r._id},(err,ur)=>{
                    if(ur.length>0){
                        return true;
                    }else{
                        return false;
                    }
                })
            }else{
                return false;
            }
        })
    }

    /**
     * checks  if a user is not a member of a role
     * @param {A string representing the role name} roleName 
    */
    isNotA(roleName){
        role.findOne({name:roleName},(err,r) =>{
            if(r.length>0){
                userRole.findOne({user:this._id,role:r._id},(err,ur)=>{
                    if(ur.length>0){
                        return false;
                    }else{
                        return true;
                    }
                })
            }else{
                return true;
            }
        })
    }

    /**
     * checks  if a user is not a member of a role
     * @param {A string representing the role name} roleName 
    */
    isNotAn(roleName){
        role.findOne({name:roleName},(err,r) =>{
            if(r.length>0){
                userRole.findOne({user:this._id,role:r._id},(err,ur)=>{
                    if(ur.length>0){
                        return false;
                    }else{
                        return true;
                    }
                })
            }else{
                return true;
            }
        })
    }
}

module.exports = HasRolesAndAbilities;