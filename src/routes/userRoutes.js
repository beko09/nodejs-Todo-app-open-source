const express = require('express');
const user = require('../controllers/userController')
const router = express.Router();
const authenticate =require('../middleware/authenticate')

//  todo router
router.post('/register', user.registerUser)
router.get('/me', authenticate, user.getUser)
router.delete('/me/token', authenticate, user.deleteUser)
router.post('/login', user.loginUser);


module.exports = router;
