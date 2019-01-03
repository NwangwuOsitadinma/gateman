<img src="/docs/assets/gateman.jpeg" width="100%" height="500"/>

# Gateman.js

Gatemanjs is an authorization system designed to manage roles and abilities in a node application that uses mongodb for data storage. It works together with mongoose to provide a fluent approach to managing roles and abilities.

## Installation

You can install gateman using npm package manager. 

```
npm install gateman
```
Before using gateman in your node application, it is important to set up your User model to extend the HasRolesAndAbilities class from the gateman package.

```
const mogoose = require('mongoose');
const hasRolesAndAbilities = require('gateman').hasRolesAndAbilities(mogoose);

var UserSchema =  mongoose.Schema({
    name: String,
    email: String
});

UserSchema.loadClass(rolesAndAbilities);
module.exports = mongoose.model('User',UserSchema)
```

After setting up your user model, you can call gateman methods on your user model.

```
userModel.assign(rolename); //assigns the role to the user
userModel.retract(rolename);//retracts an already assigned role from a user
```
Before assigning a role to a user, make sure it has been created.


## Usage

You'll have to import the Gateman package and setup the Gateman Class by passing in a valid mongoose connection object

```
var mongoose = require('mongoose');
var gateman = require("gateman").GateMan(mongoose);
```

#### Creating Roles & Abilities
You have to create a role before using it in your application, Gateman provides an easy way of doing that.

```
//Syntax
gateman.createRole(roleName, callback);

//Example
gateman.createRole("admin", (err, role)=>{
        console.log(role);
    });
```
Creating abilities is similar to roles

```
//Syntax
gateman.createClaim(claimName, callback);

//Example
gateman.createClaim("delete", (err, claim)=>{
        console.log(claim);
    });
```

##### Note: To get a collection of existing roles, you can use
```
//Syntax
gateman.getRoles(callback);

//Example
gateman.getRoles((err, data)=>{
    console.log(data);
});
```

#### Allowing members of a Role to perform a Claim/Ability
Adding abilities to roles is made extremely easy. You do not have to create an ability in advance. Simply pass the name of the ability, and Gateman will create it if it doesn't exist.

```
gateman.allow('role').to('ability'); //for an existing role
```
You can also assign a claim to a role immediately after creating it

```
gateman.createRole("admin", (err, role)=>{
        gateman.allow("admin").to("delete");
    });

//this provides every member of the admin role the ability to delete
```

#### Disallowing members of a Role from performing a Claim/Ability
Retracting claims from a role is very easy, you just need the rolename and claimname

```
gateman.disallow('role').from('ability');

//Gateman does nothing if the role doesn't possess the ability
```

### Using Gateman with User Models

It is important to set up your User model to extend the HasRolesAndAbilities class from the gateman package.

```
const mogoose = require('mongoose');
const hasRolesAndAbilities = require('gateman').hasRolesAndAbilities(mogoose);

var UserSchema =  mongoose.Schema({
    name: String,
    email: String
});

UserSchema.loadClass(rolesAndAbilities);
module.exports = mongoose.model('User',UserSchema)
```

After setting up your user model, you can call gateman methods on your mongoose user model.

#### Allowing Users to perform a claim
```
//Example

 UserModel.findOne({name: "chioma"}, (err, user)=>{
    user.allow("claim")
        .then((userClaim)=>{
            console.log(userClaim);
        }).catch((err)=>{
            console.log(err);
        });
    });

/*
The Gateman hasRolesAndAbilities class is loaded into a valid mongoose model which means that the methods are only accessible to valid User objects.
*/

//Disallowing a User from performing a Claim

UserModel.findOne({name: "chioma"}, (err, user)=>{
    user.disallow("claim")
        .then((message)=>{
            console.log(message);
        }).catch((err)=>{
            console.log(err);
        });
    });
```

#### Assigning a Role to a User
Before assigning a role to a user, make sure it has been created.
```
//Example

 UserModel.findOne({name: "chioma"}, (err, user)=>{
    user.assign("role")
        .then((userRole)=>{
            console.log(userRole);
        }).catch((err)=>{
            console.log(err);
        });
    });

/*
The Gateman hasRolesAndAbilities class is loaded into a valid mongoose model which means that the methods are only accessible to valid User objects.
*/

//Retracting a Role from a User

 UserModel.findOne({name: "chioma"}, (err, user)=>{
    user.retract("role")
        .then((message)=>{
            console.log(message);
        }).catch((err)=>{
            console.log(err);
        });
    });
```

#### Checking for User Abilities and Roles
Gateman provides an easy way of verifying if a User belongs to a Role or can perform a Claim

```
//To verify if a User belongs to a Role

User.findOne({name: "chioma"}, (err, user)=>{
        user.isA("role").then((isRole)=>{
            if (isRole==true){
                //user belongs to role
            }
        });
    });

//To verify if a User can perform an Ability

User.findOne({name: "chioma"}, (err, user)=>{
        user.can("claim").then((result)=>{
            if (result==true){
                //user can perform claim
            }
        });
    });
```

## Documentation
* [Usage](http://htmlpreview.github.com/?https://github.com/NwangwuOsitadinma/gateman/blob/chaining/docs/index.html): Gateman methods
* [Configuring Gateman.js]()


## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.


## Authors

* **Ositadinma Nwangwu** - [NwangwuOsitadinma](https://github.com/NwangwuOsitadinma)
* **Ibe Ogele** - [Ibesoft11](https://github.com/Ibesoft11)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* GenesysTechHub, Enugu