<img src="https://raw.githubusercontent.com/NwangwuOsitadinma/gateman/master/docs/assets/gatema.jpeg" width="100%"/>

# Gateman.js

Gatemanjs is an authorization system designed to manage roles and claims in node applications that use mongodb for data storage. It works together with mongoose to provide a fluent approach to managing roles and claims.

## Installation

You can install gateman using npm package manager. 

```
npm install gatemanjs
```

## Usage

Before using gateman in your node application, you'll have to import the gateman package and setup the gateman class by passing in a valid mongoose connection object

```
var mongoose = require('mongoose');
var gateman = require("gatemanjs").GateMan(mongoose);
```

### Creating roles & claims
You have to create a role before using it in your application, Gateman provides an easy way of doing that.

```
//Syntax
gateman.createRole(roleName);

//Example
let role = await gateman.createRole("rolename");
```
Creating claims is similar to creating roles

```
//Syntax
gateman.createClaim(claimName);

//Example
let role = await gateman.createRole("claimname");
```

##### Note: To get a collection of existing roles, you can use
```
//Syntax
gateman.getRoles(callback);

//Example
let roles = await gateman.getRoles();
```

### Allowing members of a role to perform a claim
Adding claims to roles is made extremely easy. You do not have to create a claim in advance. Simply pass the name of the claim, and Gateman will create it if it doesn't exist.

```
gateman.allow('role').to('claim'); //for an existing role
```
You can also assign a claim to a role immediately after creating it

```
let role = await gateman.createRole("admin");
await gateman.allow("admin").to("delete");

//this provides every member of the admin role the claim to delete
```

### Disallowing members of a role from performing a claim
Retracting claims from a role is very easy, you just need the rolename and claimname

```
await gateman.disallow('role').from('claim');

//Gateman does nothing if the role doesn't possess the claim
```

### Checking for Role claims
Checking if a Claim has been assigned to a Role can be done this way

```
let result = await gateman.role('rolename').can('claimname');
//result is true if the claim has been assigned, else it will be false

```

### Using gateman with user models

It is important to set up your User model to extend the HasRolesAndClaims class from the gateman package.

```
const mongoose = require('mongoose');
const hasRolesAndClaims = require('gatemanjs').hasRolesAndClaims(mongoose);

var UserSchema =  mongoose.Schema({
    name: String,
    email: String
});

UserSchema.loadClass(hasRolesAndClaims);
module.exports = mongoose.model('User', UserSchema)
```

After setting up your user model, you can call gateman methods on your mongoose user model.

### Allowing users to perform a claim
```
//Example

 let user = await UserModel.findOne({name: "chioma"});
 await user.allow("claim");

/*
The Gateman hasRolesAndClaims class is loaded into a valid mongoose model which means that the methods are only accessible to valid user objects.
*/

//Disallowing a user from performing a claim

let user = await UserModel.findOne({name: "chioma"});
await user.disallow("claim");

```

### Assigning a role to a user
Before assigning a role to a user, make sure it has been created.
```
//Example

 let user = await UserModel.findOne({name: "chioma"});
 await user.assign("role");

/*
The Gateman hasRolesAndClaims class is loaded into a valid mongoose model which means that the methods are only accessible to valid user objects.
*/

//Retracting a role from a user

let user = await UserModel.findOne({name: "chioma"});
await user.retract("role");

```

### Checking for User claims and Roles
Gateman provides an easy way of verifying if a user belongs to a role or can perform a claim

```
//To verify if a User belongs to a Role

let user = await User.findOne({name: "chioma"});
let userHasRole = await user.isA("role");
if (userHasRole){
    //user belongs to role
}

//To verify if a User can perform a claim

let user = await User.findOne({name: "chioma"});
let userHasClaim = await user.can("claim");
if (userHasClaim){
    //user can perform claim
}
```

### Retrieving User Roles and Claims
Gateman provides an easy way of retrieving a User's roles and/or claims

```
//Returns a collection of Roles assigned to a User

let user = await User.findOne({name: "chioma"});
let roles = await user.getRolesForUser();
console.log(roles);

//Returns a collection of Claims a User can perform

let user = await User.findOne({name: "chioma"}, (err, user)=>{
let claims = await user.getClaimsForUser();
console.log(claims);
```

### Error handling
Gateman provides an efficient way to handle errors whether from the mongoose library or from the gateman library

```
try{
    let user = await User.findOne({name: "chioma"}, (err, user)=>{
    let claims = await user.getClaimsForUser();
}catch(error){
    //returns an error object specifying the error message and the error type
    console.error(error.type); //this prints the error type either gateman or mongoose
    console.error(error.message); //this prints the error message
}

```

## Documentation
* [Usage](http://htmlpreview.github.com/?https://github.com/NwangwuOsitadinma/gateman/master/docs/out/index.html):   Gateman methods


## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.


## Authors

* **Ositadinma Nwangwu** - [NwangwuOsitadinma](https://github.com/NwangwuOsitadinma)
* **Ibe Ogele** - [Ibesoft11](https://github.com/Ibesoft11)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
* This project was inspired by Joseph Silber's [Bouncer](https://github.com/JosephSilber/bouncer)
* Mongoose was used to build this
