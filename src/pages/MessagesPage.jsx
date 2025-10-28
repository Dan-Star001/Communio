import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTab, setCollapsed } from '../store/uiSlice';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import Button from '../components/Button';
import ChatArea from '../components/chats/ChatArea';
import axios from 'axios';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET USER INFO SAFELY
  let user = null;
  let token = null;
  try {
    const userStr = localStorage.getItem('user');
    const tokenStr = localStorage.getItem('token');
    
    if (userStr) {
      user = JSON.parse(userStr);
    }
    if (tokenStr) {
      token = tokenStr;
    }
  } catch (e) {
    console.error('Error parsing user data:', e);
  }

  const userId = user?._id || user?.id;


  useEffect(() => {
    dispatch(setCollapsed(true));

    const fetchConversations = async () => {
      if (!token) {
        console.error('❌ No token found');
        setLoading(false);
        navigate('/signin');
        return;
      }

      let didTimeout = false;
      const timeout = setTimeout(() => {
        didTimeout = true;
        setLoading(false);
        setConversations([]);
        console.error('⏱️ Conversation fetch timed out');
      }, 20000);

      try {
        const response = await axios.get('https://backend-e54z.onrender.com/api/chat/conversations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });


        if (!didTimeout) {
          clearTimeout(timeout);
          if (response.data.success) {
            setConversations(response.data.conversations || []);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error fetching conversations:', error.response?.data || error.message);
        if (!didTimeout) {
          clearTimeout(timeout);
          setConversations([]);
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchConversations();
    } else {
      setLoading(false);
    }
  }, [token, dispatch, navigate]);

  const handleConversationClick = (index) => {
    setSelectedConversation(index);
    
    // On mobile, navigate to chat page
    if (window.innerWidth < 768) {
      navigate(`/messages/chat/${conversations[index]._id}`);
    }
  };

  const selectedConv = selectedConversation !== null ? conversations[selectedConversation] : null;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative">
        <div className="h-screen ml-0 lg:ml-16">
          <div className="h-full flex flex-col md:grid md:grid-cols-[auto_3fr]">
            {/* CONVERSATIONS LIST */}
            <div className="md:w-80 border-r border-gray-300 bg-white">
              <div className="px-4 py-4 border-b border-gray-300">
                <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
              </div>
              <nav className="flex-1 py-2 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="text-gray-500">Loading conversations...</div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-6">
                    <MessageCircle className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start a Conversation</h3>
                    <p className="text-gray-500 text-sm mb-4">Visit user profiles and click the message button to start chatting!</p>
                    <Button
                      onClick={() => navigate('/explore')}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Find Users
                    </Button>
                  </div>
                ) : (
                  conversations.map((conversation, index) => {
                    const isActive = selectedConversation === index;
                    // ✅ FIND OTHER PARTICIPANT SAFELY
                    const otherParticipant = conversation.participants?.find(
                      p => p._id !== userId
                    ) || { fullName: 'Unknown User', avatar: '/default-avatar.png' };

                    return (
                      <Button
                        key={conversation._id}
                        variant="ghost"
                        className={`w-full justify-start px-4 py-3 mb-1 transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' 
                            : 'hover:bg-blue-50 text-gray-700'
                        }`}
                        onClick={() => handleConversationClick(index)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          {otherParticipant?.avatar ? (
                            <img
                              src={otherParticipant.avatar}
                              alt={otherParticipant?.fullName || 'User'}
                              className="h-10 w-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 flex-shrink-0">
                              <FaUser className="h-4 w-4 text-blue-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {otherParticipant?.fullName || 'Unknown User'}
                              </p>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                {conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleDateString() : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500 truncate">
                                {conversation.lastMessage?.content || 'No messages yet'}
                              </p>
                              {conversation.unreadCount?.[userId] > 0 && (
                                <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-white font-medium">
                                    {conversation.unreadCount[userId]}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })
                )}
              </nav>
            </div>

            {/* CHAT AREA */}
            <div className="hidden md:block h-full">
              {selectedConv ? (
                <ChatArea conversation={selectedConv} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
                  <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the list to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage