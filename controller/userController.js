const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please provide username, email, and password" });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // ❌ Don't hash the password here! beforeCreate will handle it.
        const newUser = await User.create({ username, email, password });

        res.status(201).json({ message: "Registration successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (!user.password) {
            return res.status(500).json({ error: "User password is missing in database" });
        }

        // Debugging logs
        console.log("Request Body:", req.body);
        console.log("Entered Password:", password);
        console.log("Stored Password:", user.password);

        // Ensure password is a valid string
        if (typeof password !== "string") {
            return res.status(400).json({ error: "Invalid password input" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        // Return token in response
        return res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
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
    const { username, email, password, profilepicture } = req.body;

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
        if (profilepicture) {
            user.profilePicture = profilepicture;
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