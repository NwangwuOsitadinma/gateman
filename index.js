var GateMan = require('./src/GateMan');
var rolesAndClaims = require('./src/HasRolesAndClaims');

/**
 * Creates a new Gateman instance
 */
exports.GateMan = (dbConnection)=>{
    return new GateMan(dbConnection);
}

/**
 * Initializes roles and abilities, to be extended by a valid User model
 */
exports.hasRolesAndClaims = (dbConnection)=>{
    new rolesAndClaims(dbConnection);
    return rolesAndClaims;
}