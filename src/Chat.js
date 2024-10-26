import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import Message from './Message';

function Chat({ user }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = db.collection('users').doc(user.uid);
            const doc = await userRef.get();
            if (doc.exists) {
                setNickname(doc.data().nickname);
            } else {
                await userRef.set({
                    email: user.email,
                    nickname: user.displayName || user.email.split('@')[0],
                    roles: ['member']
                });
                setNickname(user.displayName || user.email.split('@')[0]);
            }
        };

        fetchUserData();
    }, [user.uid, user.email, user.displayName]);

    useEffect(() => {
        const unsubscribe = db
            .collection('messages')
            .orderBy('timestamp')
            .onSnapshot((snapshot) => {
                const fetchedMessages = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(fetchedMessages);
            });
        return unsubscribe;
    }, []);

    const sendMessage = () => {
        if (newMessage.trim()) {
            db.collection('messages').add({
                content: newMessage,
                uid: user.uid,
                timestamp: db.FieldValue.serverTimestamp(),
            });
            setNewMessage('');
        }
    };

    return (
        <div className="chat">
            <button onClick={() => auth.signOut()}>Sign Out</button>
            <div className="messages">
                {messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
            </div>
            <input
                type="text"
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}