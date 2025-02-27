import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig';
import './Login.css';
import loginImg from '../../assets/login.jpg';

const Login = ({ setIsAuthenticated }) => {
  const [adminname, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let adminData = {
      adminname:adminname.toUpperCase(),
      password
    }
    
    try {
      const response = await axios.post('/api/admin/logInAdmin', adminData);

      if (response.data.success) {
        const adminDetails = {
          name: response.data.name,
          ID: response.data.ID,
        };

        localStorage.setItem('auth', 'true');
        localStorage.setItem('adminDetails', JSON.stringify(adminDetails));
        setIsAuthenticated(true);
        toast.success(response.data.message);
        navigate('/dashboard');

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <img src={loginImg} alt="" />
      <div className="right_login">
        <h4>Hi, Welcome Back to</h4>
        <h1>SAREDUFY Web <b>Plus</b> Academy</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Login</h2>
          <div className="form-group">
            <label className="form-label">admin ID:</label>
            <input
              className="form-input"
              type="text"
              value={adminname}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="submit-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
