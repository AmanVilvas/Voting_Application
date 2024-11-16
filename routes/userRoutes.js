const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware , generateToken} = require('../jwt');
 console.log('jwtAuthMiddleware: ', jwtAuthMiddleware); 
// POST route to add a User
router.post('/signup', async (req, res) => {
  try {

    const data = req.body; //assumes User's data in req body

     //create a new User doc using mongoose model
    const newUser = new User(data);

    //saves the new User
    const response = await newUser.save();
    console.log('User data saved successfully');

    const payload ={
      id: response.id
    }
console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("token is : ", token);

    res.status(200).json({response:response, token:token});

  } catch (err) {
    console.log('Error:', err); // Log the full error
    if (err.code === 11000) {
        return res.status(400).json({ error: 'Mobile number already exists' });
    }
    res.status(500).json({ error: 'Internal server error. Please try again later.', details: err.message });
}

});





//Login route

router.post('/login', async(req,res) => {
  try{
      //extract adhaarCardNumber  and password from the request body
const {adhaarCardNumber, password} = req.body;

// Find the user by adhaarCardNumber
const user = await User.findOne({adhaarCardNumber: adhaarCardNumber});

//if user does not exist or pass does not match, return error
if( !user || !(await user.comparePassword(password))){
  return res.status(401).json({error:'Invaild adhaarCardNumber or password'});
}

// generate token after adhaarCardNumber and pass is verified 
const payload = {
  id : user.id
}

const token = generateToken(payload);

//return token as response
res.json({token});



  }catch(err){
     console.log(err);
     res.status(500).json({error: 'Internal Server Error'});
  }


})




//profile route


router.get('/profile', jwtAuthMiddleware, async (req,res)=>{
try{

const userData = req.user;
console.log("User Data ", userData);

//user id se ham person find karenge konsa hai
const userId = userData.id;
const user = await User.findById(userId) 

res.status(200).json({user});
}catch(err){
  console.log(err);
  res.status(500).json({error:'internal Server Issue'})
}

 })


// PUT route to update a person's details

router.put('/:profile/password', async (req, res) => {
  try {
    const userId = req.user.id; // Extract the person's ID
    const {currentPassword, newPassword} = req.body //extracts new pass and old pass

    const user = await User.findById(userId)//checks the user from userId

    if( !(await user.comparePassword(currentpassword))){
      return res.status(401).json({error:'Invaild adhaarCardNumber or password'});
    }

    //updates the old pass from the new
    user.password = newPassword;
    await user.save();

    console.log('Password updated successfully');
    res.status(200).json({message: "Password Updated"});
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
