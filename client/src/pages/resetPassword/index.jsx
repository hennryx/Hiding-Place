import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ENDPOINT } from '../../services/utilities';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [message, setMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        hasNumber: false,
        hasSpecial: false
    });

    useEffect(() => {
        // Validate password strength
        setPasswordStrength({
            length: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [password]);

    const calculateStrengthPercentage = () => {
        const { length, hasNumber, hasSpecial } = passwordStrength;
        const criteriaCount = [length, hasNumber, hasSpecial].filter(Boolean).length;
        return (criteriaCount / 3) * 100;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password || !confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }
        
        try {
            setIsLoading(true);
            console.log(token);
            
            
            const response = await axios.post(`${ENDPOINT}/auth/reset-password/${token}`, { password });
            
            console.log(response);
            
            if(response.data.success) {
                toast.success('Password reset successful');
                setMessage('Your password has been reset successfully. You can now log in with your new password.');
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }else {
                toast.error(response.data.message)
            }
            
        } catch (error) {
            setIsValid(false);
            setMessage(error.response?.data?.message || 'Invalid or expired token. Please try again.');
            toast.error(error.response?.data?.message || 'Password reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Reset Password Failed
                        </h2>
                    </div>
                    
                    <div className="rounded-md p-4 bg-red-50 text-red-800">
                        <p>{message || 'Invalid or expired token. Please request a new password reset.'}</p>
                    </div>
                    
                    <div className="text-center">
                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Request New Reset Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create New Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your new password below
                    </p>
                </div>
                
                {message && (
                    <div className="rounded-md p-4 bg-green-50 text-green-800">
                        <p>{message}</p>
                    </div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        
                        {/* Password strength meter */}
                        {password && (
                            <div className="mb-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${
                                            calculateStrengthPercentage() <= 33 ? 'bg-red-500' : 
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
                        
                        <div className="mb-4">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            {password && confirmPassword && password !== confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[var(--text-color)] ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                    
                    <div className="text-sm text-center">
                        <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;