module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
        var ClaimSchema = mongoose.Schema({
            name: {
                type: String,
                required: [true,'Sorry, the claim is required'],
                unique: true
            }
        });
        if (mn.includes("GatemanClaim")){
            return mongoose.model('GatemanClaim');
        } else {
            return mongoose.model('GatemanClaim',ClaimSchema);
        }
        
}