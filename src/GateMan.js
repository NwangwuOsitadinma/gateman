const role = require('./Models/Role');
const claim = require('./Models/Claim');
const roleClaim = require('./Models/RoleClaim');
const userClaim = require('./Models/UserClaim');
const userRole = require('./Models/UserRole');
const hasRoleAndAbilities = require('./HasRolesAndAbilities');


class GateMan {

    createClaim(claimName,cb){
        claim.create({name: claimName},cb);
    }

    createRole(roleName,cb){
        role.create({name: roleName},cb);
    }

    assign(roleName){
      var r = role.where('name',roleName);
      if(r !== null){
          return r;
      }
      role.create({name: roleName},function(err,role){
          if(err) throw err;
          return role;
      });
    }

    retract(roleName){
       
    }

    allow(roleNameorUser){
        if(typeof roleNameorUser === String ){
            var r = role.where('name',roleName);
            if(r !== null){
                return r;
            }
            role.create({name: roleName},(err,role)=>{
                if(err) throw err;
                return role;
            });
        } else{
            return roleNameorUser;
        }
       
    }

    dissallow(roleName){
        var r = role.where('name',roleName);
        return r;
    }

    // to(claimName){
    //     const rolesAndAbilities = new hasRoleAndAbilities(this);
    //     return rolesAndAbilities.to(claimName);
    // }

}

module.exports = GateMan;