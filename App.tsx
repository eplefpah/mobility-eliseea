import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MobilityChecklist from './pages/MobilityChecklist';
import Journal from './pages/Journal';
import Forum from './pages/Forum';
import Admin from './pages/Admin';
import Evaluation from './pages/Evaluation';
import { User, UserRole } from './types';
import { CURRENT_USER, TEACHER_USER, ADMIN_USER } from './services/mockData';

const App: React.FC = () => {
  // Simulating Auth State for the MVP Demo
  const [user, setUser] = useState<User>(CURRENT_USER);

  const availableUsers = [CURRENT_USER, TEACHER_USER, ADMIN_USER];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} availableUsers={availableUsers} />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="mobility" element={<MobilityChecklist user={user} />} />
          <Route path="journal" element={<Journal user={user} />} />
          <Route path="forum" element={<Forum />} />
          <Route path="evaluation" element={<Evaluation user={user} />} />
          <Route 
            path="admin" 
            element={user.role === UserRole.ADMIN ? <Admin /> : <Navigate to="/" replace />} 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;