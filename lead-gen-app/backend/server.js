const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Initialize database
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// API Routes

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await db.getAllLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lead
app.get('/api/leads/:id', async (req, res) => {
  try {
    const lead = await db.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new lead
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, company, message, source } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const lead = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      company: company || '',
      message: message || '',
      source: source || 'website',
      status: 'new',
      created_at: new Date().toISOString()
    };

    const newLead = await db.createLead(lead);
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead status
app.put('/api/leads/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updatedLead = await db.updateLead(req.params.id, { status, notes });
    
    if (!updatedLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lead
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const deleted = await db.deleteLead(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fallback route for React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
