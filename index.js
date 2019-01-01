var gateman = require('./src/GateMan');
var hasrolesandabilities = require('./src/HasRolesAndAbilities');

gateman.HasRolesAndAbilities = hasrolesandabilities


module.exports = function (mongoose){
    return new gateman(mongoose);
}