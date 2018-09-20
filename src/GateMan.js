const role = require('./Models/Role');
const claim = require('./Models/Claim');
const roleClaim = require('./Models/RoleClaim');
const userClaim = require('./Models/UserClaim');
const userRole = require('./Models/UserRole');

class GateMan {
    createClaim(claimName,cb){
        claim.create(claimName,cb);
    }
    createRole(roleName,cb){
        role.create(roleName,cb);
    }

    assignRoleToUser(role,user,cb){
        userRole.create({role:role._id,user:user._id},cb);
    }

    assignClaimToUser(claim,user,cb){
        userClaim.create({claim:claim._id, user:user._id},cb);
    }

    assignClaimToRole(claim,role,cb){
        userClaim.create({claim:claim._id, role: role._id},cb);
    }


}