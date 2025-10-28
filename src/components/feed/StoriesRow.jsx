import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { viewStory } from '../../store/postsSlice';
import { Plus, X, Image, Video, Trash2 } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import Button from '../../components/Button';
import Input from '../../components/Input';

const StoriesRow = ({ stories }) => {
  const dispatch = useDispatch();
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [caption, setCaption] = useState('');

  const handleStoryClick = (storyId) => {
    dispatch(viewStory(storyId));
  };

  const handleAddStoryClick = () => {
    setShowAddStoryModal(true);
  };

  const handleCloseModal = () => {
    setShowAddStoryModal(false);
    setSelectedFile(null);
    setFilePreview(null);
    setCaption('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const handlePostStory = () => {
    // TODO: Upload to backend
    handleCloseModal();
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setFilePreview(null);
    document.getElementById('story-file').value = '';
  };

  return (
    <>
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          <div 
            className="flex flex-col items-center gap-2 min-w-0 shrink-0 cursor-pointer"
            onClick={handleAddStoryClick}
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 border-2 border-dashed border-primary flex items-center justify-center hover:scale-105 transition-transform duration-200">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs text-muted font-medium">Your story</span>
          </div>

          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-2 min-w-0 shrink-0 cursor-pointer group"
              onClick={() => handleStoryClick(story.id)}
            >
              <div className={`p-0.5 rounded-full ${story.isViewed ? 'border-2 border-muted' : 'bg-gradient-to-r from-primary to-accent'}`}>
                {story.userAvatar ? (
                  <img
                    src={story.userAvatar}
                    alt={story.username}
                    className="h-14 w-14 rounded-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <FaUser className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
              <span className="text-xs text-foreground font-medium truncate w-16 text-center">
                {story.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🆕 INSTAGRAM-STYLE STORY MODAL */}
      {showAddStoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Create Story</h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 🆕 CENTER PLUS ICON OR PREVIEW */}
            <div className="p-8 text-center">
              {filePreview ? (
                /* 🆕 INSTAGRAM PREVIEW SECTION */
                <div className="relative">
                  {/* Preview Image/Video */}
                  <div className="relative w-full max-w-[300px] mx-auto aspect-square rounded-lg overflow-hidden bg-black">
                    {selectedFile.type.startsWith('image/') ? (
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video 
                        src={filePreview} 
                        controls 
                        className="w-full h-full object-cover"
                      >
                        Your browser doesn't support video.
                      </video>
                    )}
                    
                    {/* 🆕 REMOVE BUTTON */}
                    <button
                      onClick={handleRemovePreview}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* File Type Badge */}
                  <div className="flex justify-center mt-3 gap-4">
                    {selectedFile.type.startsWith('image/') ? (
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        <Image className="h-3 w-3" />
                        <span>Photo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        <Video className="h-3 w-3" />
                        <span>Video</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 🆕 CENTER PLUS ICON */
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Plus className="h-10 w-10 text-gray-500" />
                  </div>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    id="story-file"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="story-file"
                    className="cursor-pointer text-primary hover:underline text-sm font-medium"
                  >
                    Select photo or video
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    MP4, JPEG, PNG (Max 15s)
                  </p>
                </div>
              )}
            </div>

            {/* Caption (Only show if file selected) */}
            {filePreview && (
              <div className="px-6 pb-6">
                <Input
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="h-10"
                />
              </div>
            )}

            {/* 🆕 Actions (Only show if file selected) */}
            {filePreview && (
              <div className="px-6 pb-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 hover:bg-blue-500"
                  onClick={handlePostStory}
                >
                  Share Story
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesRow;

