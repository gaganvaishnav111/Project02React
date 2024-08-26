import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/AssignTask.css'; // Import the CSS file

const AssignTask = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = location.state || {};

    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [formData, setFormData] = useState({
        project: '',
        teamMember: '',
        taskName: '',
        taskDescription: '',
        milestoneId: '',
        startDate: '',
        dueDate: ''
    });

    useEffect(() => {
        // Fetch projects assigned to the current user
        axios.get(`http://localhost:8080/api/projects/by-username?username=${username}`)
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the projects!', error);
            });

        // Fetch all milestones
        axios.get('http://localhost:8080/api/milestones')
            .then(response => {
                setMilestones(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the milestones!', error);
            });
    }, [username]);

    const handleProjectChange = (e) => {
        const projectId = e.target.value;
        setSelectedProject(projectId);
        setFormData({ ...formData, project: projectId });

        // Fetch team members based on selected project
        axios.get(`http://localhost:8080/api/projects/getTeamMembersByProjectId?projectId=${projectId}`)
            .then(response => {
                console.log('Fetched team members:', response.data); // Debugging log
                setTeamMembers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the team members!', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create the data object in the required format
        const dataToSubmit = {
            taskName: formData.taskName,
            taskDetails: formData.taskDescription,
            startDate: formData.startDate,
            dueDate: formData.dueDate,
            project: {
                projectId: parseInt(formData.project) // Assuming project ID is stored in formData.project
            },
            assignedTo: {
                userid: parseInt(formData.teamMember) // Assuming user ID is stored in formData.teamMember
            },
            milestone: {
                milestoneId: parseInt(formData.milestoneId) // Assuming milestone ID is stored in formData.milestoneId
            }
        };

        console.log(dataToSubmit);

        axios.post('http://localhost:8080/api/tasks/create', dataToSubmit)
            .then(response => {
                console.log('Response:', response.data);
                console.log('Submitted Data:', dataToSubmit);
                alert('Task assigned successfully!');

                // Reset the form fields
                setFormData({
                    project: '',
                    teamMember: '',
                    taskName: '',
                    taskDescription: '',
                    milestoneId: '',
                    startDate: '',
                    dueDate: ''
                });

                // Optionally reset other states
                setSelectedProject('');
                setTeamMembers([]);
            })
            .catch(error => {
                console.error('There was an error assigning the task!', error);
            });
    };

    return (
        <div className="assign-task-container">
            <div id="assign-task-content" className="assign-task-content">
                <h1 id="assign-task-title" className="assign-task-title">Assign Task to Team Member</h1>
                <form id="assign-task-form" className="assign-task-form" onSubmit={handleSubmit}>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <td><label htmlFor="project" id="project-label" className="form-label">Select Project</label></td>
                                <td>
                                    <select
                                        id="project"
                                        name="project"
                                        className="form-select"
                                        value={formData.project}
                                        onChange={handleProjectChange}
                                        required
                                    >
                                        <option value="">Select a project</option>
                                        {projects.map(project => (
                                            <option key={project.projectId} value={project.projectId}>
                                                {project.projectName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="teamMember" id="team-member-label" className="form-label">Select Team Member</label></td>
                                <td>
                                    <select
                                        id="teamMember"
                                        name="teamMember"
                                        className="form-select"
                                        value={formData.teamMember}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a team member</option>
                                        {teamMembers.length === 0 ? (
                                            <option value="">No team members available</option>
                                        ) : (
                                            teamMembers.map(member => (
                                                <option key={member.userid} value={member.userid}>
                                                    {member.username}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="taskName" id="task-name-label" className="form-label">Task Name</label></td>
                                <td>
                                    <input
                                        type="text"
                                        id="taskName"
                                        name="taskName"
                                        className="form-input"
                                        value={formData.taskName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="taskDescription" id="task-description-label" className="form-label">Task Description</label></td>
                                <td>
                                    <textarea
                                        id="taskDescription"
                                        name="taskDescription"
                                        className="form-textarea"
                                        value={formData.taskDescription}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="milestoneId" id="milestone-label" className="form-label">Select Milestone</label></td>
                                <td>
                                    <select
                                        id="milestoneId"
                                        name="milestoneId"
                                        className="form-select"
                                        value={formData.milestoneId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a milestone</option>
                                        {milestones.map(milestone => (
                                            <option key={milestone.milestoneId} value={milestone.milestoneId}>
                                                {milestone.milestoneName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="startDate" id="start-date-label" className="form-label">Start Date</label></td>
                                <td>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        className="form-input form-date-input"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="dueDate" id="due-date-label" className="form-label">Due Date</label></td>
                                <td>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        className="form-input form-date-input"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <button type="submit" id="assign-task-button" className="assign-task-button">Assign Task</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    );
};

export default AssignTask;
