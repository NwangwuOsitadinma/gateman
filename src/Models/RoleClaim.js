module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
    var RoleClaimSchema = mongoose.Schema({
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the role is required']
        },
        claim: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry! the claim is required']
        }
    });
    if (mn.includes("RoleClaim")){
        return mongoose.model('RoleClaim');
    } else {
        return mongoose.model('RoleClaim',RoleClaimSchema);
    }
   
}