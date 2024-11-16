const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware , generateToken} = require('../jwt');
const Candidate = require('../models/candidate');

//to verify the admin
const checkAdminRole = async (userID) =>{
  try{
const user  = await User.findById(userID);
if( user.role || User=== 'admin'){
  return true;
}

  }catch(err){
    return false;
  }
}

//POST route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
  try {

if(!(await checkAdminRole(req.user.id)))
  
  return res.status(403).json({message: 'This user does not have admin role'});




    const data = req.body;//assumes candidate's data in req body

    //create a new candidate doc using mongoose model
    const newCandidate = new Candidate(data);

    //saves the new User
    const response = await newCandidate.save();
    console.log('User data saved successfully');

    res.status(200).json({response:response});

  } catch (err){
    console.error('Error while saving candidate:', err);
    if (err.errors && err.errors['vote.user']) {
      return res.status(400).json({ error: 'vote.user is a required field' });
    }// Log the full error
    res.status(500).json({ error: 'Internal server error. Please try again later:)' });
}

})

// PUT route to update a person's details

router.put('/:candidateID',jwtAuthMiddleware,  async (req, res) => {
  try {
    if(!checkAdminRole(req.user>id))
      return res(403).json({message: 'This user does not have admin role'});
   
    const candidateID = req.params.candidateID; // Extract the person's ID
    const updatedCandidateData = req.body; // Updated data for the person
    const response = await Person.findByIdAndUpdate(candidateID, updatedCandidateData, {
      new: true, // return the updated documents
      runValidators: true, // checks if all the parameters e.g required in mongoose are correct or not
    });
    
    if (!response) {
      return res.status(404).json({ error: 'Person not found' });
    }

    console.log('Data updated successfully');
    res.status(200).json(response);
 
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//DELETE Route to deleet a candidate data

router.delete('/:candidateID',jwtAuthMiddleware,  async (req, res) => {
  try {
    if(!checkAdminRole(req.user.id))
      return res(403).json({message: 'This user does not have admin role'});
   
    const candidateID = req.params.candidateID; // Extract the person's ID
    
    const response = await Person.findByIdAndDelete(candidateID)    
    
    if (!response) {
      return res.status(404).json({ error: 'candidate not found' });
    }

    console.log('candidate updated successfully');
    res.status(200).json(response);
 
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
