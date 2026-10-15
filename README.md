# HirePro — Job Application Tracker

A full-stack web application to track job applications through stages: **Applied → Interview → Offer → Rejected**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Backend | Express.js (Node.js) |
| Database | MongoDB (local, port 27017) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| HTTP | Axios (with token interceptor) |

---

## Project Structure

```
hirepro/
├── backend/
│   ├── server.js          ← Express server, MongoDB connection, JWT auth, and REST APIs
│   ├── seed.js            ← Placement drive sample data seeder
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api.js         ← Axios instance + JWT request interceptor
    │   ├── App.jsx        ← Root shell component (manages auth state)
    │   ├── index.css      ← Design system variables and shell layout
    │   ├── components/
    │   │   ├── Sidebar.jsx / .css         ← Dark navigation bar with user profile & stats
    │   │   ├── StatCards.jsx / .css       ← Monospace metric strip
    │   │   ├── ApplicationCard.jsx / .css ← Modular card row with status accent
    │   │   └── ApplicationForm.jsx / .css ← Add/Edit modal dialog
    │   └── pages/
    │       ├── AuthView.jsx / .css        ← Sign In / Create Account with one-click demo
    │       └── Dashboard.jsx / .css       ← Main workspace with filters and search
    ├── index.html
    └── package.json
```

---

## REST API Reference

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Public? |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user (`name`, `email`, `password`) | Yes |
| POST | `/api/auth/login` | Login user (`email`, `password`) → returns JWT token | Yes |
| GET | `/api/auth/me` | Get current user profile | Protected (Bearer Token) |

### 📋 Applications Endpoints (Protected with `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | List user's applications (supports `?status=`, `?sort=`) |
| GET | `/api/applications/stats` | Aggregated counts per status + total |
| POST | `/api/applications` | Create new application associated with user |
| PATCH | `/api/applications/:id/status` | Update only status of user's application |
| PATCH | `/api/applications/:id` | Update all editable fields of application |
| DELETE | `/api/applications/:id` | Permanently remove application |

---

## Default Demo Account

A default account is automatically preloaded with all 24 sample campus placement drive records:

- **Email:** `demo@hirepro.com`
- **Password:** `password123`

You can also click the **"⚡ One-Click Demo Sign In"** button on the login screen.

---

## How to Run

### Prerequisites
- Node.js (v16+)
- MongoDB running locally on port 27017

### 1. Start MongoDB
```bash
mongod
```

### 2. Start the Backend
```bash
cd backend
npm install
npm start
# Server runs at http://localhost:5000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```
