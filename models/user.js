const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//create person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    email:{
        type:String
        
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    adhaarCardNumber:{
        type:Number,
        required:true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    role:{
        type:String,
        enum:['admin', 'voter'],
        default: 'voter'
    },
     isVoted:{
        type: Boolean,
        default:false
     }
});

userSchema.pre('save', async function(next){
    const User = this; //person mai sab store hoga
  
  //hash only if password is modified or saving new otherwise...
  if(!User.isModified('password')) return next();

    try{
        //hash password genration
     const salt = await bcrypt.genSalt(10);

     //hash password
     const hashedPassword = await bcrypt.hash(User.password, salt);

     //overwrite the plain pass with hashed pass
     User.password = hashedPassword;

    next();
  }catch(err){
    return next(err);
  }
 
})
userSchema.methods.comparePassword = async function(candidatePassword){
    try{
     //use Bcrypt to match the password that is hashed
 const isMatch = await bcrypt.compare(candidatePassword, this.password);
            return isMatch;

    }catch(err){
        throw err;
    }
 }





const User = mongoose.model('User', userSchema);
module.exports = User;




