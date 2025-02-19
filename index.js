const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, testConnection } = require('./database/db'); 
const userRoute = require('./routes/userRoute');
const movieRoute = require('./routes/movieRoute');
const path = require('path');
const Movie = require('./model/movie'); 

// Middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = process.env.PORT || 5000;



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

app.post('/login', (req, res) => {
    res.send("Welcome to the web page");
});


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide username, email, and password" });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create user (assuming beforeCreate hooks handle password hashing)
        const newUser = await User.create({ username, email, password });

        res.status(201).json({ success: true, message: "Registration successful", data: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});




app.put('/:id/update',
    upload.single('profilepicture'), // Single file with exact field name
    (req, res) => {
      if (!req.file) return res.status(400).send('No file uploaded');
      res.json({
        message: 'File uploaded!',
        path: req.file.path
      });
    }
  );


 
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


app.get('/email/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const userData = await getUserDataByEmail(email); // Replace with your DB query function
    if (userData) {
      res.json(userData); // Return the user data
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
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