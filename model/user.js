const monogoose = require('mongoose');

const userSchema = new monogoose.Schema({
    googleId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        // required:true
    },
    username:{
        type:String,
        required:true
    },
    image: {
        type: String,
      },
    password:{
        type:String,
        // required:true
    },
    message:[{
        type:String,
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = new monogoose.model('User',userSchema);