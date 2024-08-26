import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '../styles/ForgotPassword.css';
import forgot from '../media/Register.jpg'

const ForgetPassword = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate(); // Use the useNavigate hook for navigation

    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/users/send_otp', { name, email });
            if (response.data.success) {
                setOtpSent(true);
                setMessage('OTP has been sent to your email.');
                toast.success('OTP Sent successfully!', {
                    autoClose: 3000,
                });
            } else {
                setMessage('Failed to send OTP. Please check your email and try again.');
                toast.error('Failed to send OTP', {
                    autoClose: 5000,
                });
            }
        } catch (error) {
            setMessage('An error occurred while sending OTP.');
            toast.error('Error Sending OTP. ', {
                autoClose: 5000,
            });
            console.error('Error sending OTP:', error);
        }
    };

    const handleForgetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            const errorMessage = 'New password and confirm password do not match.';
            setMessage(errorMessage);
            toast.error(errorMessage, {
                autoClose: 5000,
            });
            console.error(errorMessage);
            return;
        }

        try {
            const otpResponse = await axios.post('http://localhost:8080/api/users/validate_otp', {
                name,
                email,
                otp,
                newPassword
            });

            if (!otpResponse.data.success) {
                const errorMessage = 'Invalid OTP. Please try again.';
                setMessage(errorMessage);
                toast.error(errorMessage, {
                    autoClose: 5000,
                });
                console.error(errorMessage);
                return;
            }

            const successMessage = 'Password has been successfully reset.';
            setMessage(successMessage);
            toast.success('Password has been successfully reset!', {
                autoClose: 3000,
            });
            console.log('Password reset successfully');

            setName('');
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');

            // Redirect to login page after successful password reset
            navigate('/login'); // Change '/login' to your desired route

        } catch (error) {
            const errorMessage = 'Invalid OTP, Try Again';
            setMessage(errorMessage);
            toast.error(errorMessage, {
                autoClose: 5000,
            });
            console.error(errorMessage, error);
        }
    };

    return (
        <div className="forgot-password-container">
            <button 
                className="go-back-button" 
                onClick={() => navigate('/')}
            >
                ← Go Back
            </button>
            <div className="forgot-password-box">
                <div className="forgot-password-image-container">
                    <img src={forgot} alt="Forgot Password" className="forgot-password-image" />
                </div>
                <div className="forgot-password-content">
                    <h1 className="forgot-password-header">Forgot Password</h1>
                    <form className="forgot-password-form" onSubmit={otpSent ? handleForgetPassword : handleSendOtp}>
                        <div className="forgot-password-form-group">
                            <label htmlFor="forget-name">Name:</label>
                            <input 
                                type="text" 
                                id="forget-name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="forgot-password-form-group">
                            <label htmlFor="forget-email">Email:</label>
                            <input 
                                type="email" 
                                id="forget-email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        {otpSent && (
                            <>
                                <div className="forgot-password-form-group">
                                    <label htmlFor="forget-otp">OTP:</label>
                                    <input 
                                        type="text" 
                                        id="forget-otp" 
                                        value={otp} 
                                        onChange={(e) => setOtp(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="forgot-password-form-group">
                                    <label htmlFor="forget-new-password">New Password:</label>
                                    <input 
                                        type="password" 
                                        id="forget-new-password" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="forgot-password-form-group">
                                    <label htmlFor="forget-confirm-password">Confirm Password:</label>
                                    <input 
                                        type="password" 
                                        id="forget-confirm-password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </>
                        )}
                        <button type="submit" className="forgot-password-submit-button">
                            {otpSent ? 'Reset Password' : 'Send OTP'}
                        </button>
                        {message && <p className="forgot-password-message">{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;