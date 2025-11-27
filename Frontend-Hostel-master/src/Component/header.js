import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear login data from localStorage
        localStorage.setItem("isLogin", "false");
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-title">
                <i className="fa fa-building" aria-hidden="true"></i>Radiison Hostel Management
            </div>
            <div className="header-logout">
                <button onClick={handleLogout} className="logout-button">
                    <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
