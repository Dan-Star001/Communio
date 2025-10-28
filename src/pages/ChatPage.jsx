import React from 'react';
import axios from 'axios';
import ChatArea from '../components/chats/ChatArea';

const ChatPage = () => {
    // Fix message sending and receiving issues
    const handleSendMessage = async (message) => {
        try {
            const response = await axios.post('/api/messages', { message }, { headers: { Authorization: `Bearer ${token}` } });
            // Handle successful message sending
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return <ChatArea />; // Render ChatArea for mobile
};

export default ChatPage;