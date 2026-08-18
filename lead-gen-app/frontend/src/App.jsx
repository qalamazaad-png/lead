import { useState } from 'react'
import LeadForm from './components/LeadForm'
import LeadDashboard from './components/LeadDashboard'
import './App.css'

function App() {
  const [view, setView] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLeadSubmitted = () => {
    // Trigger refresh of dashboard
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Lead Generation System</h1>
        <nav className="app-nav">
          <button 
            className={view === 'form' ? 'active' : ''}
            onClick={() => setView('form')}
          >
            Lead Form
          </button>
          <button 
            className={view === 'dashboard' ? 'active' : ''}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'form' ? (
          <LeadForm onLeadSubmitted={handleLeadSubmitted} />
        ) : (
          <LeadDashboard key={refreshKey} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Lead Generation System. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
