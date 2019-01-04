module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
    var RoleClaimSchema = mongoose.Schema({
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the role is required'],
            ref: 'Role'
        },
        claim: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry! the claim is required'],
            ref: 'Claim'
        }
    });
    if (mn.includes("RoleClaim")){
        return mongoose.model('RoleClaim');
    } else {
        return mongoose.model('RoleClaim',RoleClaimSchema);
    }
   
}