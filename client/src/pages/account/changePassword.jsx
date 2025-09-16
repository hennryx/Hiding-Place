import React, { useEffect, useState } from 'react'
import { BsEye, BsEyeSlash } from "react-icons/bs";
import useAuthStore from '../../services/stores/authStore';
import { toast } from 'react-toastify';

const ChangePassword = ({ setIsLoading, isLoading, setChangePasswordMode }) => {
    const { token } = useAuthStore();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [viewPass, setViewPass] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        hasNumber: false,
        hasSpecial: false
    });

    useEffect(() => {
        // Validate password strength
        setPasswordStrength({
            length: passwordForm.newPassword.length >= 8,
            hasNumber: /\d/.test(passwordForm.newPassword),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword)
        });
    }, [passwordForm.newPassword]);

    const calculateStrengthPercentage = () => {
        const { length, hasNumber, hasSpecial } = passwordStrength;
        const criteriaCount = [length, hasNumber, hasSpecial].filter(Boolean).length;
        return (criteriaCount / 3) * 100;
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };


    const handleChangePassword = async () => {
        // Validate passwords
        if (!passwordForm.currentPassword) {
            toast.error('Please enter your current password');
            return;
        }

        if (!passwordForm.newPassword) {
            toast.error('Please enter a new password');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await axios.put(
                `${ENDPOINT}/users/update-password`,
                {
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success('Password changed successfully');
            setChangePasswordMode(false);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                        <input
                            type={viewPass.current ? "text" : "password"}
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            onClick={() => setViewPass(prev => ({ ...prev, current: !prev.current }))}
                        >
                            {viewPass.current ? <BsEye /> : <BsEyeSlash />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <input
                            type={viewPass.new ? "text" : "password"}
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            onClick={() => setViewPass(prev => ({ ...prev, new: !prev.new }))}
                        >
                            {viewPass.new ? <BsEye /> : <BsEyeSlash />}
                        </button>
                    </div>

                    {/* Password strength meter */}
                    {passwordForm.newPassword && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${calculateStrengthPercentage() <= 33 ? 'bg-red-500' :
                                        calculateStrengthPercentage() <= 66 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                        }`}
                                    style={{ width: `${calculateStrengthPercentage()}%` }}
                                ></div>
                            </div>

                            <ul className="mt-2 text-xs text-gray-600 space-y-1">
                                <li className={passwordStrength.length ? 'text-green-600' : ''}>
                                    {passwordStrength.length ? '✓' : '•'} At least 8 characters
                                </li>
                                <li className={passwordStrength.hasNumber ? 'text-green-600' : ''}>
                                    {passwordStrength.hasNumber ? '✓' : '•'} At least 1 number
                                </li>
                                <li className={passwordStrength.hasSpecial ? 'text-green-600' : ''}>
                                    {passwordStrength.hasSpecial ? '✓' : '•'} At least 1 special character
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type={viewPass.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            onClick={() => setViewPass(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                            {viewPass.confirm ? <BsEye /> : <BsEyeSlash />}
                        </button>
                    </div>
                    {passwordForm.newPassword && passwordForm.confirmPassword &&
                        passwordForm.newPassword !== passwordForm.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                        )}
                </div>
            </div>

            <div className='flex gap-4 mt-6'>
                <button
                    type="button"
                    onClick={() => setChangePasswordMode(false)}
                    disabled={isLoading}
                    className="text-gray-600 bg-gray-100 p-2 rounded-md hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="bg-green-200 text-green-800 p-2 rounded hover:bg-green-300"
                >
                    {isLoading ? 'Saving...' : 'Update Password'}
                </button>
            </div>
        </>
    )
}

export default ChangePassword