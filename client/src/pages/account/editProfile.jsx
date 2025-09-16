import React from 'react'
import { toast } from 'react-toastify';
import useAuthStore from '../../services/stores/authStore';

const EditProfile = ({ form, setForm, setEditMode, setIsLoading, isLoading, profileImage }) => {
    const { token, validateToken } = useAuthStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('firstname', form.firstname);
            formData.append('middlename', form.middlename);
            formData.append('lastname', form.lastname);
            formData.append('email', form.email);
            
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }
            
            await axios.put(
                `${ENDPOINT}/users/update-profile`, 
                formData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            toast.success('Profile updated successfully');
            setEditMode(false);
            
            // Refresh user data
            validateToken();
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-4">
                {/* Editable fields */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                        type="text"
                        name="middlename"
                        value={form.middlename}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>

            <div className='flex gap-4 mt-6'>
                <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    disabled={isLoading}
                    className="text-gray-600 bg-gray-100 p-2 rounded-md hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-green-200 text-green-800 p-2 rounded hover:bg-green-300"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>

            </div>
        </>
    )
}

export default EditProfile