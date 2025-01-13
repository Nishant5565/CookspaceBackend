const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { PORT, MONGODBURL } = process.env;
const app = express();
const User = require('./models/index').User;
const authenticateToken = require('./middleware/auth');

//* Middleware
app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
));
app.use(bodyParser.json());


//* Auth jwt checker and user data

app.post('/api/check-auth', authenticateToken,async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { email,  userName, id, favourites } = user;

    res.status(200).json({ email, userName, id, favourites });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
});

//* MongoDB Connection
mongoose.connect(MONGODBURL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(MONGODBURL, 'MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send(`
    <h1>Server is running </h1>

  `);
});
app.use('/api',require('./routes'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});