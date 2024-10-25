const socket = new WebSocket('ws://localhost:3000');
const chatSection = document.getElementById('chat-section');
const authSection = document.getElementById('auth-section');
const chatArea = document.getElementById('chat');
const messageInput = document.getElementById('message-input');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authMessage = document.getElementById('auth-message');

// Event listeners
loginBtn.addEventListener('click', login);
registerBtn.addEventListener('click', register);
document.getElementById('send-message-btn').addEventListener('click', sendMessage);

// WebSocket event handlers
socket.onopen = () => {
    console.log('Connected to server');
};

socket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    displayMessage(messageData);
};

// User authentication functions
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            authSection.style.display = 'none';
            chatSection.style.display = 'block';
        } else {
            authMessage.innerText = data.error;
        }
    });
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        authMessage.innerText = data.message || data.error;
    });
}

// Sending messages to WebSocket
function sendMessage() {
    const content = messageInput.value;
    if (!content) return;

    const message = { content, timestamp: Date.now() };
    socket.send(JSON.stringify(message));
    messageInput.value = '';
}

// Displaying messages in the chat area
function displayMessage(messageData) {
    const messageElement = document.createElement('div');
    messageElement.innerText = `${new Date(messageData.timestamp).toLocaleTimeString()}: ${messageData.content}`;
    chatArea.appendChild(messageElement);
}
