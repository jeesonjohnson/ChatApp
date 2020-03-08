const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

//Send data for new user
router.post('/signup', authController.signup);

module.exports = router;