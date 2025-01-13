const express = require('express');
const { signup, login, createFavorite, removeFavorite} = require('../controllers');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

//! Routes for the user
router.post('/signup', signup);
router.post('/login', login);
router.post('/createFavorite', createFavorite);
router.post('/removeFavorite', removeFavorite);

//! Protected Routes
router.use(authenticateToken);


module.exports = router;
