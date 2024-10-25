// Authentication component logic
const AuthComponent = (() => {
    const authMessage = document.getElementById('auth-message');

    function displayAuthMessage(message) {
        authMessage.innerText = message;
    }

    return { displayAuthMessage };
})();

export default AuthComponent;
