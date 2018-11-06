const role = require('./Models/Role');
const claim = require('./Models/Claim');
const roleClaim = require('./Models/RoleClaim');
const userClaim = require('./Models/UserClaim');
const userRole = require('./Models/UserRole');
const hasRoleAndAbilities = require('./HasRolesAndAbilities');
var deasync = require('deasync');
var mongo = require('mongoose')

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

    /**
     * Allows members of a role or a user to perform a claim
     * @param {A mongoose object} roleNameorUser 
     */
    allow(roleNameorUser){
        /*
         * Once we return the roleNameorUser object, mongoose automatically selects it's base model and calls it's respective to() function.
         */
        console.log(roleNameorUser.modelName())//this should print the Model Name of its caller
        console.log(role.modelName)//this should print Role
        return roleNameorUser;
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