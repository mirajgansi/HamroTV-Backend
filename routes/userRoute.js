const express = require('express')

const router = express.Router();

const userController = require('../controller/userController'); // Ensure path is correct
const authMiddleware = require('../middleware/authMiddleware');


// Protected routes (require valid JWT)
router.get('/', authMiddleware, userController.getUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
router.post('/login',userController.loginUser)
router.post('/register',userController.registerUser)
// router.get('/view_users',userController.getUser)
// router.post('/create_users',userController.createUser)

// router.put('/:id',userController.updateUser)
router.delete('/:id',userController.deleteUser)

module.exports = router;
