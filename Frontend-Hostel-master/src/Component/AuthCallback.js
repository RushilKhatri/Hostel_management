import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Parse token from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        const name = params.get('name');

        if (token) {
            // Store token in localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('isLogin', 'true');

            console.log('Google OAuth login successful:', { email, name });

            // Redirect to home page
            navigate('/Home');
        } else {
            // If no token, redirect back to login
            alert('OAuth login failed. Please try again.');
            navigate('/');
        }
    }, [location, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{ color: 'white', fontSize: '1.5rem' }}>
                Completing Google Sign-In...
            </div>
        </div>
    );
};

export default AuthCallback;
