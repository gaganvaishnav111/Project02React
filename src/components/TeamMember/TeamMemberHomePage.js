import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/TeamMemberHomePage.css'; // Import the CSS file

const TeamMemberHomePage = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [userDetails, setUserDetails] = useState(null);
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState('team member functionalities');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/by-username?username=${username}`);
                const data = await response.json();
                console.log('Team Member Details:', data);
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
            console.log(`${type} data:`, data);
            setData(data);
            setDataType(type);
            setCurrentPage(1);

            if (type === 'projects') {
                setFilteredProjects(data);
            } else if (type === 'clients') {
                setFilteredClients(data);
            } else if (type === 'tasks') {
                setFilteredTasks(data);
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (dataType === 'projects') {
            setFilteredProjects(
                data.filter(project =>
                    project.projectName.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'clients') {
            setFilteredClients(
                data.filter(client =>
                    client.client.clientName.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'tasks') {
            setFilteredTasks(
                data.filter(task =>
                    task.taskName.toLowerCase().includes(query)
                )
            );
        }
        setCurrentPage(1); // Reset to the first page
    };

    const renderData = () => {
        if (dataType === 'team member functionalities') {
            return (
                <div className="pm-actions-text">
                    <p>Project Manager Functionalities: </p>
                    <p>•    I should be able to log in securely to access the project management platform.</p>
                    <p>•	I should have visibility into project details, including assigned tasks, and relevant client information.</p>
                    <p>•	I should be able to update the status of assigned tasks, providing regular progress updates to the project manager and team.</p>
                </div>
            );
        }

        if (!data) return null;

        const getCurrentData = () => {
            if (dataType === 'projects') {
                return filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'clients') {
                return filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'tasks') {
                return filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            }
        };

        const totalPages = Math.ceil((dataType === 'projects' ? filteredProjects.length : dataType === 'clients' ? filteredClients.length : filteredTasks.length) / itemsPerPage);

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
                    placeholder={`Search by ${dataType === 'projects' ? 'project name' : dataType === 'clients' ? 'client name' : 'task name'}`}
                    value={searchQuery}
                    onChange={handleSearch}
                    className="tm-search-box"
                />
                <table>
                    <thead>
                        <tr>
                            {dataType === 'projects' && (
                                <>
                                    <th>Project Name</th>
                                    <th>Project Description</th>
                                    <th>Project Manager Name</th>
                                </>
                            )}
                            {dataType === 'clients' && (
                                <>
                                    <th>Client Name</th>
                                    <th>Client Email</th>
                                    <th>Description</th>
                                </>
                            )}
                            {dataType === 'tasks' && (
                                <>
                                    <th>Task Name</th>
                                    <th>Project Name</th>
                                    <th>Task Details</th>
                                    <th>Due Date</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentData().length > 0 ? (
                            getCurrentData().map(item => (
                                <tr key={item.projectId || item.client || item.taskId}>
                                    {dataType === 'projects' && (
                                        <>
                                            <td>{item.projectName}</td>
                                            <td>{item.projectDetails}</td>
                                            <td>{item.projectManager.username}</td>
                                        </>
                                    )}
                                    {dataType === 'clients' && (
                                        <>
                                            <td>{item.client.clientName}</td>
                                            <td>{item.client.clientEmail}</td>
                                            <td>{item.client.clientDescription}</td>
                                        </>
                                    )}
                                    {dataType === 'tasks' && (
                                        <>
                                            <td>{item.taskName}</td>
                                            <td>{item.project.projectName}</td>
                                            <td>{item.taskDetails}</td>
                                            <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={dataType === 'tasks' ? 4 : dataType === 'projects' ? 3 : 3}>No {dataType} found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {renderPagination()}
            </>
        );
    };

    return (
        <div className="tm-home-container">
            <h2 className="tm-main-heading">Welcome To Team Member Dashboard</h2>
            {userDetails ? (
                <p className="tm-welcome-message">Hello! {userDetails.username}</p>
            ) : (
                <p className="tm-welcome-message">Loading user details...</p>
            )}
            <div className="tm-actions-container">
                <button className="tm-action-button" onClick={() => setDataType('team member functionalities')}>Team Member Functionalities</button>
                <button className="tm-action-button" onClick={() => fetchData(`http://localhost:8080/api/projects/user/${username}`, 'projects')}>My Projects</button>
                <button className="tm-action-button" onClick={() => fetchData(`http://localhost:8080/api/projects/user/${username}`, 'clients')}>My Clients</button>
                <button className="tm-action-button" onClick={() => fetchData(`http://localhost:8080/api/tasks/by-username/${username}`, 'tasks')}>My Tasks</button>
            </div>
            <div className="tm-data-container">
                <h3><u>{`Displaying ${dataType}`}</u></h3>
                {renderData()}
            </div>
        </div>
    );
};

export default TeamMemberHomePage;