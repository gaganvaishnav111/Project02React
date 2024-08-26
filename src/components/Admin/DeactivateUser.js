import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import '../styles/DeactivateUser.css';

const DeactivateUser = () => {
    const [users, setUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formKey, setFormKey] = useState(0); // Key for forcing re-render
    const [isActivating, setIsActivating] = useState(true); // Toggle between activate and deactivate

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/all');
                const userOptions = response.data
                    .filter(user => user.role === 'PROJECT_MANAGER' || user.role === 'TEAM_MEMBER')
                    .map(user => ({
                        value: user.userid,
                        label: `${user.username} (ID: ${user.userid}, Role: ${user.role})`,
                        status: user.status
                    }));

                setUsers(userOptions);
                setActiveUsers(userOptions.filter(user => user.status === 'ACTIVE'));
                setInactiveUsers(userOptions.filter(user => user.status === 'INACTIVE'));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e, action) => {
        e.preventDefault();
        if (!selectedUser) {
            toast.success('Please select user', {
                autoClose: 3000,
            });
            return;
        }
        try {
            let response;
            if (action === 'deactivate') {
                response = await axios.put(`http://localhost:8080/api/users/deactivate/${selectedUser}`);
                toast.success('User Deactivated successfully!', {
                    autoClose: 8000,
                });
            } else if (action === 'activate') {
                response = await axios.put(`http://localhost:8080/api/users/activate/${selectedUser}`);
                toast.success('User Activated successfully!', {
                    autoClose: 8000,
                });
            }
            console.log(`User ${action}d:, { userid: selectedUser }`);
            console.log('API Response:', response.data);

            // Update user lists after action
            const updatedUsers = users.filter(user => user.value !== selectedUser);
            setUsers(updatedUsers);
            setActiveUsers(updatedUsers.filter(user => user.status === 'ACTIVE'));
            setInactiveUsers(updatedUsers.filter(user => user.status === 'INACTIVE'));
            setSelectedUser(null);
            setFormKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error(`Error ${action}ing user:`, error.response ? error.response.data : error.message);
            alert(`Failed to ${action} user: ${error.response ? error.response.data : error.message}`);
        }
    };

    return (
        <div className="deactivate-user-container">
            <h2 className="deactivate-user-title"><b>Manage User Status</b></h2>
            <div className="deactivate-user-tables">
                {/* Activate Users Table */}
                <div className="activating-user-table">
                    <h3>Activate Users</h3>
                    <Select
                        id="activate-user-select"
                        name="activate-user-select"
                        value={inactiveUsers.find(user => user.value === selectedUser)}
                        onChange={(selectedOption) => setSelectedUser(selectedOption ? selectedOption.value : null)}
                        options={inactiveUsers}
                        placeholder="Search and select an inactive user..."
                        className="deactivate-user-select"
                        isClearable
                        required
                    />
                    <button type="button" className="activate-user-button" onClick={(e) => handleSubmit(e, 'activate')}>
                        Activate User
                    </button>
                </div>

                {/* Deactivate Users Table */}
                <div className="deactivating-user-table">
                    <h3>Deactivate Users</h3>
                    <Select
                        id="deactivate-user-select"
                        name="deactivate-user-select"
                        value={activeUsers.find(user => user.value === selectedUser)}
                        onChange={(selectedOption) => setSelectedUser(selectedOption ? selectedOption.value : null)}
                        options={activeUsers}
                        placeholder="Search and select an active user..."
                        className="deactivate-user-select"
                        isClearable
                        required
                    />
                    <button type="button" className="deactivate-user-button" onClick={(e) => handleSubmit(e, 'deactivate')}>
                        Deactivate User
                    </button>
                </div>
            </div>
            {/* <button type="button" className="toggle-button" onClick={() => setIsActivating(!isActivating)}>
                {isActivating ? 'Switch to Deactivate Users' : 'Switch to Activate Users'}
            </button> */}
        </div>
    );
};

export default DeactivateUser;