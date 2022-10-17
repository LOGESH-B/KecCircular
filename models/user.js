const mongoose = require('mongoose');
const {Schema}=mongoose


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    department: {
        type: String,
        default:"All"
    },
    batch: {
        type: String,
    },
    type: {
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default:false,
    },
    isDeptAdmin:{
        type: Boolean,
        default:false,
    },
    device_id:{
        type:String,
        default:"-",
      //  required: true
    },
    joinedOn:{
        type: Date,
        default: Date.now,
    }
});


module.exports=mongoose.model("User", userSchema);
