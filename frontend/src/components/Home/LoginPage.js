import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import login from '../media/login.jpg';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const user = await response.json();

                if (user.status === 'ACTIVE') {
                    console.log('Logged in user:', user);

                    switch (user.role) {
                        case 'ADMIN':
                            navigate('/admin/home', { state: { username: user.username, userId: user.id } });
                            break;
                        case 'PROJECT_MANAGER':
                            navigate('/project-manager/home', { state: { username: user.username } });
                            break;
                        case 'TEAM_MEMBER':
                            navigate('/team-member/home', { state: { username: user.username, userId: user.id } });
                            break;
                        default:
                            alert('Role not recognized.');
                            break;
                    }
                } else {
                    alert('Your account is inactive. Please contact support.');
                    setEmail('');
                    setPassword('');
                }
            } else {
                const errorMessage = await response.text();
                alert(errorMessage || 'Invalid email or password.');
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in. Please try again later.');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div className="login-container">
            <button 
                className="atm-back-button" 
                onClick={() => navigate('/')}
            >
                ← Go Back
            </button>
            <div className="login-box">
                <div className="support-image-container">
                    <img src={login} alt="login" className="login-image" />
                </div>
                <div className="login-content">
                    <div id="welcomeMessage">
                        <h1 className='login-head'>Login Page</h1>
                    </div>
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="login-form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="login-button" type="submit">Login</button>
                        <div className='forgot-button-main'>
                            <button className="forgot-password" onClick={() => navigate('/forgot-password')} id="forgotPasswordLink">Forgot Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;