module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
    var UserRoleSchema = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the user is required']
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the role is required'],
            ref: 'GatemanRole'
        }
    });
    if (mn.includes("GatemanUserRole")){
        return mongoose.model('GatemanUserRole');
    } else {
        return mongoose.model('GatemanUserRole',UserRoleSchema);
    }  
}