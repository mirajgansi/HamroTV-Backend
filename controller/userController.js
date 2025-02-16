const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        // const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, 10);
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: 'User created successfully',
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "email Invalid credentials" });
        }
       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "password Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
          );
          res.status(200).json({ 
            message: "Successfully logged in", 
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email
            }
          });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude password from the response
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json(userData);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, profilepictureUrl } = req.body;

    try {
        // Find the user by primary key (id)
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's details
        user.username = username || user.username;
        user.email = email || user.email;

        // If a password is provided, hash it and update the user's password
        if (password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        // Update profile picture URL if provided
        if (profilepictureUrl) {
            user.profilePicture = profilepictureUrl;
        } else {
            user.profilePicture = null;  // Set profile picture to null if no URL is provided
        }

        // Save the updated user
        await user.save();

        // Respond with the updated user data
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture  // Return the updated profile picture URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser, loginUser, getUserByUsername, updateUser, deleteUser };