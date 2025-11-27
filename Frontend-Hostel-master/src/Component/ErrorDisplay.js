import React from 'react';
import '../css/error.css';

const ErrorDisplay = ({ error, onRetry }) => {
    const getErrorDetails = () => {
        if (!error) return null;

        // Backend not running (network error)
        if (error.code === 'ERR_NETWORK' || (error.message && error.message.includes('Network Error'))) {
            return {
                title: '🔌 Backend Server Not Running',
                message: 'Cannot connect to the backend server.',
                details: [
                    'The backend server at http://localhost:8080 is not responding.',
                    'Please ensure the Spring Boot application is running.',
                    'Run: ./mvnw spring-boot:run in the backend directory'
                ],
                type: 'backend-down'
            };
        }

        // Backend error (500) - likely database issue
        if (error.response && error.response.status === 500) {
            return {
                title: '🗄️ Database Connection Error',
                message: 'The server encountered an internal error.',
                details: [
                    'This is usually caused by MySQL not running or incorrect configuration.',
                    'Please ensure MySQL is running on localhost:3306.',
                    'Check database credentials in application.properties',
                    'Verify the database "HostelManagement" exists.'
                ],
                type: 'database-error'
            };
        }

        // Authentication error (401)
        if (error.response && error.response.status === 401) {
            return {
                title: '🔐 Authentication Failed',
                message: 'Invalid email or password.',
                details: [
                    'Please check your credentials and try again.',
                    'Make sure you are logging in as the correct user type (Admin/Student).'
                ],
                type: 'auth-error'
            };
        }

        // Generic error
        return {
            title: '⚠️ Something Went Wrong',
            message: 'An unexpected error occurred.',
            details: [
                error.message || 'Unknown error',
                'Please try again or contact support if the problem persists.'
            ],
            type: 'generic-error'
        };
    };

    const errorDetails = getErrorDetails();

    if (!errorDetails) return null;

    return (
        <div className={`error-overlay ${errorDetails.type}`}>
            <div className="error-container">
                <div className="error-icon">
                    {errorDetails.type === 'backend-down' && '🔌'}
                    {errorDetails.type === 'database-error' && '🗄️'}
                    {errorDetails.type === 'auth-error' && '🔐'}
                    {errorDetails.type === 'generic-error' && '⚠️'}
                </div>
                <h2 className="error-title">{errorDetails.title}</h2>
                <p className="error-message">{errorDetails.message}</p>

                <div className="error-details">
                    <h4>Details:</h4>
                    <ul>
                        {errorDetails.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                        ))}
                    </ul>
                </div>

                {error.response && (
                    <div className="error-technical">
                        <details>
                            <summary>Technical Details</summary>
                            <pre>
                                Status: {error.response.status}
                                {'\n'}URL: {error.config?.url}
                                {'\n'}Method: {error.config?.method?.toUpperCase()}
                            </pre>
                        </details>
                    </div>
                )}

                <div className="error-actions">
                    {onRetry && (
                        <button className="btn-retry" onClick={onRetry}>
                            Try Again
                        </button>
                    )}
                    <button className="btn-home" onClick={() => window.location.reload()}>
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
