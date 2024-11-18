import React, { useState } from 'react';
import axios from '../../axiosConfig.js';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons from react-icons/fa
import './Dashboard.css';

const Dashboard = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  const handlePasswordToggle = (toggleType) => {
    if (toggleType === 'old') setShowOldPassword(!showOldPassword);
    else if (toggleType === 'new') setShowNewPassword(!showNewPassword);
    else if (toggleType === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    const adminname = adminDetails?.ID;

    if (!adminname) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Admin ID not found. Please log in again.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'New & Confirm password does not match. Please try again.',
      });
      return;
    }

    try {
      const response = await axios.post('/api/admin/updatePassword', {
        adminname,
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Updated',
          text: 'Your password has been successfully updated!',
        }).then(() => {
          togglePopup();
          // Clear input fields
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to update password.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Error updating password. Please try again later.',
      });
    }
  };

  return (
    <div>
      <h1 className='dashboard_heading'>Welcome to Saredufy Webplus Academy Pvt. Ltd.</h1>
      <br />
      <hr />
      <br />
      <button onClick={togglePopup} className="change-password-button">Change Password</button>

      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <label>
                Old Password:
                <div className="password-container">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() => handlePasswordToggle('old')}
                  >
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />} {/* Use react-icons here */}
                  </button>
                </div>
              </label>
              <label>
                New Password:
                <div className="password-container">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() => handlePasswordToggle('new')}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />} {/* Use react-icons here */}
                  </button>
                </div>
              </label>
              <label>
                Confirm Password:
                <div className="password-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() => handlePasswordToggle('confirm')}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Use react-icons here */}
                  </button>
                </div>
              </label>
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" onClick={togglePopup} className="cancel-button">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
