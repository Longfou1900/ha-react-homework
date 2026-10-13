import React, { useState, useEffect } from 'react';

function App() {
  const [serverInfo, setServerInfo] = useState({ server: 'LOADING...', timestamp: '' });
  const [history, setHistory] = useState([]);
  const [auto, setAuto] = useState(false);

  const fetchServerInfo = () => {
    fetch('/api/info')
      .then(res => res.json())
      .then(data => {
        setServerInfo(data);
        setHistory(prev => [
          { time: new Date().toLocaleTimeString(), server: data.server, timestamp: data.timestamp },
          ...prev.slice(0, 19)
        ]);
      })
      .catch(err => console.error('Error fetching server info:', err));
  };

  useEffect(() => {
    fetchServerInfo();
  }, []);

  // Update the browser tab title dynamically whenever serverInfo.server updates
  useEffect(() => {
    if (serverInfo.server && serverInfo.server !== 'LOADING...') {
      // You can format it however you like: e.g., "HA | web-01" or just "web-01"
      document.title = `HA | ${serverInfo.server}`;
    } else {
      document.title = 'HA React App (Loading...)';
    }
  }, [serverInfo.server]);

  // Automatically send one request every second when enabled.
  useEffect(() => {
    if (!auto) return;

    const intervalId = setInterval(() => {
      fetchServerInfo();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [auto]);

  const isWeb01 = serverInfo.server.includes('WEB-01');

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1a202c' }}>Highly Available React.js App</h1>
        <p style={{ color: '#4a5568' }}>Vagrant • HAProxy • Keepalived • systemd</p>
      </header>

      <div style={{
        background: isWeb01 ? '#f64702' : '#00ff62',
        color: 'white',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>This page was served by</p>
        <h2 style={{ margin: 0, fontSize: '3rem', fontWeight: 'bold', letterSpacing: '2px' }}>
          {serverInfo.server}
        </h2>
        <p style={{ margin: '15px 0 0 0', opacity: 0.9 }}>release 1.0.0-20261012</p>
      </div>

      <div style={{ background: '#f7fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginTop: 0, color: '#2d3748' }}>Load-balancing test</h3>
        <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>
          Each request goes through VIP -> HAProxy -> Backend server. With round-robin you should see WEB-01 and WEB-02 alternate.
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={fetchServerInfo}
            style={{ background: '#1a202c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Send request
          </button>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#4a5568',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <input
              type="checkbox"
              checked={auto}
              onChange={(event) => setAuto(event.target.checked)}
            />
            Auto (1/s)
          </label>

          <button
            onClick={() => setHistory([])}
            style={{ background: '#e2e8f0', color: '#2d3748', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>

        <div style={{ background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e0', maxHeight: '250px', overflowY: 'auto' }}>
          {history.length === 0 ? (
            <p style={{ color: '#a0aec0', margin: 0, textAlign: 'center' }}>No requests sent yet.</p>
          ) : (
            history.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #edf2f7', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 'bold', color: '#718096' }}>{item.time}</span>
                <span style={{
                  background: item.server.includes('WEB-01') ? '#ebf8ff' : '#f0fff4',
                  color: item.server.includes('WEB-01') ? '#2b6cb0' : '#2f855a',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  {item.server}
                </span>
                <span style={{ color: '#a0aec0' }}>{item.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;