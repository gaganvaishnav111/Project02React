import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '../styles/Message.css';

const Message = () => {
    const location = useLocation();
    const { username } = location.state || {};

    const [formData, setFormData] = useState({
        senderId: '',
        sender: '',
        projectManagerUserId: null,
        projectManagerName: null,
        subject: '',
        messageContent: '',
        receiver: '',
    });

    const [projectManagers, setProjectManagers] = useState([]);

    const fetchTeamMemberData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/by-username?username=${username}`);
            const data = await response.json();
            setFormData(prevState => ({
                ...prevState,
                senderId: data.userid,
                sender: data.username
            }));
        } catch (error) {
            console.error('Error fetching team member data:', error);
        }
    };

    const fetchProjectManagerDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/project-managers/team-member/${username}`);
            const data = await response.json();
            setProjectManagers(data);
            if (data.length > 0) {
                setFormData(prevState => ({
                    ...prevState,
                    projectManagerUserId: data[0].userid,
                    receiver: data[0].username
                }));
            }
        } catch (error) {
            console.error('Error fetching project manager details:', error);
        }
    };

    useEffect(() => {
        if (username && username !== 'Unknown User') {
            fetchTeamMemberData();
            fetchProjectManagerDetails();
        } else {
            console.warn('Username not provided or invalid.');
        }
    }, [username]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleProjectManagerChange = (e) => {
        const selectedManager = projectManagers.find(pm => pm.userid === parseInt(e.target.value));
        setFormData(prevState => ({
            ...prevState,
            projectManagerUserId: selectedManager.userid,
            receiver: selectedManager.username
        }));
    };

    const handleMessageSubmit = async () => {
        const { sender, receiver, subject, messageContent, senderId, projectManagerUserId } = formData;

        if (!sender || !receiver || !subject || !messageContent) {
            toast.error('Please fill in all fields', {
                autoClose: 5000,
            });
            return;
        }

        const newMessage = {
            sender: { userid: senderId },
            receiver: { userid: projectManagerUserId },
            subject: subject,
            context: messageContent,
            date: new Date().toISOString(), // Ensure the date is included
        };

        try {
            const response = await fetch('http://localhost:8080/api/messages/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            });

            if (response.ok) {
                toast.success('Message Sent successfully!', {
                    autoClose: 3000,
                });
                setFormData(prevState => ({
                    ...prevState,
                    subject: '',
                    messageContent: ''
                }));
            } else {
                toast.error('Failed to send message. Please try again.', {
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.', {
                autoClose: 5000,
            });
        }
    };

    const { sender, receiver, subject, messageContent } = formData;

    return (
        <div className="message-container" id="messageContainer">
            <h1 className="message-title">Send a Message</h1>

            <div className="message-form" id="messageForm">
                <div className="form-group" id="senderGroup">
                    <label htmlFor="sender">Sender:</label>
                    <input
                        type="text"
                        id="sender"
                        value={sender}
                        disabled
                        className="form-input"
                    />
                </div>
                <div className="form-group" id="receiverGroup">
                    <label htmlFor="receiver">Receiver:</label>
                    <select
                        id="receiver"
                        value={formData.projectManagerUserId || ''}
                        onChange={handleProjectManagerChange}
                        className="form-input"
                    >
                        {projectManagers.map(manager => (
                            <option key={manager.userid} value={manager.userid}>
                                {manager.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group" id="subjectGroup">
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group" id="messageContentGroup">
                    <label htmlFor="messageContent">Message:</label>
                    <textarea
                        id="messageContent"
                        value={messageContent}
                        onChange={handleInputChange}
                        className="form-textarea"
                    />
                </div>
                <button id="submitMessageButton" onClick={handleMessageSubmit} className="submit-button">Send</button>
            </div>
        </div>
    );
};

export default Message;
