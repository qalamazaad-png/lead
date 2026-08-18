import { useState, useEffect } from 'react';
import { leadAPI } from '../api';

function LeadDashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsRes, statsRes] = await Promise.all([
        leadAPI.getAll(),
        leadAPI.getStats()
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await leadAPI.update(id, { status: newStatus });
      fetchData();
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await leadAPI.delete(id);
      fetchData();
      setSelectedLead(null);
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const filteredLeads = filterStatus === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filterStatus);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchData} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Lead Dashboard</h2>
        <button onClick={fetchData} className="refresh-btn">Refresh</button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Leads</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>New Leads</h3>
            <p className="stat-value">{stats.byStatus?.new || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Contacted</h3>
            <p className="stat-value">{stats.byStatus?.contacted || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Recent (7 days)</h3>
            <p className="stat-value">{stats.recent || 0}</p>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        {/* Leads List */}
        <div className="leads-section">
          <div className="leads-header">
            <h3>All Leads ({filteredLeads.length})</h3>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="leads-list">
            {filteredLeads.length === 0 ? (
              <p className="no-leads">No leads found</p>
            ) : (
              filteredLeads.map(lead => (
                <div 
                  key={lead.id} 
                  className={`lead-item ${selectedLead?.id === lead.id ? 'selected' : ''}`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="lead-info">
                    <h4>{lead.name}</h4>
                    <p>{lead.email}</p>
                    {lead.company && <p className="company">{lead.company}</p>}
                  </div>
                  <span className={`status-badge status-${lead.status}`}>
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lead Details Panel */}
        {selectedLead && (
          <div className="lead-details">
            <div className="details-header">
              <h3>Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="close-btn">×</button>
            </div>
            
            <div className="details-content">
              <div className="detail-row">
                <label>Name:</label>
                <span>{selectedLead.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{selectedLead.email}</span>
              </div>
              {selectedLead.phone && (
                <div className="detail-row">
                  <label>Phone:</label>
                  <span>{selectedLead.phone}</span>
                </div>
              )}
              {selectedLead.company && (
                <div className="detail-row">
                  <label>Company:</label>
                  <span>{selectedLead.company}</span>
                </div>
              )}
              <div className="detail-row">
                <label>Source:</label>
                <span className="source-badge">{selectedLead.source}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusUpdate(selectedLead.id, e.target.value)}
                  className="status-select"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              {selectedLead.message && (
                <div className="detail-row full-width">
                  <label>Message:</label>
                  <p className="message-text">{selectedLead.message}</p>
                </div>
              )}
              <div className="detail-row">
                <label>Created:</label>
                <span>{new Date(selectedLead.created_at).toLocaleString()}</span>
              </div>
              
              <div className="details-actions">
                <button 
                  onClick={() => handleDelete(selectedLead.id)}
                  className="delete-btn"
                >
                  Delete Lead
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadDashboard;
