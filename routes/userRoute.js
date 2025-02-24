const express = require('express');
const router = express.Router();
const userController = require('../controller/userController'); 
const upload = require('../middleware/imageUpload');

// Public routes (no authentication required)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes (require valid JWT)
router.get('/email/:email',userController.getUserByEmail);

router.put('/:email/update', upload.single('profilePicture'), userController.updateUserById );

router.delete('/:id',userController.deleteUser);

module.exports = router;
