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
  const [connectedUsers, setConnectedUsers] = useState([]);

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

  // Update connected user list
  useEffect(() => {
    socket.on('updateUsers', (users) => {
      setConnectedUsers(users)
    });
    return () => socket.off('updateUsers');
  }, []);

  const handleRegister = async () => {
    await axios.post('http://localhost:5000/register', { username, password });
    alert('User registered! You can now log in.');
  };

  // Handling Logins
  const handleLogin = async () => {
    try {
      console.log('Attemptimg login with:', { username, password });
      const res = await axios.post('http://localhost:5000/login', { username, password });
      console.log('Login Response:', res.data);

      if (res.status === 200) {
        if (!res.data.token) {
          console.error('Token missing in response!');
          alert('Login failed: No token received');
          return;
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', username);
        setLoggedIn(true);
        socket.emit('join', username);
      } else {
        alert(res.data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (storedToken && storedUsername) {
      setUsername(storedUsername);
      setLoggedIn(true);
      socket.emit('join', storedUsername);
    }
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('sendMessage', { sender: username, content: message });
      setMessage('');
    }
  };

  return (
    <div style={{  }}>
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
            <div style={{ display: 'flex', height: '700px', width: '80vw', margin: '0 auto', border: '1px solid black' }}>
              <div id='chat-container' 
                style={{ 
                  flex: 3, 
                  overflowY: 'scroll', 
                  padding: '10px', 
                  textAlign: 'left'
                }}>
                {messages.map((msg, index) => (
                  <p key={index}><strong>{msg.sender}:</strong> {msg.content}</p>
                ))}
              </div>
              <div style={{
                flex: 1,
                borderLeft: '2px solid gray',
                padding: '10px',
                background: '#f3f3f3',
                textAlign: 'left'
              }}>
                <h3>Online Users</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {connectedUsers.map((user, index) => (
                    <li key={index} style={{ padding: '5px 0', borderBottom: '1px solid #ccc' }}>{user}</li>
                  ))}
                </ul>
              </div>
            </div>
            <input type='text' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
            <button onClick={() => {
              localStorage.removeItem('token');
              setLoggedIn(false);
            }}>Logout</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App;