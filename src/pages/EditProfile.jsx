import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Textarea from '../components/Textarea';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Select';
import Select from '../components/Select';
import Switch from '../components/Switch';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const fileRef = useRef(null);
  const navigate = useNavigate(); // Added for back navigation

  const [formData, setFormData] = useState({
    website: user?.website || '',
    bio: user?.bio || '',
    gender: user?.gender || 'prefer-not-to-say',
    showSuggestions: user?.showSuggestions || true,
    avatar: user?.avatar || '',
  });

  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || null);
  const [bioLength, setBioLength] = useState(formData.bio.length);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'bio') {
      setBioLength(value.length);
    }
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, showSuggestions: checked }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(-1);  // Return to previous page
    } catch (error) {
      toast.error(error.message || 'Failed to update profile', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-6"> {/* Removed ml-64, relying on Layout for sidebar */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="text-black border-gray-300 hover:bg-gray-100"
          onClick={handleBack}
        >
          Back
        </Button>
        <h1 className="text-xl font-semibold text-black">Edit profile</h1>
        <div></div> {/* Placeholder to balance the flex layout */}
      </div>

      {/* Profile Photo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {previewAvatar ? (
            <img
              src={previewAvatar}
              alt={user?.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <p className="text-sm font-medium text-black">{user?.username}</p>
        </div>
        <Button
          variant="default"
          className="text-white bg-blue-500 rounded-full text-sm px-4 py-1"
          onClick={() => fileRef.current.click()}
        >
          Change photo
        </Button>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileRef}
        />
      </div>

      {/* Website */}
      <div className="mb-6">
        <label htmlFor="website" className="text-sm font-medium text-black">Website</label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="mt-1 bg-white border-gray-300 text-black"
        />
        <p className="text-xs text-gray-500 mt-1">
          Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.
        </p>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <label htmlFor="bio" className="text-sm font-medium text-black">Bio</label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="mt-1 bg-white border-gray-300 text-black"
          rows={3}
        />
        <p className="text-xs text-gray-500 text-right mt-1">{bioLength} / 150</p>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label htmlFor="gender" className="text-sm font-medium text-black">Gender</label>
        <Select
          value={formData.gender}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
        >
          {({ value, onValueChange }) => (
            <>
              <SelectTrigger>
                {({ value }) => <SelectValue placeholder="Select gender" value={value} />}
              </SelectTrigger>
              <SelectContent value={value} onValueChange={onValueChange}>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </>
          )}
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          This won't be part of your public profile.
        </p>
      </div>

      {/* Account Suggestions Toggle */}
      <div className="mb-6">
        <label className="text-sm font-medium text-black">Show account suggestions on profiles</label>
        <div className="flex items-center gap-2 mt-1">
          <Switch
            checked={formData.showSuggestions}
            onCheckedChange={handleSwitchChange}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Choose whether people can see similar account suggestions on your profile, and whether your account can be suggested on other profiles.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full bg-blue-500 text-white rounded-full"
        onClick={handleSave}
      >
        Submit
      </Button>

      {/* Additional Note */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Certain profile info, like your name, bio, and links, is visible to everyone. See what profile info is visible.
      </p>
    </div>
  );
};

export default EditProfile;