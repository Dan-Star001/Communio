import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { useSocket } from '../../context/SocketContext';
import { addMessage, fetchMessages, updateUnreadCount } from '../../store/chatSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';
import axios from 'axios';

const ChatArea = ({ conversation: propConversation, conversationId: propConversationId }) => {
    const dispatch = useDispatch();
    const { id: paramConversationId } = useParams();
    
    // ✅ SAFE USER EXTRACTION FROM LOCALSTORAGE
    let userId = null;
    let userToken = null;
    let userRaw = null;
    
    try {
        userRaw = localStorage.getItem('user');
        const tokenStr = localStorage.getItem('token');
        
        if (userRaw) {
            const userObj = JSON.parse(userRaw);
            userId = userObj._id || userObj.id;
        }
        
        if (tokenStr) {
            userToken = tokenStr;
        }
    } catch (e) {
        console.error('❌ [ChatArea] Error parsing localStorage:', e);
    }

    // ✅ DETERMINE CONVERSATION ID FROM MULTIPLE SOURCES
    const conversationId = propConversation?._id || propConversationId || paramConversationId;
    const conversation = propConversation;


    // ✅ REDUX STATE
    const { messages, currentConversation } = useSelector(state => state.chat);
    const socket = useSocket();

    // ✅ SAFE MESSAGES ARRAY
    const conversationMessages = Array.isArray(messages?.[conversationId]) 
        ? messages[conversationId] 
        : [];

    // ✅ LOCAL STATE
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // ✅ EARLY RETURN FOR MISSING USER
    if (!userId) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-white p-4">
                <p className="text-red-500 text-center mb-4">User not found. Please log in again.</p>
                <button 
                    onClick={() => window.location.href = '/signin'}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // ✅ EARLY RETURN FOR NO CONVERSATION SELECTED
    if (!conversationId) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-white p-4">
                <div className="text-center">
                    <p className="text-gray-500 text-lg mb-2">Select a conversation to start chatting</p>
                    <p className="text-gray-400 text-sm">Choose from the list on the left</p>
                </div>
            </div>
        );
    }

    // ✅ SOCKET CONNECTION SETUP
    useEffect(() => {
        if (!socket || !conversationId) return;

        
        setIsConnected(socket.connected);
        socket.emit('join_conversation', conversationId);

        const handleNewMessage = (message) => {
            if (message && message._id) {
                dispatch(addMessage({ conversationId, ...message }));
            }
        };

        const handleMessageRead = ({ messageId }) => {
            dispatch(updateUnreadCount({ conversationId, count: 0 }));
        };

        const handleConnect = () => {
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        socket.on('new_message', handleNewMessage);
        socket.on('message_read', handleMessageRead);
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('message_read', handleMessageRead);
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, [socket, conversationId, dispatch]);

    // ✅ FETCH MESSAGES ON MOUNT
    useEffect(() => {
        if (conversationId && userId) {
            setIsLoading(true);
            
            dispatch(fetchMessages({ conversationId, page: 1 }))
                .unwrap()
                .then(() => {
                    setIsLoading(false);
                })
                .catch(err => {
                    setIsLoading(false);
                });
        }
    }, [conversationId, userId, dispatch]);

    // ✅ AUTO-SCROLL TO BOTTOM
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages]);

    // ✅ MARK MESSAGES AS READ
    useEffect(() => {
        if (conversationId && socket && conversationMessages.length > 0 && userId) {
            conversationMessages.forEach(message => {
                if (message.sender?._id !== userId && 
                    !message.readBy?.some(r => r.userId?.toString() === userId)) {
                    socket.emit('message_read', {
                        conversationId,
                        messageId: message._id
                    });
                }
            });
        }
    }, [conversationMessages, conversationId, userId, socket]);

    // ✅ SEND MESSAGE HANDLER
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !socket || !isConnected) {
            return;
        }

        
        socket.emit('send_message', {
            conversationId,
            content: inputMessage.trim(),
            type: 'text'
        });
        
        setInputMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // ✅ GET PARTICIPANT INFO FROM CONVERSATION OR REDUX
    const participant = conversation?.participants?.find(
        p => p._id?.toString() !== userId
    ) || currentConversation?.participants?.find(
        p => p._id?.toString() !== userId
    ) || { 
        fullName: 'Unknown User', 
        avatar: '/default-avatar.png',
        _id: null
    };


    // Create an Axios instance with default settings
    const axiosInstance = axios.create({
        baseURL: 'YOUR_API_BASE_URL', // Replace with your API base URL
    });

    // Set the Authorization header for all requests
    if (userToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* CHAT HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors"
                    onClick={() => {
                        if (participant._id) {
                            window.location.href = `/profile/${participant._id}`;
                        }
                    }}
                >
                    {participant.avatar ? (
                        <img
                            src={participant.avatar}
                            alt={participant.fullName}
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-gray-500" />
                        </div>
                    )}
                    <div>
                        <p className="text-base font-semibold text-gray-900">
                            {participant.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                            {isConnected ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            {/* MESSAGES CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : conversationMessages.length > 0 ? (
                    conversationMessages.map((message) => {
                        const isOwnMessage = message.sender?._id === userId;
                        return (
                            <div
                                key={message._id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] p-2`}>
                                    <div className={`rounded-2xl p-3 shadow-sm ${
                                        isOwnMessage
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                                    }`}>
                                        <p className="text-sm break-words">{message.content}</p>
                                    </div>
                                    <p className={`text-xs mt-1 text-gray-500 ${
                                        isOwnMessage ? 'text-right' : ''
                                    }`}>
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        {isOwnMessage && message.readBy?.some(r => r.userId?.toString() !== userId) && (
                                            <span className="ml-1 text-blue-500">✓✓</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={!isConnected}
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || !isConnected}
                        className="bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                {!isConnected && (
                    <p className="text-xs text-red-500 text-center mt-2">
                        Reconnecting to chat...
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChatArea;