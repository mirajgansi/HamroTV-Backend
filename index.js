const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, testConnection } = require('./database/db'); // Import sequelize and testConnection
const userRoute = require('./routes/userRoute');
const movieRoute = require('./routes/movieRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRoute);
app.use('/movies', movieRoute);  

// Test database connection and start server
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server due to database connection issues:', err);
});