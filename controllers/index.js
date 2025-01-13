const { Package, Booking, User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

//* function to generate the token
const generateToken = (user, remember) => {
  return jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: remember ? '365d' : '1d' });
};

const signup = async (req, res) => {
  try {
    console.log(req.body);
    const {userName, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();
    const token = generateToken(newUser, false);    
    res.status(201).json({ message: `Hello ${userName}, Thanks for registering in Cookscape ` , token, user : newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error registering user', error });

  }
};

const login = async (req, res) => {
  try {
    const { email, password , remember , role} = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.role !== role) return res.status(401).json({ message: 'No acccount with this email registered as ' + role });

    const token = generateToken(user, remember);
    res.status(200).json({ message: `Hello ${user.userName}, Welcome back to Cookscape`, token, 
    user : { userName: user.userName, email: user.email, id: user._id , favourites: user.favourites }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};


const createFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.favourites.push(recipeId);
    await user.save();
    res.status(200).json({ message: 'Recipe added to favourites', user });
  }
  catch (error) {
    res.status(500).json({ message: 'Error adding favourite', error });
  }
}

const removeFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const user = await User.findById(userId); 
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.favourites = user.favourites.filter(fav => fav !== recipeId);
    await user.save();
    res.status(200).json({ message: 'Recipe removed from favourites', user });
  }
  catch (error) {
    res.status(500).json({ message: 'Error removing favourite', error });
  }
}


module.exports = {
  signup,
  login,
  createFavorite,
  removeFavorite
};


