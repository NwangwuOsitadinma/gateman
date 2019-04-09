var GateMan = require('./src/GateMan');
var rolesAndClaims = require('./src/HasRolesAndClaims');

/**
 * Creates a new Gateman instance for managing application roles and claims
 * * Provide a valid mongoose connection object that will be used to store application credentials
 * * `dbConnection` a mongoose object
 * #### Usage
   ```
    var mongoose = require('mongoose');
    var gateman = require("gatemanjs").GateMan(mongoose);
   ```
 */
exports.GateMan = (dbConnection)=>{
    return new GateMan(dbConnection);
}

/**
 * Initializes roles and abilities, to be extended by a valid *User* model
 * * Once extended by a *User* model, each User object has access to the methods
 * * `dbConnection` a mongoose object
 * 
 * #### Usage
 ```
const mogoose = require('mongoose');
const RolesClaims = require('gatemanjs').hasRolesAndClaims(mogoose);

var UserSchema =  mongoose.Schema({
    name: String,
    email: String
});

UserSchema.loadClass(RolesClaims);
module.exports = mongoose.model('User',UserSchema)
```
 */
exports.hasRolesAndClaims = (dbConnection)=>{
    new rolesAndClaims(dbConnection);
    return rolesAndClaims;
}