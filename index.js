const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, testConnection } = require('./database/db'); 
const userRoute = require('./routes/userRoute');
const movieRoute = require('./routes/movieRoute');
const path = require('path');
const User = require('./model/User');
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


// app.put('/users/:email/update', upload.single('profilepicture'), async (req, res) => {
//   console.log('Uploaded file:', req.file);

//   const { email } = req.params;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (req.body.username) {
//       user.username = req.body.username;
//     }

//     if (req.body.email) {
//       user.email = req.body.email;
//     }

//     if (req.file) {
//       user.profilePicture = req.file.path;
//     }

//     await user.save();

//     res.json({ message: 'User updated successfully' });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


const bcrypt = require('bcrypt'); 
app.put('/users/:email/update', upload.single('profilepicture'), async (req, res) => {
  console.log('Uploaded file:', req.file);
  console.log('Request body:', req.body);

  const { email } = req.params;
  const { username, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update username
    if (username) {
      user.username = username;
    }

    // Update password
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10); // Hash new password
    }

    // Update profile picture
    if (req.file) {
      // Replace backslashes with forward slashes for compatibility in URLs
      user.profilePicture = req.file.path.replace('\\', '/');
    }

    await user.save();

    // Return updated user data
    res.json({
      username: user.username,
      email: user.email,
      profilepicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
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