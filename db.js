const mongoose = require('mongoose');
require('dotenv').config(); 

const  mongoURL =  process.env.MONGODB_URL_LOCAL;
// const  mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL , { })
    .then(() => console.log('MongoDB connection successful'))
    .catch(err => console.error('MongoDB connection has errors:', err));

// Access the connection object
const db = mongoose.connection;

// Event listeners to monitor connection status
db.on('connected', () => {
    console.log('Connected to MongoDB Server');
});

db.on('disconnected', () => {
    console.log('MongoDB connection is disconnected');
});

db.on('error', (err) => {
    console.log('MongoDB connection has errors:', err);
});

// Export the db connection module
module.exports = db;
