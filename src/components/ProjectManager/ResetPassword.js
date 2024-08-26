import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            const errorMessage = 'New password and confirm password do not match.';
            setMessage(errorMessage);
            toast.error(errorMessage, {
                autoClose: 5000,
            });
            console.log(errorMessage);
            return;
        }

        try {
            const userResponse = await axios.get('http://localhost:8080/api/users/by-username', {
                params: { username }
            });

            const user = userResponse.data;

            if (user.password !== oldPassword) {
                const errorMessage = 'Old password is incorrect.';
                setMessage(errorMessage);
                toast.error(errorMessage, {
                    autoClose: 5000,
                });
                console.log(errorMessage);
                return;
            }

            const resetResponse = await axios.put(`http://localhost:8080/api/users/${user.userid}/password`, null, {
                params: { newPassword }
            });

            const successMessage = 'Password has been successfully reset.';
            setMessage(successMessage);
            toast.success('Password has been successfully reset', {
                autoClose: 3000,
            });
            console.log({
                userid: user.userid,
                newPassword
            });
            console.log('Response Data:', resetResponse.data);

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            const errorMessage = 'An error occurred while resetting the password.';
            setMessage(errorMessage);
            toast.error(errorMessage, {
                autoClose: 5000,
            });
            console.log(errorMessage, error);
        }
    };

    return (
        <div id="reset-container" className="reset-container">
            <h1 id="reset-title">Reset Your Password</h1>
            <form id="reset-password-form" onSubmit={handleResetPassword}>
                <div className="reset-form-group">
                    <label htmlFor="reset-old-password">Old Password</label>
                    <input 
                        type="password" 
                        id="reset-old-password" 
                        className="reset-input" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="reset-form-group">
                    <label htmlFor="reset-new-password">New Password</label>
                    <input 
                        type="password" 
                        id="reset-new-password" 
                        className="reset-input" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="reset-form-group">
                    <label htmlFor="reset-confirm-password">Confirm Password</label>
                    <input 
                        type="password" 
                        id="reset-confirm-password" 
                        className="reset-input" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" id="reset-button" className="reset-button">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;