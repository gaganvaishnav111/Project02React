import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
            const userResponse = await axios.get('https://revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/users/by-username', {
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

            const resetResponse = await axios.put(`https://revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/users/${user.userid}/password`, null, {
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
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <div>
                    <label>Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {/* Display the message */}
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ResetPassword;