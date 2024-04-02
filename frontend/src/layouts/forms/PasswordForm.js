import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/passwordForm.css'; // Import CSS file for styling

function PasswordForm() {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validate fields
        if (!email || !oldPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        // Validate passwords
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Make API request to change password
            const response = await axios.post('http://127.0.0.1:8000/change-password/', {
                email: email,
                old_password: oldPassword,
                new_password: newPassword,
            });

            toast.success('Password changed successfully', {
                position: toast.POSITION.TOP_CENTER
            });
            setError(null);
            navigate('/'); // Redirect to '/' on successful password change
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'An error occurred');
            }
        }
    };

    return (
        <div className="centered-container">
            <div className="password-form-container">
                <h2 className="password-form-heading">Change Password</h2>
                {error && <div className="error-message">{error}</div>}
                <form className="password-form" onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label className='form-label' htmlFor="email">Email:</label>
                        <input
                            className="form-input"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className='form-label' htmlFor="oldPassword">Old Password:</label>
                        <input
                            className="form-input"
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className='form-label' htmlFor="newPassword">New Password:</label>
                        <input
                            className="form-input"
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className='form-label' htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            className="form-input"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="submit-button" type="submit">Change Password</button>
                </form>
            </div>
            <ToastContainer /> {/* Toast container for notifications */}
        </div>
    );
}

export default PasswordForm;
