const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database'); // Import database connection
const router = express.Router();

// Register new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
        if (err) {
            return res.status(500).json({ error: 'User registration failed' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });

    /*try {
        const userExists = await db.findUser(username);
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        await db.createUser(username, password);
        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error'});
    } */
});

// Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
            return res.json({ message: 'Login successful', token });
        } else {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

module.exports = router;
