# Webshooks Backend (FastAPI)

FastAPI backend for the Webshooks SaaS Builder. Provides JWT auth, projects CRUD, chat mock, CORS, and health check.

- Base URL: http://localhost:8000/api
- Python: 3.11+

## Endpoints
- Auth
  - POST /api/auth/signup
  - POST /api/auth/signin
  - GET  /api/auth/me
- Projects (JWT required)
  - GET    /api/projects
  - POST   /api/projects
  - GET    /api/projects/{project_id}
  - PUT    /api/projects/{project_id}
  - DELETE /api/projects/{project_id}
- Chat (JWT required)
  - POST /api/chat/ask
- Health
  - GET /api/health

## Quickstart

1. Create virtualenv and install requirements
   python -m venv .venv
   . .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r backend/requirements.txt

2. Run the server
   uvicorn backend.main:app --reload --port 8000

3. Test
   curl http://localhost:8000/api/health

## Notes
- Storage: SQLite via SQLModel (file: ./backend/app.db)
- JWT: HS256 using python-jose
- Password hashing: passlib[bcrypt]
- CORS: Allows http://localhost:3000 for the Next.js dev server

