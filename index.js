// Initialization
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');

// Creating a Server
const app = express();

// Creating a port
const PORT = process.env.PORT || 5000;

// Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Using the userRoute for user-related operations
app.use('/users', userRoute);

// POST request for login (if needed separately)
app.post('/login', (req, res) => {
    res.send("Welcome to the web page");
});

// POST request for register (this should handle user registration)
app.post('/register', (req, res) => {
    res.send("Welcome to the web page");
});

// Sync with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database updated successfully!');
    })
    .catch((error) => {
        console.error('Error updating database:', error);
    });

// Running on PORT
app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});
