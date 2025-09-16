import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './App.css'
import useAuthStore from './services/stores/authStore';
import HeroPage from './pages/home';
import Views from './pages/views';
import ResetPassword from './pages/resetPassword';
import ForgotPassword from './pages/forgotPassword';

function App() {
    const { auth, token, validateToken, setTokenAndValidate, message, isSuccess, reset } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth?._id && token) {
            validateToken();
        }
    }, [auth?._id, token]);

    const heroPaths = [
        '/',
        '/about-us',
        '/forgot-password',
        '/reset-password' 
    ];

    const isHeroPath = heroPaths.some(path => 
        location.pathname === path || 
        (path === '/reset-password' && location.pathname.startsWith('/reset-password/'))
    );

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            setTokenAndValidate(token);
        } else if (error) {
            toast.error('OAuth login failed. Please try again.');
        }
    }, [location, navigate, setTokenAndValidate]);

    useEffect(() => {
        if (isSuccess && message.includes('OAuth')) {
            toast.success(message);
            reset();
            navigate('/dashboard');
        }
    }, [isSuccess, message, navigate, reset]);

    return (
        <>
            <Routes>
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={isHeroPath ? <HeroPage /> : <Views />} />
            </Routes>
        </>
    )
}

export default App
