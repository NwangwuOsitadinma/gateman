var GateMan = require('./src/GateMan');
var rolesAndAbilities = require('./src/HasRolesAndAbilities');

/**
 * Creates a new Gateman instance
 */
exports.GateMan = (dbConnection)=>{
    return new GateMan(dbConnection);
}

/**
 * Initializes roles and abilities, to be extended by a valid User model
 */
exports.hasRolesAndAbilities = (dbConnection)=>{
    new rolesAndAbilities(dbConnection);
    return rolesAndAbilities;
}