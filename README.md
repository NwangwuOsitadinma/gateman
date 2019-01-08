<img src="https://raw.githubusercontent.com/NwangwuOsitadinma/gateman/master/docs/assets/gateman.jpeg" width="100%"/>

# Gateman.js

Gatemanjs is an authorization system designed to manage roles and claims in node applications that use mongodb for data storage. It works together with mongoose to provide a fluent approach to managing roles and claims.

## Installation

You can install gateman using npm package manager. 

```
npm install gateman
```

## Usage

Before using gateman in your node application, you'll have to import the gateman package and setup the gateman class by passing in a valid mongoose connection object

```
var mongoose = require('mongoose');
var gateman = require("gateman").GateMan(mongoose);
```

### Creating roles & claims
You have to create a role before using it in your application, Gateman provides an easy way of doing that.

```
//Syntax
gateman.createRole(roleName);

//Example
gateman.createRole("admin").then((role)=>{
        console.log(role);
    }).catch((err)=>{
        console.log(err);
    });
```
Creating claims is similar to creating roles

```
//Syntax
gateman.createClaim(claimName);

//Example
gateman.createClaim("delete").then((claim)=>{
        console.log(claim);
    }).catch((err)=>{
        console.log(err);
    });
```

##### Note: To get a collection of existing roles, you can use
```
//Syntax
gateman.getRoles(callback);

//Example
gateman.getRoles().then(roles=>{
    //roles is a collection of existing roles
}).catch(err=>{
    //err contains the error message, if any
});
```

### Allowing members of a role to perform a claim
Adding claims to roles is made extremely easy. You do not have to create a claim in advance. Simply pass the name of the claim, and Gateman will create it if it doesn't exist.

```
gateman.allow('role').to('claim'); //for an existing role
```
You can also assign a claim to a role immediately after creating it

```
gateman.createRole("admin").then(role=>{
    gateman.allow("admin").to("delete").then(result=>{
        //result is true if claim was assigned successfully
    }).catch(err=>{
        //err contains the error message, if any
    });
})

//this provides every member of the admin role the claim to delete
```

### Disallowing members of a role from performing a claim
Retracting claims from a role is very easy, you just need the rolename and claimname

```
gateman.disallow('role').from('claim').then(result=>{
    //result is true if claim was retracted
}).catch(err=>{
    //err contains any error message, if any
});

//Gateman does nothing if the role doesn't possess the claim
```

### Checking for Role claims
Checking if a Claim has been assigned to a Role can be done this way

```
gateman.role('rolename').can('claimname').then(result=>{
    //result is true if the claim has been assigned, else it will be false
});

//Checking for errors

gateman.role('rolename').can('claimname').then(result=>{
    //you can user result here
}).catch(err=>{
    //err contains error message if any
});
```

### Using gateman with user models

It is important to set up your User model to extend the HasRolesAndClaims class from the gateman package.

```
const mogoose = require('mongoose');
const hasRolesAndClaims = require('gateman').hasRolesAndClaims(mogoose);

var UserSchema =  mongoose.Schema({
    name: String,
    email: String
});

UserSchema.loadClass(hasRolesAndClaims);
module.exports = mongoose.model('User',UserSchema)
```

After setting up your user model, you can call gateman methods on your mongoose user model.

### Allowing users to perform a claim
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
The Gateman hasRolesAndClaims class is loaded into a valid mongoose model which means that the methods are only accessible to valid user objects.
*/

//Disallowing a user from performing a claim

UserModel.findOne({name: "chioma"}, (err, user)=>{
    user.disallow("claim")
        .then((message)=>{
            console.log(message);
        }).catch((err)=>{
            console.log(err);
        });
    });
```

### Assigning a role to a user
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
The Gateman hasRolesAndClaims class is loaded into a valid mongoose model which means that the methods are only accessible to valid user objects.
*/

//Retracting a role from a user

 UserModel.findOne({name: "chioma"}, (err, user)=>{
    user.retract("role")
        .then((message)=>{
            console.log(message);
        }).catch((err)=>{
            console.log(err);
        });
    });
```

### Checking for User claims and Roles
Gateman provides an easy way of verifying if a user belongs to a role or can perform a claim

```
//To verify if a User belongs to a Role

User.findOne({name: "chioma"}, (err, user)=>{
        user.isA("role").then((userHasRole)=>{
            if (userHasRole){
                //user belongs to role
            }
        });
    });

//To verify if a User can perform an claim

User.findOne({name: "chioma"}, (err, user)=>{
        user.can("claim").then((hasClaim)=>{
            if (userHasClaim){
                //user can perform claim
            }
        });
    });
```

## Documentation
* [Usage](http://htmlpreview.github.com/?https://github.com/NwangwuOsitadinma/gateman/blob/chaining/docs/index.html):   Gateman methods


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