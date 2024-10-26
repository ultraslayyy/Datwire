import React, { useEffect, useState } from 'react';
import { db } from './firebase';

function Message({ message }) {
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const fetchNickname = async () => {
            const userRef = db.collection('users').doc(message.uid);
            const doc = await userRef.get();
            if (doc.exists) {
                setNickname(doc.data().nickname);
            } else {
                setNickname('Unknown User');
            }
        };

        fetchNickname();
    }, [message.uid]);

    return (
        <div className="message">
            <strong>{nickname}</strong>: {message.content}
        </div>
    );
}

export default Message;