module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
        var ClaimSchema = mongoose.Schema({
            name: {
                type: String,
                required: [true,'Sorry, the claim is required'],
                unique: true
            }
        });
        if (mn.includes("Claim")){
            return mongoose.model('Claim');
        } else {
            return mongoose.model('Claim',ClaimSchema);
        }
        
}