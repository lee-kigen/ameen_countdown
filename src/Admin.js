import React, { useState } from 'react';
import './Admin.css';

function Admin({ onSetCountdown, onStartCountdown, isCountdownActive, currentDate, currentTitle, onClose }) {
  const [adminDate, setAdminDate] = useState(currentDate || '');
  const [adminTitle, setAdminTitle] = useState(currentTitle || '');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - you can make this more secure
    if (adminPassword === 'kxgxn!!') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  const handleSetCountdown = (e) => {
    e.preventDefault();
    if (adminDate && adminTitle) {
      onSetCountdown(adminDate, adminTitle);
      alert('Countdown settings updated!');
      // Auto-close admin panel after successful update
      setTimeout(() => onClose(), 1000);
    } else {
      alert('Please fill in both date and title!');
    }
  };

  const handleStartCountdown = () => {
    onStartCountdown();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="password-input"
            />
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <button onClick={onClose} className="close-btn" title="Back to Countdown">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSetCountdown} className="admin-form">
          <div className="form-group">
            <label htmlFor="admin-title">Event Title:</label>
            <input
              id="admin-title"
              type="text"
              placeholder="Enter event title"
              value={adminTitle}
              onChange={(e) => setAdminTitle(e.target.value)}
              className="admin-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="admin-date">Target Date & Time:</label>
            <input
              id="admin-date"
              type="datetime-local"
              value={adminDate}
              onChange={(e) => setAdminDate(e.target.value)}
              className="admin-input"
            />
          </div>
          
          <div className="admin-actions">
            <button type="submit" className="set-btn">Set Countdown</button>
            <button 
              type="button" 
              onClick={handleStartCountdown}
              className={`start-btn ${isCountdownActive ? 'active' : ''}`}
              disabled={!adminDate || !adminTitle}
            >
              {isCountdownActive ? 'Countdown Active' : 'Start Countdown'}
            </button>
          </div>
        </form>
        
        <div className="admin-status">
          <h3>Current Settings</h3>
          <p>Countdown: {isCountdownActive ? 'Active' : 'Inactive'}</p>
          <p>Current Event: {currentTitle || 'Not set'}</p>
          <p>Target Date: {currentDate ? new Date(currentDate).toLocaleString() : 'Not set'}</p>
        </div>
        
        <div className="admin-actions-bottom">
          <button onClick={onClose} className="back-btn">
            Back to Countdown
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
