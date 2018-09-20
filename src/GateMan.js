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

    allow(roleName){
        $r = role.where('name',roleName);
        if($r !== null){
            return $r;
        }
        role.create(roleName,function(err,role){
            if(err) throw err;
            return role;
        });
    }
    dissallow(roleName){
        $r = role.where('name',roleName);
        return $r;
    }




}