const role = require('./Models/Role');
const claim = require('./Models/Claim');
const roleClaim = require('./Models/RoleClaim');
const userClaim = require('./Models/UserClaim');
const userRole = require('./Models/UserRole');
const hasRoleAndAbilities = require('./HasRolesAndAbilities');
var mongo = require('mongoose')

class GateMan {
    /**
     * @param {A string that represents the name of the claim you want to create} claimName
     * @param {A callback function that runs after the claim has been created} cb
     */
    createClaim(claimName,cb){
        claim.create({name: claimName},cb);
    }

    /**
     * @param {A string that representst the name of the claim you want to create} roleName
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
        return role;
    }

    /**
     * Retracts a role from a user
     * @param {A mongoose object} role 
     */
    retract(role){
       return role;
    }

    /**
     * Allows members of a role or a user to perform a claim
     * @param {A mongoose object} roleOrUser
     */
    allow(roleOrUser){
        /*
         * Once we return the roleNameorUser object, mongoose automatically selects it's base model and calls it's respective to() function.
         */
        console.log(roleOrUser.modelName())//this should print the Model Name of its caller
        console.log(role.modelName)//this should print Role
        return roleNameorUser;
    }

    /**
     * Dissallows a member of a role or user from performing a claim
     * @param {A mongoose object} roleOrUser 
     */
    dissallow(roleOrUser){
        return roleOrUser
    }

}

module.exports = GateMan;