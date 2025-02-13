const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, testConnection } = require('./database/db'); 
const userRoute = require('./routes/userRoute');
const movieRoute = require('./routes/movieRoute');
const path = require('path');
const Movie = require('./model/movie'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.get('/login', (req, res) => {
    res.send("Welcome to the web page");
});

// Server-side route for fetching movie details
app.get('/movies/name/:movie_name', async (req, res) => {
    try {
        const movieName = req.params.movie_name.trim();
        console.log(`Searching for movie: ${movieName}`);

        // Fix: Use correct column name `movie_name`
        const movieData = await Movie.findOne({ where: { movie_name: movieName } });

        if (!movieData) {
            console.log("Movie not found");
            return res.status(404).json({ error: "Movie not found" });
        }

        res.json({
            id:movieData.movie_id, 
            name: movieData.movie_name,  
            youtube_link: movieData.youtube_link,
            thumbnailupload: movieData.thumbnailupload
        });
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



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
