const claim = require('./Models/Claim');
const userClaim = require('./Models/UserClaim');

class HasRolesAndAbilities{

   to(claimName){
       var c = claim.where('name',claimName);
       if(c !== null){
           userClaim.create({user: this._id,claim: c._id},function(err,usrClaim){
               if(err) throw err;
           })
       }else{
           claim.create({name:claimName},(err,clm) =>{
                if(err) throw err;
                userClaim.create({user: this._id,claim: clm._id},function(err,usrClaim){
                    if(err) throw err;
                })
           })
       }
    }
    from(){
        
    }
}