const express = require('express');
const router = express.Router();
const userController = require('../controller/userController'); 
const upload = require('../middleware/imageUpload'); // Import controller

// Public routes (no authentication required)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes (require valid JWT)
router.get('/email/:email',userController.getUserByEmail);

router.put('/:id/update', upload.single('profilePicture'), userController.updateUser);

router.delete('/:id',  userController.deleteUser);

module.exports = router;
