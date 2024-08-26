import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <header className="landing-header">
            <div className="landing-overlay"></div>
            <div className="landing-content">
                <h1 id="landing-title">Welcome to Rev Task Management System</h1><br></br><br></br>
                <p id="landing-description">The primary goal of the RevTaskManagement project is to create a robust and user-friendly task management application. It aims to streamline task management, boost productivity, and serve as a central hub for organizing and tracking both work-related and personal tasks. Additionally, the application will facilitate task delegation by defining milestones to track work progress efficiently. Furthermore, it will incorporate an effort estimation feature to help users plan and manage tasks effectively.</p><br></br>
                <button id="get-started-button" className="landing-button" onClick={() => navigate('/login')}>Get Started → </button>
            </div>
        </header>
    );
};

export default LandingPage;