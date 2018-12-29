const role = require('./Models/Role');
const claim = require('./Models/Claim');
const roleClaim = require('./Models/RoleClaim');
const userClaim = require('./Models/UserClaim');
const userRole = require('./Models/UserRole');
const hasRoleAndAbilities = require('./HasRolesAndAbilities');
const mongoose = require('mongoose');
const roleClass = require('./Classes/Roles')

class GateMan {
    //New Design begins here
    //Usage: myGateMan.Roles.allow('role').to('claim');
    //       myGateMan.Roles.assign('claim').to('role');
    //       myGateMan.extend(UserModel);
    //       UserModel.allow('user').to('claim');
    //       myGateMan.Users.allow('role').to('claim');
    //  	 myGateMan.Users.User('ibesoft').can('edit');
    //       myGateMan.Users.User('osita').isAn('admin');
    get Roles(){
        return new roleClass;
    }
    /**
     * Provides a user model with the abilities of myGateMan
     */
    extend(UserModel){
        return UserModel.loadClass(hasRoleAndAbilities); 
    }
}

module.exports = GateMan;