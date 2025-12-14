import React, { useState, useEffect } from 'react';
import Admin from './Admin';
import './App.css';

function App() {
  // Initialize state from localStorage or defaults
  const [targetDate, setTargetDate] = useState(() => 
    localStorage.getItem('countdown-targetDate') || '2025-12-17T23:59:59'
  );
  const [title, setTitle] = useState(() => 
    localStorage.getItem('countdown-title') || '🎉 Al Amiin FX Comming Soon 🎊'
  );
  const [showAdmin, setShowAdmin] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(() => 
    localStorage.getItem('countdown-active') !== 'false'
  );
  const [syncIndicator, setSyncIndicator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Loading screen effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2 second loading screen

    return () => clearTimeout(loadingTimer);
  }, []);

  const calculateTimeLeft = React.useCallback((target = targetDate) => {
    const difference = +new Date(target) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('countdown-targetDate', targetDate);
  }, [targetDate]);

  useEffect(() => {
    localStorage.setItem('countdown-title', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('countdown-active', isCountdownActive);
  }, [isCountdownActive]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Show sync indicator
      setSyncIndicator(true);
      setTimeout(() => setSyncIndicator(false), 1500);
      
      if (e.key === 'countdown-targetDate' && e.newValue !== targetDate) {
        setTargetDate(e.newValue);
        setTimeLeft(calculateTimeLeft(e.newValue));
      }
      if (e.key === 'countdown-title' && e.newValue !== title) {
        setTitle(e.newValue);
      }
      if (e.key === 'countdown-active' && e.newValue !== isCountdownActive.toString()) {
        setIsCountdownActive(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [targetDate, title, isCountdownActive, calculateTimeLeft]);

  useEffect(() => {
    if (!isCountdownActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isCountdownActive, calculateTimeLeft]);

  const handleSetCountdown = (newDate, newTitle) => {
    setTargetDate(newDate);
    setTitle(newTitle);
    setTimeLeft(calculateTimeLeft(newDate));
    
    // Broadcast changes to other tabs
    localStorage.setItem('countdown-targetDate', newDate);
    localStorage.setItem('countdown-title', newTitle);
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'countdown-update',
      newValue: Date.now().toString()
    }));
  };

  const handleStartCountdown = () => {
    setIsCountdownActive(true);
    localStorage.setItem('countdown-active', 'true');
    
    // Broadcast change to other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'countdown-active',
      newValue: 'true'
    }));
  };

  const isCountdownFinished = timeLeft.days === 0 && timeLeft.hours === 0 && 
                              timeLeft.minutes === 0 && timeLeft.seconds === 0;

  // Admin page toggle with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setShowAdmin(!showAdmin);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAdmin]);

  if (showAdmin) {
    return (
      <Admin 
        onSetCountdown={handleSetCountdown}
        onStartCountdown={handleStartCountdown}
        isCountdownActive={isCountdownActive}
        currentDate={targetDate}
        currentTitle={title}
        onClose={() => setShowAdmin(false)}
      />
    );
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="App loading-screen">
        <div className="logo-background">
          <img src="/logo.png" alt="Al Amiin FX Logo" className="background-logo loading-logo" />
        </div>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2 className="loading-text">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="logo-background">
        <img src="/logo.png" alt="Al Amiin FX Logo" className="background-logo" />
      </div>
      
      {syncIndicator && (
        <div className="sync-indicator">
          🔄 Synchronized
        </div>
      )}
      
      <button 
        className="admin-toggle"
        onClick={() => setShowAdmin(true)}
        title="Admin Panel (Ctrl+A)"
      >
        ⚙️
      </button>
      
      <div className="countdown-container">
        <h1 className="countdown-title">{title}</h1>
        
        {!isCountdownActive ? (
          <div className="inactive-message">
            <h2>🔧 Countdown Paused</h2>
            <p>Use admin panel to start countdown</p>
            <button onClick={() => setShowAdmin(true)} className="admin-btn">
              Go to Admin Panel
            </button>
          </div>
        ) : isCountdownFinished ? (
          <div className="finished-message">
            <h2>🎉 Time's Up! 🎉</h2>
            <p>The countdown has finished!</p>
          </div>
        ) : (
          <div className="countdown-display">
            <div className="time-unit">
              <div className="time-number">{timeLeft.days || 0}</div>
              <div className="time-label">Days</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-number">{String(timeLeft.hours || 0).padStart(2, '0')}</div>
              <div className="time-label">Hours</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-number">{String(timeLeft.minutes || 0).padStart(2, '0')}</div>
              <div className="time-label">Minutes</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-number">{String(timeLeft.seconds || 0).padStart(2, '0')}</div>
              <div className="time-label">Seconds</div>
            </div>
          </div>
        )}
        
        <div className="target-date">
          Counting down to: {new Date(targetDate).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default App;
