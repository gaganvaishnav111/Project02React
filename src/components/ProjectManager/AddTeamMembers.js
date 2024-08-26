import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '../styles/AddTeamMembers.css';

const AddTeamMembers = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [teamMembers, setTeamMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedTeamMember, setSelectedTeamMember] = useState('');
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch('https://revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/users/team-members');
                const data = await response.json();
                setTeamMembers(data);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await fetch(`https://revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/projects/by-username?username=${username}`);
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchTeamMembers();
        fetchProjects();
    }, [username]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const selectedMember = teamMembers.find(member => member.userid === parseInt(selectedTeamMember));
        const selectedProjectObj = projects.find(project => project.projectId === parseInt(selectedProject));

        if (selectedMember && selectedProjectObj) {
            try {
                const response = await fetch(`https://revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/projects/${selectedProject}/add-team-member/${selectedTeamMember}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.includes('application/json')) {
                        toast.success(`Team Member ${selectedMember.username} has been added to ${selectedProjectObj.projectName}!`, {
                            autoClose: 3000,
                        });
                    } else {
                        toast.success('Team Member added to project successfully!', {
                            autoClose: 3000,
                        });
                    }
                    setSelectedTeamMember('');
                    setSelectedProject('');
                } else {
                    toast.error('Failed to add team member to project. Please try again.', {
                        autoClose: 5000,
                    });
                }
            } catch (error) {
                toast.error('An error occurred while adding team member to project. Please try again.', {
                    autoClose: 5000,
                });
            }
        } else {
            toast.error('Please select both a team member and a project.', {
                autoClose: 5000,
            });
        }
    };

    return (
        <div className="atm-container">
            <h1 className="atm-title">Add Team Members to Project</h1>
            <form id="addTeamMemberForm" className="atm-form" onSubmit={handleSubmit}>
                <div className="atm-form-group">
                    <label className="atm-label" htmlFor="project">Select Project</label>
                    <select
                        id="project"
                        name="project"
                        className="atm-select"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        required
                    >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                            <option key={project.projectId} value={project.projectId}>
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="atm-form-group">
                    <label className="atm-label" htmlFor="teamMember">Select Team Member</label>
                    <select
                        id="teamMember"
                        name="teamMember"
                        className="atm-select"
                        value={selectedTeamMember}
                        onChange={(e) => setSelectedTeamMember(e.target.value)}
                        required
                    >
                        <option value="">Select a team member</option>
                        {teamMembers.map(member => (
                            <option key={member.userid} value={member.userid}>
                                {member.username}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="atm-submit-button">Add Team Member</button>
            </form>
        </div>
    );
};

export default AddTeamMembers;
