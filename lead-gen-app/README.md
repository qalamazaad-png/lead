# Lead Generation System

A full-stack lead generation application with a React frontend and Node.js/Express backend.

## Features

### Frontend (React + Vite)
- **Lead Capture Form**: Beautiful, responsive form for collecting lead information
- **Lead Dashboard**: Manage and track all leads with filtering capabilities
- **Statistics Overview**: Real-time stats showing total leads, new leads, contacted leads, and recent activity
- **Lead Management**: Update lead status, view details, and delete leads
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for leads
- **SQLite Database**: Lightweight, file-based database for data persistence
- **Statistics Endpoint**: Aggregated data for dashboard analytics
- **CORS Support**: Ready for cross-origin requests
- **Production Ready**: Can serve static files from the built React app

## Project Structure

```
lead-gen-app/
├── backend/
│   ├── server.js          # Express server
│   ├── database.js        # SQLite database operations
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styles
│   │   ├── api.js         # API client
│   │   └── components/
│   │       ├── LeadForm.jsx      # Lead capture form
│   │       └── LeadDashboard.jsx # Lead management dashboard
│   ├── package.json       # Frontend dependencies
│   └── dist/              # Production build
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Optional: configure environment variables
npm start             # Start the server on port 3001
```

The backend API will be available at `http://localhost:3001/api`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev           # Start development server
```

The frontend will be available at `http://localhost:5173`

### Production Build

```bash
# Build the frontend
cd frontend
npm run build

# The backend can now serve the static files
cd ../backend
NODE_ENV=production npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads |
| GET | `/api/leads/:id` | Get a specific lead |
| POST | `/api/leads` | Create a new lead |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/stats` | Get lead statistics |

## Lead Data Structure

```json
{
  "id": "uuid",
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string",
  "company": "string",
  "message": "string",
  "source": "string (website, google, social, referral, advertisement, other)",
  "status": "string (new, contacted, qualified, converted, lost)",
  "notes": "string",
  "created_at": "ISO date string"
}
```

## Usage

1. **Capture Leads**: Use the Lead Form to collect information from potential customers
2. **View Dashboard**: Navigate to the Dashboard to see all captured leads
3. **Manage Leads**: 
   - Click on a lead to view details
   - Update lead status as you progress through your sales pipeline
   - Filter leads by status
   - Delete leads when necessary
4. **Monitor Stats**: Keep track of your lead generation performance with real-time statistics

## Technology Stack

- **Frontend**: React 18, Vite, Axios
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: Custom CSS with CSS Variables

## License

MIT
