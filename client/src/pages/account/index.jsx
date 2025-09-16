import React, { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../services/stores/authStore';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ENDPOINT } from '../../services/utilities';
import NoImage from "../../assets/No-Image.webp";
import EditProfile from './editProfile';
import ChangePassword from './changePassword';

const Account = () => {
    const { auth, token, logout, validateToken } = useAuthStore();
    const [editMode, setEditMode] = useState(false);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        firstname: auth?.firstname || '',
        middlename: auth?.middlename || '',
        lastname: auth?.lastname || '',
        email: auth?.email || '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        if (auth?.profileImage) {
            setImagePreview(auth.profileImage.url);
        }
        console.log(auth)
    }, [auth]);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.match('image.*')) {
                toast.error("Please select an image file");
                return;
            }

            // Check file size (limit to 2MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            // Save file for upload
            setProfileImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="w-full mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = NoImage;
                                }}
                            />
                        ) : (
                            <span className="text-gray-500">No Image</span>
                        )}
                    </div>

                    {editMode && (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <button
                                onClick={triggerFileInput}
                                className="px-4 py-2 bg-blue-600 text-[var(--text-color)] rounded-md text-sm hover:bg-blue-700"
                            >
                                Change Photo
                            </button>
                        </>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex-1">
                    {editMode ? (
                        <EditProfile
                            form={form}
                            setForm={setForm}
                            setEditMode={setEditMode}
                            setIsLoading={setIsLoading}
                            isLoading={isLoading}
                            profileImage={profileImage}
                        />
                    ) : changePasswordMode ? (
                        <ChangePassword
                            setIsLoading={setIsLoading}
                            isLoading={isLoading}
                            setChangePasswordMode={setChangePasswordMode}
                        />
                    ) : (
                        <>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Personal Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-500">First Name</p>
                                        <p className="font-medium">{form.firstname}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-500">Middle Name</p>
                                        <p className="font-medium">{form.middlename || 'Not provided'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-500">Last Name</p>
                                        <p className="font-medium">{form.lastname}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{form.email}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-medium">{auth?.role || 'User'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex gap-4 mt-6'>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(true)}
                                    className="text-blue-800 bg-blue-200 p-2 rounded-md hover:bg-blue-300"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChangePasswordMode(true)}
                                    className="text-purple-800 bg-purple-200 p-2 rounded-md hover:bg-purple-300"
                                >
                                    Change Password
                                </button>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="bg-red-200 text-red-800 p-2 rounded hover:bg-red-300"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;