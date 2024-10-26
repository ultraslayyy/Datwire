import React, { useState } from 'react';
import { auth } from './firebase';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = () => auth.signInWithEmailAndPassword(email, password);
    const signUp = async () => {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await db.collection.user;
        await db.collection('users').doc(user.uid).set({
            email: user.email,
            nickname: user.email.split('@')[0],
            roles: ['member'],
        });
    };

    return (
        <div className="login">
            <h2>Chat App</h2>
            <input 
                type="email" 
                placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button onClick={signIn}>Login</button>
            <button onClick={signUp}>Sign Up</button>
        </div>
    );
}

export default Login;