const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const registerUser = async (req, res) => {
//     const { username, password_hash } = req.body; // Renamed to 'password' for clarity
//     if (!username || !password_hash) {
//         return res.status(400).json({ error: "Please provide username and password" });
//     }
//     try {
//         const checkExistingUser = await User.findOne({ where: { username } });
//         if (checkExistingUser) {
//             return res.status(400).json({ error: "Username already exists" });
//         }
//         const saltRounds = 10;
//         const hashPassword = await bcrypt.hash(password_hash, saltRounds);
//         await User.create({ username, password_hash: hashPassword });
//         res.status(201).json({ message: "Registration successful." });
//     } catch (error) {
        
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

const registerUser = async (req, res) => {
    try {
        const { username, email, password_hash } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password_hash
        });

        res.status(201).json({
            status: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body; // Correctly destructured
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash); // Correct field comparison
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Use user.id as the identifier
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
        res.status(200).json({ message: "Successfully logged in", token });
    } catch (error) {
        console.error(error);
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

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body; // Assuming you're updating these fields

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.password_hash = password || user.password_hash;

        await user.save();
        res.json(user);
    } catch (error) {
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

module.exports = { registerUser, loginUser, getUserByUsername,updateUser, deleteUser };
