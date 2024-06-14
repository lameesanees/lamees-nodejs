
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./db'); 
const app = express();
const port = 3000;
app.use(bodyParser.json());

// Secret key for JWT
const SECRET_KEY = 'super2024';

// Dummy path 
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js JWT Authentication Server!');
});

// API user registration
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Email already in use' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// API for user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

// api for get all users
app.get('/api/users', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// api to get all user from id
app.get('/api/users/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// my port
app.listen(port, () => {
  console.log('Server is running on port ' +port);
});
