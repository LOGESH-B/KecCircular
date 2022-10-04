const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
   filePath:{
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
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required:true
   }
   
});


const Circular = new mongoose.model("Circular", circularSchema);
module.exports = Circular;