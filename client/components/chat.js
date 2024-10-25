// Chat component logic
const ChatComponent = (() => {
    const chatArea = document.getElementById('chat');

    function displayMessage(messageData) {
        const messageElement = document.createElement('div');
        messageElement.innerText = `${new Date(messageData.timestamp).toLocaleTimeString()}: ${messageData.content}`;
        chatArea.appendChild(messageElement);
    }

    return { displayMessage };
})();

export default ChatComponent;
