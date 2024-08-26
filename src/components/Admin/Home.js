import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [userDetails, setUserDetails] = useState(null);
    const [data, setData] = useState(null);
    const [dataType, setDataType] = useState('admin functionalities');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/by-username?username=${username}`);
                const data = await response.json();
                setUserDetails(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (username) {
            fetchUserDetails();
        }
    }, [username]);

    

    const fetchData = async (apiUrl, type) => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setData(data);
            setDataType(type);
            setCurrentPage(1);

            if (type === 'users') {
                setFilteredUsers(data);
            } else if (type === 'clients') {
                setFilteredClients(data);
            } else if (type === 'projects') {
                setFilteredProjects(data);
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (dataType === 'users') {
            setFilteredUsers(
                data.filter(user =>
                    user.username.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'clients') {
            setFilteredClients(
                data.filter(client =>
                    client.clientName.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'projects') {
            setFilteredProjects(
                data.filter(project =>
                    project.projectName.toLowerCase().includes(query)
                )
            );
        }
        setCurrentPage(1);
    };

    const handleDropdownToggle = () => {
        setShowDropdown(prev => !prev);
    };

    const handleOutsideClick = (event) => {
        if (showDropdown && !event.target.closest('.actions-container')) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [showDropdown]);

    const renderData = () => {
        if (dataType === 'admin functionalities') {
            return (
                <div className="default-text">
                    <p>Admin Functionalities: </p>
                    <p>•    I should be able to create user account.(Project manager, Team member)</p>
                    <p>•	I should be able to update user account.(Project manager, Team member)</p>
                    <p>•	I should be able to deactivate the user account.(Project manager, Team member)</p>
                    <p>•	I should be able to assign and adjust access levels for different roles, ensuring the right permissions are set.</p>
                    <p>•	I have access to reporting tools to track user activity, monitor task completion.</p>
                </div>
            );
        }

        if (!data) return null;

        const currentData = () => {
            if (dataType === 'users') {
                return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'clients') {
                return filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'projects') {
                return filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            }
        };

        const totalPages = Math.ceil((dataType === 'users' ? filteredUsers.length : dataType === 'clients' ? filteredClients.length : filteredProjects.length) / itemsPerPage);

        const renderPagination = () => (
            <div className="pagination-controls">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>{currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        );

        return (
            <>
                <input
                    type="text"
                    placeholder={`Search by ${dataType === 'users' ? 'username' : dataType === 'clients' ? 'client name' : 'project name'}`}
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-box"
                />
                <table>
                    <thead>
                        <tr>
                            {dataType === 'users' && (
                                <>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </>
                            )}
                            {dataType === 'clients' && (
                                <>
                                    <th>Client Name</th>
                                    <th>Client Email</th>
                                    <th>Client Description</th>
                                </>
                            )}
                            {dataType === 'projects' && (
                                <>
                                    <th>Project Name</th>
                                    <th>Project Details</th>
                                    <th>Project Manager</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData().map(item => (
                            <tr key={item.userid || item.clientId || item.projectId}>
                                {dataType === 'users' && (
                                    <>
                                        <td>{item.username}</td>
                                        <td>{item.email}</td>
                                        <td>{item.role}</td>
                                        <td>{item.status}</td>
                                    </>
                                )}
                                {dataType === 'clients' && (
                                    <>
                                        <td>{item.clientName}</td>
                                        <td>{item.clientEmail}</td>
                                        <td>{item.clientDescription}</td>
                                    </>
                                )}
                                {dataType === 'projects' && (
                                    <>
                                        <td>{item.projectName}</td>
                                        <td>{item.projectDetails}</td>
                                        <td>{item.projectManager?.username}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {renderPagination()}
            </>
        );
    };

    return (
        <div className="home-container">
            <h2 className="admin-welcome">Welcome To Admin Dashboard</h2>
            {userDetails ? (
                <p className="welcome-user">Hello! {userDetails.username}</p>
            ) : (
                <p></p>
            )}
            <div className="actions-container">
                <button onClick={() => setDataType('admin functionalities')} className="action-button">Admin Functionalities</button>
                <button onClick={() => {
                    setDataType('users');
                    fetchData('http://localhost:8080/api/users/all', 'users');
                    handleDropdownToggle();
                }} className="action-button">Users</button>
                <button onClick={() => fetchData('http://localhost:8080/api/clients/all', 'clients')} className="action-button">Clients</button>
                <button onClick={() => fetchData('http://localhost:8080/api/projects', 'projects')} className="action-button">Projects</button>
            </div><br></br>
            <div className="data-container">
                <h3><b>{`Displaying ${dataType}`}</b></h3>
                {renderData()}
            </div>
        </div>
    );
};

export default Home;