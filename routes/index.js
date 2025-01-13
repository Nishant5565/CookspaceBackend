const express = require('express');
const { signup, login} = require('../controllers');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

//! Routes for the user
router.post('/signup', signup);
router.post('/login', login);

//! Protected Routes
router.use(authenticateToken);


module.exports = router;
