const mongoose = require('mongoose');
const {Schema}=mongoose

const constantSchema = new Schema({
   dept:{
    type:[String]
   }
});


module.exports=mongoose.model("Constant", constantSchema);
