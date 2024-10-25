const express = require('express');
const db = require('../database');
const router = express.Router();

// Send a message
router.post('/send', (req, res) => {
    const { serverId, channelId, userId, content } = req.body;
    
    db.run('INSERT INTO messages (server_id, channel_id, user_id, content) VALUES (?, ?, ?, ?)', 
    [serverId, channelId, userId, content], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Message could not be sent' });
        }
        res.status(201).json({ message: 'Message sent successfully' });
    });
});

// Get messages from a channel
router.get('/:serverId/:channelId', (req, res) => {
    const { serverId, channelId } = req.params;
    
    db.all('SELECT * FROM messages WHERE server_id = ? AND channel_id = ?', 
    [serverId, channelId], (err, messages) => {
        if (err) {
            return res.status(500).json({ error: 'Could not retrieve messages' });
        }
        res.json(messages);
    });
});

module.exports = router;
