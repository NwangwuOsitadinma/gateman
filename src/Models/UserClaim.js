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
            ref: 'Claim'
        }
    });
    if (mn.includes("UserClaim")){
        return mongoose.model('UserClaim');
    } else {
        return mongoose.model('UserClaim',UserClaimSchema);
    }
   
}