import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState('');

  // Handle receiving messages
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  // Load pre-existing messages upon login
  useEffect(() => {
    if (loggedIn) {
      axios.get('http://localhost:5000/messages')
        .then(res => {
          setMessages(res.data);
        })
        .catch(err => console.error('Error fetching messages:', err));
    }
  }, [loggedIn]);

  const handleRegister = async () => {
    await axios.post('http://localhost:5000/register', { username, password });
    alert('User registered! You can now log in.');
  };

  const handleLogin = async () => {
    const res = await axios.post('http://localhost:5000/login', { username, password });
    setToken(res.data.token);
    setLoggedIn(true);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('sendMessage', { sender: username, content: message });
      setMessage('');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {!loggedIn ? (
        <div>
          <h2>Chat Login</h2>
          <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {username}!</h2>
          <div id='chat-container' style={{ height: '700px', overflowY: 'scroll', border: '1px solid black', padding: '10px', textAlign: 'left' }}>
            {messages.map((msg, index) => (
              <p key={index}><strong>{msg.sender}:</strong> {msg.content}</p>
            ))}
          </div>
          <input type='text' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  )
}

export default App;