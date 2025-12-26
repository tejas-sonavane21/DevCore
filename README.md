# Project Forge

A modern business website for Project Forge - a service helping students with final year projects. Features a React frontend with a Flask backend and Supabase database integration.

## Project Structure

```
project-forge/
├── frontend/           # React (Vite) frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components (including admin)
│   │   ├── lib/        # Utilities and API service
│   │   └── contexts/   # React contexts
│   └── ...
├── backend/            # Flask backend
│   ├── routes/         # API routes
│   ├── migrations/     # SQL migration scripts
│   └── ...
├── .env.example        # Environment variables template
└── .gitignore
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Supabase account

### 1. Clone and Setup Environment

```bash
# Copy environment template
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 2. Setup Database

1. Go to your Supabase project's SQL Editor
2. Run `backend/migrations/001_initial_schema.sql`
3. Run `backend/migrations/002_seed_data.sql`
4. Create a storage bucket named `images` in Supabase Storage

### 3. Start Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

Backend runs at: http://localhost:5000

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Features

### Public Website
- **Home Page**: Hero section, value proposition, team showcase, tech stack, portfolio, and process timeline
- **Project Ideas**: Browse project templates with filtering and detailed tech specs
- **Contact Form**: Dynamic contact modal for inquiries

### Admin Panel
Access at `/admin` with configured credentials:
- **Dashboard**: Overview with stats and recent contacts
- **Templates**: CRUD for project templates
- **Portfolio**: CRUD for portfolio projects
- **Team**: CRUD for team members
- **Contacts**: View and manage form submissions

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query (React Query)
- React Router

### Backend
- Flask
- Supabase (PostgreSQL + Storage)
- Flask-CORS

## Environment Variables

See `.env.example` for all required variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
FLASK_SECRET_KEY=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
```

## License

MIT
