const mongoose = require('mongoose');
const candidateSchema = new mongoose.Schema({

    name:{
        type:String,
    }
    ,
    age:{
        type: Number,
        required: true
    },
    email:{
        type:String
        
    },
    party:{
        type:String,
        required:true
    },
    vote:{
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User',
   required: true
  },
  votedAt: {
    type: Date,
    deafult: Date.now()
  }
    },
    voteCount: {
        type: Number,
        deafult: 0
    }

});


const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
