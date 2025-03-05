require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Message Schema
const MessageSchema = new mongoose.Schema({
    sender: String,
    content: String,
    parentMessageId: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

const connectedUsers = new Map();

// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'Username is taken. Please pick another' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.json({ message: 'User registered' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
})

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load messages' });
    }
});

// Websocket Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', async ({ sender, content }) => {
        const message = new Message({ sender, content });
        await message.save();
        console.log('Message sent:', message);
        io.emit('receiveMessage', message);
    });

    socket.on('join', (username) => {
        connectedUsers.set(username, socket.id);
        io.emit('updateUsers', Array.from(connectedUsers.keys()));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Update connected user list
        for (let [username, id] of connectedUsers) {
            if (id === socket.id) {
                connectedUsers.delete(username);
                break;
            }
        }

        io.emit('updateUsers', Array.from(connectedUsers.keys()));
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));