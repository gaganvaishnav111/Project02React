
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
// import MessagePopup from './MessagePopUp';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '../styles/TaskDashboard.css';

const TaskDashboard = () => {
    const location = useLocation();
    const username = location.state?.username || 'Unknown User';
    const [milestones, setMilestones] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showMessagePopup, setShowMessagePopup] = useState(false);
    const [projectManagerName, setProjectManagerName] = useState('');
    const [projectManagerUserId, setProjectManagerUserId] = useState(null);

    useEffect(() => {
        if (username && username !== 'Unknown User') {
            fetchUserData();
            fetchMilestones();
        }
    }, [username]);

    const fetchUserData = async () => {
        try {
            const userResponse = await fetch(`http://localhost:8080/api/users/by-username?username=${username}`);
            const userData = await userResponse.json();
            setUserId(userData.userid);
            fetchProjects(userData.username);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchProjects = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/user/${username}`);
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchMilestones = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/milestones');
            const data = await response.json();
            setMilestones(data);
        } catch (error) {
            console.error('Error fetching milestones:', error);
        }
    };

    const fetchTasksForProject = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/user/${userId}/project/${projectId}`);
            const data = await response.json();
            console.log('Fetched tasks:', data);
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchProjectManager = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/${projectId}/manager`);
            const managerData = await response.json();
            setProjectManagerName(managerData.username);
            setProjectManagerUserId(managerData.userid);
        } catch (error) {
            console.error('Error fetching project manager details:', error);
        }
    };

    const handleProjectSelect = (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        fetchTasksForProject(projectId);
        fetchProjectManager(projectId);
    };

    const combinedData = milestones.map(milestone => {
        const milestoneTasks = Array.isArray(tasks) ? tasks.filter(task => task.milestone.milestoneId === milestone.milestoneId) : [];
        return {
            ...milestone,
            tasks: milestoneTasks
        };
    });

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        const taskId = parseInt(draggableId, 10);

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceMilestone = combinedData.find(milestone => milestone.milestoneId.toString() === source.droppableId);
        const destinationMilestone = combinedData.find(milestone => milestone.milestoneId.toString() === destination.droppableId);

        if (!sourceMilestone || !destinationMilestone) {
            console.error('Source or destination milestone not found');
            return;
        }

        const draggedTask = tasks.find(task => task.taskId === taskId);
        if (!draggedTask) {
            console.error(`Task with ID ${taskId} not found`);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/tasks/update-milestone?taskId=${taskId}&milestoneId=${destinationMilestone.milestoneId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            await response.json();
            toast.success('Task Updated successfully!', {
                autoClose: 3000,
            });
            setShowMessagePopup(true);
        } catch (error) {
            console.error('Error updating task:', error);
        }

        const updatedTasks = tasks.map(task =>
            task.taskId === taskId
                ? { ...task, milestone: destinationMilestone, lastUpdated: new Date().toISOString() } // Add lastUpdated timestamp
                : task
        );
        setTasks(updatedTasks);
    };

    return (
        <div className="task-dashboard-container">
            <div className="project-selection">
                <select className="team-mem-project-box" onChange={handleProjectSelect} value={selectedProject || ''}>
                    <option  value="" disabled>Select a Project</option>
                    {projects.map(project => (
                        <option key={project.projectId} value={project.projectId}>
                            {project.projectName}
                        </option>
                    ))}
                </select>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="milestones-container">
                    {combinedData.map((milestone) => (
                        <Droppable key={milestone.milestoneId} droppableId={milestone.milestoneId.toString()}>
                            {(provided) => (
                                <div
                                    className="milestone"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <div className="milestone-title">{milestone.milestoneName}</div>
                                    <div className="milestone-description">{milestone.milestoneDescription}</div>
                                    <div className="tasks">
                                        {milestone.tasks.map((task, index) => (
                                            <Draggable key={task.taskId} draggableId={task.taskId.toString()} index={index}>
                                                {(provided) => (
                                                    <div
                                                        className="task-item"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <span className="task-icon">👤</span> {/* Emoji for person */}
                                                        <button className="task-button" onClick={() => setSelectedTask(task)}>
                                                            {task.taskName}
                                                        </button>
                                                        <div className="task-timestamp">
                                                            Last Updated: {task.lastUpdated ? new Date(task.lastUpdated).toLocaleString() : 'No Timestamp'}
                                                        </div> {/* Timestamp */}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {selectedTask && (
                    <div className="task-details-overlay" onClick={() => setSelectedTask(null)}>
                        <div className="task-details" onClick={(e) => e.stopPropagation()}>
                            <button className="close-button" onClick={() => setSelectedTask(null)}>×</button>
                            <h2>Task Details</h2>
                            <div className="task-detail">
                                <strong>Task Name:</strong> {selectedTask.taskName}
                            </div>
                            <div className="task-detail">
                                <strong>Task Details:</strong> {selectedTask.taskDetails}
                            </div>
                            <div className="task-detail">
                                <strong>Project Name:</strong> {selectedTask.project.projectName}
                            </div>
                            <div className="task-detail">
                                <strong>Milestone Name:</strong> {selectedTask.milestone.milestoneName}
                            </div>
                            <div className="task-detail">
                                <strong>Milestone Description:</strong> {selectedTask.milestone.milestoneDescription}
                            </div>
                            <div className="task-detail">
                                <strong>Start Date:</strong> {new Date(selectedTask.startDate).toLocaleDateString()}
                            </div>
                            <div className="task-detail">
                                <strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default TaskDashboard;