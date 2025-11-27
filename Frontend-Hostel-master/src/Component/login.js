import React, { useState } from "react";
import "../css/login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ErrorDisplay from "./ErrorDisplay";

const EstateLogin = () => {
    const [formData, setFormData] = useState({
        who: "admin",
        email: "",
        password: "",
    });

    const [loginType, setLoginType] = useState("admin");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null); // Clear previous errors

        try {
            const response = await axios.post("http://localhost:8080/login", formData);
            console.log("Response:", response.data);
            const token = response.data.token;

            localStorage.setItem("authToken", token);
            localStorage.setItem("isLogin", "true");
            window.location.href = `/Home`;

        } catch (error) {
            console.error("Error logging in:", error);
            setError(error); // Set error to display ErrorDisplay component
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null); // Clear error and allow retry
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Check if backend is reachable
            await axios.get("http://localhost:8080/test-connection");

            // If successful, redirect to backend OAuth2 endpoint
            window.location.href = "http://localhost:8080/oauth2/authorization/google";
        } catch (error) {
            // If backend returns 401/403, it means it's running but protected.
            // We consider this "Backend Up" and proceed.
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                window.location.href = "http://localhost:8080/oauth2/authorization/google";
                return;
            }

            console.error("Google Login Error:", error);
            setError(error);
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Show error overlay if error exists */}
            {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

            <div className="login-wrap">
                <h3 className="logintitle">Radiison Hostel Management</h3>



                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="group">
                        <label htmlFor="email" className="label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            className="input"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    {isLoading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <div className="group">
                            <input type="submit" className="button" value="Sign In" />
                        </div>
                    )}
                </form>

                <div className="group" style={{ marginTop: '20px' }}>
                    <button
                        onClick={handleGoogleLogin}
                        className="button"
                        style={{
                            background: 'white',
                            color: '#333',
                            border: '1px solid #ddd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" fillRule="evenodd">
                                <path d="M17.6 9.2l-.1-1.8H9v3.4h4.8C13.6 12 13 13 12 13.6v2.2h3a8.8 8.8 0 0 0 2.6-6.6z" fill="#4285F4" fillRule="nonzero" />
                                <path d="M9 18c2.4 0 4.5-.8 6-2.2l-3-2.2a5.4 5.4 0 0 1-8-2.9H1V13a9 9 0 0 0 8 5z" fill="#34A853" fillRule="nonzero" />
                                <path d="M4 10.7a5.4 5.4 0 0 1 0-3.4V5H1a9 9 0 0 0 0 8l3-2.3z" fill="#FBBC05" fillRule="nonzero" />
                                <path d="M9 3.6c1.3 0 2.5.4 3.4 1.3L15 2.3A9 9 0 0 0 1 5l3 2.4a5.4 5.4 0 0 1 5-3.7z" fill="#EA4335" fillRule="nonzero" />
                            </g>
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </>
    );
};

export default EstateLogin;
