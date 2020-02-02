module.exports = (mongoose)=>{
    var mn = mongoose.modelNames();
    var RoleSchema = mongoose.Schema({
        name: {
            type: String,
            required: [true,'Sorry, the role name is required'],
            unique: true
        }
    });
    if (mn.includes("GatemanRole")){
        return mongoose.model("GatemanRole");
    } else {
        return mongoose.model("GatemanRole", RoleSchema);
    }  
}