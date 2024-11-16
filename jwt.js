const jwt = require('jsonwebtoken');
// const { findOne } = require('./models/user');
// const router = require('./routes/userRoutes');

//isme ham yeh bana rahe hai ki login karne k lie token hoga user par
//if token hai to verify karenge sahi hai ya nhi else unauthorized 401 vro
const jwtAuthMiddleware = (req, res, next) =>  {

    //first check header req is authorisez or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'token not Found'});

//extract the jwt token from the req header
const token = req.headers.authorization.split(' ')[1];
if(!token) return res.status(401).json({error:"Unauthorized hai vroo"});

try{
//verify the JWT token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
//this will return the payload we have used

//tokens mai genrally user ki info hoti hai
//attaching user information to request object

req.user = decoded
next();
}catch(err){
    console.log(err);
    res.status(401).json({error: 'Invalid token'});
}

}





//function to genrate JWT Token

const generateToken =(userData) => {
    //this will genrate the JWT token from the user data
    return jwt.sign(userData, process.env.JWT_SECRET,{expiresIn:3000});

}



module.exports = {jwtAuthMiddleware , generateToken}