import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
//import '../styles/MessagePopup.css';


const MessagePopup = ({ onClose, projectManagerName, projectManagerId, senderId }) => {
    const [subject, setSubject] = useState('Task Milestone Updated');
    const [context, setContext] = useState('The task has been moved to a new milestone.');

    const handleSubmit = async () => {
        const messageData = {
            sender: { userid: senderId },
            receiver: { userid: projectManagerId },
            subject: subject,
            context: context
        };

        try {
            const response = await fetch('http://localhost:8080/api/messages/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });
            if (response.ok) {
                console.log('Message sent successfully');
                toast.success('Message Sent successfully!', {
                    autoClose: 3000,
                });
            } else {
                console.error('Error sending message');
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
        onClose();
    };

    return (
        <div className="message-popup-overlay" onClick={onClose}>
            <div className="message-popup" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2 className="Post-a-Message">Post a Message</h2>
                <div className="message-field">
                    <label htmlFor="to">To:</label>
                    <input
                        type="text"
                        id="to"
                        value={projectManagerName}
                        disabled
                    />
                </div>
                <div className="message-field">
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                <div className="message-field">
                    <label htmlFor="context">Context:</label>
                    <textarea
                        id="context"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                    />
                </div>
                <div className="message-buttons">
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default MessagePopup;