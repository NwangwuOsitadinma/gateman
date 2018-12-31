module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
    var UserRoleSchema = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the user is required']
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the role is required']
        }
    });
    if (mn.includes("UserRole")){
        return mongoose.model('UserRole');
    } else {
        return mongoose.model('UserRole',UserRoleSchema);
    }  
}