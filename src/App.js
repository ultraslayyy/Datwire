import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import Login from './Login';
import Chat from './Chat';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((user) => setUser(user));
    }, []);

    return (
        <div className="App">
            {user ? <Chat user={user} /> : <Login />}
        </div>
    );
}

export default App;