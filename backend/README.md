# Project Forge Backend

Flask backend API for Project Forge website with Supabase integration.

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the `.env.example` file from the root directory to `.env` and fill in your values:

```bash
# From the project root directory
cp .env.example .env
```

Required variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key (for admin operations)
- `FLASK_SECRET_KEY`: A random secret key for Flask sessions
- `ADMIN_USERNAME`: Username for admin panel
- `ADMIN_PASSWORD`: Password for admin panel

### 4. Setup Database

Run the SQL migration scripts in your Supabase SQL Editor:

1. First run `migrations/001_initial_schema.sql` to create the tables
2. Then run `migrations/002_seed_data.sql` to add initial data

**Important**: Also create a storage bucket named `images` in Supabase Storage for image uploads.

### 5. Run the Server

```bash
python app.py
```

The server will start at `http://localhost:5000`.

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | Get all project templates |
| GET | `/api/templates/:id` | Get single template |
| GET | `/api/portfolio` | Get all portfolio projects |
| GET | `/api/team` | Get all team members |
| POST | `/api/contact` | Submit contact form |
| GET | `/health` | Health check |

### Admin Endpoints (Basic Auth Required)

All admin endpoints require Basic Authentication with the configured `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/templates` | List templates |
| POST | `/admin/templates` | Create template |
| PUT | `/admin/templates/:id` | Update template |
| DELETE | `/admin/templates/:id` | Delete template |
| GET | `/admin/portfolio` | List portfolio projects |
| POST | `/admin/portfolio` | Create portfolio project |
| PUT | `/admin/portfolio/:id` | Update portfolio project |
| DELETE | `/admin/portfolio/:id` | Delete portfolio project |
| GET | `/admin/team` | List team members |
| POST | `/admin/team` | Create team member |
| PUT | `/admin/team/:id` | Update team member |
| DELETE | `/admin/team/:id` | Delete team member |
| GET | `/admin/contacts` | List contact submissions |
| DELETE | `/admin/contacts/:id` | Delete contact |
| PUT | `/admin/contacts/:id/read` | Mark contact as read |
| POST | `/admin/upload` | Upload image to Supabase Storage |

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── supabase_client.py  # Supabase client singleton
├── requirements.txt    # Python dependencies
├── routes/
│   ├── __init__.py
│   ├── api.py          # Public API routes
│   └── admin.py        # Admin API routes
└── migrations/
    ├── 001_initial_schema.sql
    └── 002_seed_data.sql
```
