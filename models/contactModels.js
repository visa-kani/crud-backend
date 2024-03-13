const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
   firstName:{type:String},
   lastName:{type:String},
   email:{type:String},
   phone:{type:Number},
   created_date:{type: Date, default:Date.now}
})

module.exports = mongoose.model("LoginDetails", contactSchema);