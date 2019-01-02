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
userModel.assign(rolename);
userModel.retract(rolename);
```



## Usage
Adding roles and abilities to users is made extremely easy. You do not have to create a role or an ability in advance. Simply pass the name of the role/ability, and gateman will create it if it doesn't exist.

```
gateman.allow('role').to('ability');
```


## Documentation
* [Usage](http://htmlpreview.github.com/?https://github.com/NwangwuOsitadinma/gateman/blob/chaining/docs/index.html): how Gateman.js works
* [Configuring Gateman.js]()


## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.


## Authors

* **Ositadinma Nwangwu** - [NwangwuOsitadinma](https://github.com/NwangwuOsitadinma)
* **Ibe Ogele** - [Ibesoft11](https://github.com/Ibesoft11)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
