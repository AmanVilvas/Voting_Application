const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config(); 

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req body

const {jwtAuthMiddleware } = require('./jwt');


// Use the routers
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidate',candidateRoutes);



// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable for port if available
app.listen(PORT, () => {
    console.log(`Server is alive and listening on port ${PORT}`);
});