var GateMan = require('./src/GateMan');
var rolesAndAbilities = require('./src/HasRolesAndAbilities');

exports.GateMan = (dbConnection)=>{
    return new GateMan(dbConnection);
}

exports.hasRolesAndAbilities = (dbConnection)=>{
    new rolesAndAbilities(dbConnection);
    return rolesAndAbilities;
}