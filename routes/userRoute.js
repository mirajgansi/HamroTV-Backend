

const express = require('express')

const router = express.Router();

const userController = require('../controllers/userController')

router.post('/login',userController.loginUser)
router.post('/register',userController.registerUser)
// router.get('/view_users',userController.getUser)
// router.post('/create_users',userController.createUser)

// router.put('/:id',userController.updateUser)
// router.delete('/:id',userController.deleteUser)

module.exports = router;
