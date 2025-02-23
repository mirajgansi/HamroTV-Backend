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


const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
            id: user.id,
            username: user.username,
            profilePicture:'uploads/default.jpg',
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json(userData);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.file) {
            user.profilePicture = req.file.path;
        }
        const { username, email, password } = req.body;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
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

module.exports = { registerUser, loginUser, getUserByEmail, updateUserById , deleteUser };