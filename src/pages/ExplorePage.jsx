import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { Search } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

const ExplorePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timerRef = useRef(null);

  // Sample explore grid data
  // const exploreItems = [
  //   { id: 1, image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba', likes: 1234 },
  //   { id: 2, image: 'https://images.unsplash.com/photo-1682687221038-404cb8830901', likes: 2345 },
  //   { id: 3, image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538', likes: 3456 },
  //   { id: 4, image: 'https://images.unsplash.com/photo-1682687220067-dced9a881b56', likes: 4567 },
  //   { id: 5, image: 'https://images.unsplash.com/photo-1682687220501-2d43ce2a80e9', likes: 5678 },
  //   { id: 6, image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae', likes: 6789 },
  //   { id: 7, image: 'https://images.unsplash.com/photo-1682687221038-404cb8830901', likes: 7890 },
  //   { id: 8, image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba', likes: 8901 },
  //   { id: 9, image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538', likes: 9012 },
  // ];

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    // Debounce search
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get(`https://backend-e54z.onrender.com/api/users/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setResults(response.data.users);
          setIsDropdownOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  const handleResultClick = (userId) => {
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
    navigate(`/profile/${userId}`);
  };



  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  alert('Now searching user: ' + query);
                }
              }}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            {isDropdownOpen && (
              <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                {results.length > 0 ? (
                  results.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-3 hover:bg-gray-50"
                    >
                      <div
                        onClick={() => handleResultClick(user._id)}
                        className="flex items-center flex-1 cursor-pointer"
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="h-8 w-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <FaUser className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-gray-500">@{user.userName}</p>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    <p className="text-sm">There is no user with this username.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Explore Grid */}
        {/* <div className="grid grid-cols-3 gap-1 md:gap-4">
          {exploreItems.map((item) => (
            <div
              key={item.id}
              className="aspect-square bg-surface overflow-hidden cursor-pointer group relative"
            >
              <img
                src={item.image}
                alt="Explore post"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white font-semibold">
                  <span className="text-sm md:text-base">{item.likes.toLocaleString()} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ExplorePage;
