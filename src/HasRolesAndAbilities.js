const claim = require('./Models/Claim');
const userClaim = require('./Models/UserClaim');

class HasRolesAndAbilities {
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
    modelName(){
        return 'User'
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