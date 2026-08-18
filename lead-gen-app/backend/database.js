const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'leads.db');
const db = new sqlite3.Database(dbPath);

// Create leads table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      message TEXT,
      source TEXT DEFAULT 'website',
      status TEXT DEFAULT 'new',
      notes TEXT,
      created_at TEXT NOT NULL
    )
  `);
});

// Get all leads
function getAllLeads() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM leads ORDER BY created_at DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Get lead by ID
function getLeadById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM leads WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Create new lead
function createLead(lead) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO leads (id, name, email, phone, company, message, source, status, notes, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.message,
      lead.source,
      lead.status,
      lead.notes || null,
      lead.created_at
    ], function(err) {
      if (err) reject(err);
      else resolve(lead);
    });
  });
}

// Update lead
function updateLead(id, updates) {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    
    if (updates.status) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    
    if (fields.length === 0) {
      resolve(null);
      return;
    }
    
    values.push(id);
    
    const sql = `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`;
    
    db.run(sql, values, function(err) {
      if (err) reject(err);
      else {
        getLeadById(id).then(resolve).catch(reject);
      }
    });
  });
}

// Delete lead
function deleteLead(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM leads WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
}

// Get statistics
function getStats() {
  return new Promise((resolve, reject) => {
    const stats = {};
    
    // Total leads
    db.get('SELECT COUNT(*) as count FROM leads', [], (err, row) => {
      if (err) reject(err);
      else {
        stats.total = row.count;
        
        // Leads by status
        db.all('SELECT status, COUNT(*) as count FROM leads GROUP BY status', [], (err, rows) => {
          if (err) reject(err);
          else {
            stats.byStatus = {};
            rows.forEach(row => {
              stats.byStatus[row.status] = row.count;
            });
            
            // Leads by source
            db.all('SELECT source, COUNT(*) as count FROM leads GROUP BY source', [], (err, rows) => {
              if (err) reject(err);
              else {
                stats.bySource = {};
                rows.forEach(row => {
                  stats.bySource[row.source] = row.count;
                });
                
                // Recent leads (last 7 days)
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                
                db.get('SELECT COUNT(*) as count FROM leads WHERE created_at > ?', [weekAgo.toISOString()], (err, row) => {
                  if (err) reject(err);
                  else {
                    stats.recent = row.count;
                    resolve(stats);
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

module.exports = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getStats,
  close: () => db.close()
};
