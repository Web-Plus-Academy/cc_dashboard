import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
// import TaskSubmit from './Components/TaskSubmit/TaskSubmit';
import axios from './axiosConfig';
import AddStudent from './Components/AddStudent/AddStudent';
import TaskAllocation from './Components/TaskAllocation/TaskAllocation';
import SemProjAllocation from './Components/SemProjAllocation/SemProjAllocation';
import TaskCreditUpdate from './Components/TaskCreditUpdate/TaskCreditUpdate';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);

  useEffect(() => {
    const authState = localStorage.getItem('auth');
    const adminDetails = localStorage.getItem('adminDetails');
    if (authState && adminDetails) {
      setIsAuthenticated(JSON.parse(authState));
      setAdminDetails(JSON.parse(adminDetails));
    }
  }, []);

  const handleLogin = (authState) => {
    localStorage.setItem('auth', JSON.stringify(authState));
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    setIsAuthenticated(authState);
    setAdminDetails(adminDetails);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/admin/logoutAdmin');

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.removeItem('auth');
        localStorage.removeItem('adminDetails');
        setIsAuthenticated(false);
        setAdminDetails(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <Router>
      <ToastContainer />
      {isAuthenticated ? (
        <div className='application'>
          <Navbar onLogout={handleLogout} />
          <div className="app-container">
            <Sidebar adminDetails={adminDetails} />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/addStudent" element={<AddStudent />} />
                <Route path="/taskalloc" element={<TaskAllocation/>} />
                <Route path="/semprojalloc" element={<SemProjAllocation />} />
                <Route path="/taskcredit" element={<TaskCreditUpdate />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};


export default App;
