import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ErrorPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const errorMessage = searchParams.get('message') || 'An unexpected error occurred';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center'
            }}>
                <h1 style={{
                    color: '#dc3545',
                    marginBottom: '20px',
                    fontSize: '24px'
                }}>
                    Error
                </h1>
                <p style={{
                    color: '#6c757d',
                    marginBottom: '30px',
                    fontSize: '16px',
                    lineHeight: '1.5'
                }}>
                    {errorMessage}
                </p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default ErrorPage; 