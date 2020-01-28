module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
    var UserClaimSchema = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the user is required']
        },
        claim: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,'Sorry, the claim is required'],
            ref: 'GatemanClaim'
        }
    });
    if (mn.includes("GatemanUserClaim")){
        return mongoose.model('GatemanUserClaim');
    } else {
        return mongoose.model('GatemanUserClaim',UserClaimSchema);
    }
   
}