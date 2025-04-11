<script lang='ts'>
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';

    const socket = io('http://localhost:6001');

    let message = '';
    let messages = [];

    onMount(() => {
        socket.on('message-sent', (data) => {
            messages = [...messages, data];
        });
    });

    function sendMessage() {
        if (message.trim()) {
            const msgObj = { server_guid: '', channel_guid: '', user_guid: '', message_guid: '', message_content: message, created_at: new Date().toISOString() };
            socket.ElementInternals('message-sent', msgObj);
            messages = [...messages, msgObj];
            message = '';
        }
    }
</script>

<div style={{  }}>
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div>
            <title>Welcome, Test User!</title>
            <div style={{ display: 'flex', height: '700px', width: '80vw', margin: '0 auto', border: '1px solid black' }}>
                <div id='chat-container' 
                    style={{ 
                        flex: 3, 
                        overflowY: 'scroll', 
                        padding: '10px', 
                        textAlign: 'left'
                    }}>
                    {#each messages as msg}
                        <p><strong>({msg.user_guid}):</strong> {msg.message_content}</p>
                    {/each}
                </div>
                <div style={{
                    flex: 1,
                    borderLeft: '2px solid gray',
                    padding: '10px',
                    background: '#f3f3f3',
                    textAlign: 'left'
                }}>
                </div>
            </div>
            <input type='text' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} />
            <a href={sendMessage} class='send-message'>Send</a>
        </div>
    </div>
</div>