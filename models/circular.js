const mongoose = require('mongoose');
const {Schema}=mongoose
const circularSchema = new Schema({
   filePath:{
    type:String,
    required:true
   },
   number:{
      type:String,
      required:true
   },
   title:{
      type:String,
      required:true
   },
   postedOn:{
    type:Date,
    required:true
   },
   batch:{
    type:[String],
    required:true
   },
   dept:{
    type:[String],
    required:true
   },
   postedBy:{
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
    required:true
   }
   
});


module.exports= mongoose.model("Circular", circularSchema);
