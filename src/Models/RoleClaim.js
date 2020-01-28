module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
    var RoleClaimSchema = mongoose.Schema({
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the role is required'],
            ref: 'GatemanRole'
        },
        claim: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry! the claim is required'],
            ref: 'GatemanClaim'
        }
    });
    if (mn.includes("GatemanRoleClaim")){
        return mongoose.model('GatemanRoleClaim');
    } else {
        return mongoose.model('GatemanRoleClaim',RoleClaimSchema);
    }
   
}