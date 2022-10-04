const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        required: true
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
    joinedOn:{
        type: Date,
        default: Date.now,
    }
});


const User = new mongoose.model("User", userSchema);
module.exports = User;