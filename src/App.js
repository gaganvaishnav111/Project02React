import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/Home/LandingPage';
import LoginPage from './components/Home/LoginPage';
import ForgetPassword from './components/Home/ForgotPassword';
import NotFoundPage from './components/Home/NotFoundPage';
import ProjectManager from './components/ProjectManager/ProjectManager';
import ProjectManagerHomePage from './components/ProjectManager/ProjectManagerHomePage';
import AddTeamMembers from './components/ProjectManager/AddTeamMembers';
import ResetPasswordProjectManager from './components/ProjectManager/ResetPassword';
import AssignTask from './components/ProjectManager/AssignTask';
import TrackUserActivityPage from './components/ProjectManager/TrackUserActivityPage';
import AdminPage from './components/Admin/AdminPage';
import Home from './components/Admin/Home';
import CreateUser from './components/Admin/CreateUser';
import UpdateUser from './components/Admin/UpdateUser';
import DeactivateUser from './components/Admin/DeactivateUser';
import CreateClient from './components/Admin/CreateClient';
import CreateProject from './components/Admin/CreateProject';
import ResetPasswordAdmin from './components/Admin/ResetPasswordAdmin';
import AssignAccessLevels from './components/Admin/AssignAccessLevels';
import TrackUserActivityAdmin from './components/Admin/TrackUserActivityAdmin';
import MessageProjectManager from './components/ProjectManager/MessageProjectManager';
import TeamMember from './components/TeamMember/TeamMember'; 
import Message from './components/TeamMember/Message';
import ResetPasswordTeamMember from './components/TeamMember/ResetPasswordTeamMember';
import TeamMemberHomePage from './components/TeamMember/TeamMemberHomePage';
import TaskDashboard from './components/TeamMember/TaskDashboard';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/project-manager" element={<ProjectManager />}>
          <Route path="/project-manager/home" element={<ProjectManagerHomePage />} />
          <Route path="/project-manager/reset-password" element={<ResetPasswordProjectManager />} />
          <Route path="add-team-members" element={<AddTeamMembers />} />
          <Route path="assign-task" element={<AssignTask />} />
          <Route path="track-user-activity" element={<TrackUserActivityPage />} />
          <Route path="message-project-manager" element={<MessageProjectManager />} />
        </Route>
        <Route path="/admin" element={<AdminPage />}>
          <Route path="home" element={<Home />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="update-user" element={<UpdateUser />} />
          <Route path="deactivate-user" element={<DeactivateUser />} />
          <Route path="create-client" element={<CreateClient />} />
          <Route path="create-project" element={<CreateProject />} />
          <Route path="assign-access-levels" element={<AssignAccessLevels />} />
          <Route path="track-user-activity" element={<TrackUserActivityAdmin />} />
          <Route path="reset-password-admin" element={<ResetPasswordAdmin />} />
        </Route>
        <Route path="/team-member" element={<TeamMember />}>
          <Route path="/team-member/home" element={<TeamMemberHomePage />} />
          <Route path="task-dashboard" element={<TaskDashboard />} />
          <Route path="message" element={<Message />} />
          <Route path="reset-password-teammember" element={<ResetPasswordTeamMember />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </Router>
    
  );
}

export default App;