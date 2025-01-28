const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { username, password } = req.body; // Renamed to 'password' for clarity
    if (!username || !password) {
        return res.status(400).json({ error: "Please provide username and password" });
    }
    try {
        const checkExistingUser = await User.findOne({ where: { username } });
        if (checkExistingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ username, password_hash: hashPassword });
        res.status(201).json({ message: "Registration successful." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body; // Correctly destructured
    if (!username || !password) {
        return res.status(400).json({ error: "Please provide username and password" });
    }
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash); // Correct field
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user.id, username: user.username }, // Use user.id as the identifier
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
        res.status(200).json({ message: "Successfully logged in", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password_hash'] } }); // Exclude sensitive data
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
};

const createUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Please provide username and password" });
    }
    try {
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({ username, password_hash: hashPassword });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Optionally handle password updates with hashing
        await user.update(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
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

module.exports = { registerUser, loginUser, getUser, createUser, updateUser, deleteUser };