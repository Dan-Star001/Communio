import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // ✅ ADD THIS IMPORT
import { toggleCreateModal } from '../../store/uiSlice';
import { createPost, fetchFeed } from '../../store/postsSlice';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import { X, Upload, Image, Video } from 'lucide-react';
import { toast } from 'react-toastify';

const CreatePostModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.isCreateModalOpen ?? false);

  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    dispatch(toggleCreateModal());
    setCaption('');
    setSelectedFile(null);
    setFilePreview(null);
    setIsLoading(false);
    if (filePreview) URL.revokeObjectURL(filePreview);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
  };

  const handleShare = async () => {
    // Check if caption only contains whitespace or is completely empty
    if (!caption.trim() && !selectedFile) {
      toast.error('Please add caption or media');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    // ✅ CRITICAL: Always append the 'text' field, even if it's empty, so it shows up in req.body
    formData.append('text', caption.trim()); 
    if (selectedFile) {
      // ✅ CRITICAL: Field name 'media' must match multer.middleware.js
      formData.append('media', selectedFile);
    }

    try {
      await dispatch(createPost(formData)).unwrap();
      await dispatch(fetchFeed());
      toast.success('Post created!');
      
      handleClose();  // Close modal
      navigate('/home');  // Go to homepage/feed
      
    } catch (error) {
      // Accessing error.payload is more reliable for Redux thunks 
      const errorMessage = error.payload?.message || error.message || 'Failed to create post';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="lg"> 
      <ModalHeader className="border-b border-gray-200 p-4">
        {/* ✅ FIXED: Direct text, NO <h2> */}
        Create New Post
      </ModalHeader>

      <ModalBody className="p-6"> 
        {filePreview ? (
          <div className="relative mb-4">
            {selectedFile.type.startsWith('image/') ? (
              <img 
                src={filePreview} 
                alt="Preview" 
                className="w-full h-auto rounded-lg max-h-96 object-contain" 
              />
            ) : (
              <video 
                src={filePreview} 
                controls 
                className="w-full h-auto rounded-lg max-h-96 object-contain"
              >
                Your browser doesn't support video.
              </video>
            )}
            
            <Button 
              variant="ghost" 
              className="absolute top-2 right-2 bg-white/80 p-1 rounded-full" 
              onClick={handleRemovePreview}
            > 
              <X className="h-4 w-4 text-gray-600" /> 
            </Button>

            <div className="flex justify-center mt-2">
              {selectedFile.type.startsWith('image/') ? (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Image className="h-3 w-3" /> Photo
                </span>
              ) : (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Video className="h-3 w-3" /> Video
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" /> 
            <h3 className="text-sm font-medium text-gray-700 mb-1">Drag photo or video here</h3> 
            <p className="text-xs text-gray-500">or</p> 
            <label className="cursor-pointer block mt-2">  
              <span className="text-primary hover:underline text-sm font-medium">Select from computer</span> 
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              /> 
            </label>
            <p className="text-xs text-muted-foreground mt-2">JPEG, PNG, MP4, MOV (Max 50MB)</p>
          </div>
        )}

        <Textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full min-h-[80px] mb-4"
        /> 
      </ModalBody>

      <ModalFooter className="flex justify-end gap-2 p-4"> 
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleShare} 
          disabled={isLoading}
          className={isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}
        > 
          {isLoading ? 'Sharing...' : 'Share'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreatePostModal;
  