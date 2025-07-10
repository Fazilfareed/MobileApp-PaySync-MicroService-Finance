const express = require('express');
const router = express.Router();

// Dummy in-memory users
let users = [
  {
    email: 'test@user.com',
    password: '123456',
    name: 'Test User',
  },
];

// LOGIN
router.post('/login', (req, res) => {
  console.log('Login request body:', req.body); // Add this

  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    return res.json({ success: true, message: 'Login successful', user });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// REGISTER
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const newUser = { email, password, name };
  users.push(newUser);

  return res.status(201).json({ success: true, message: 'User created', user: newUser });
});

module.exports = router;
