# HirePro — Full-Stack Job Application & Placement Tracker

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Express.js%20(Node.js)-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

HirePro is a modern, modular, full-stack web application designed for students and job seekers to track campus placement drives and job applications through every recruitment stage: **Applied → Interview → Offer → Rejected**.

---

## 🔗 Project Links

- **GitHub Repository:** [https://github.com/KarthikMallareddy/HirePro](https://github.com/KarthikMallareddy/HirePro)
- **Live Backend API (Render):** [https://hirepro-rll3.onrender.com](https://hirepro-rll3.onrender.com)
- **Live Frontend (Vercel):** Deployed via Vercel connecting to Render API

---

## ✨ Key Features

- **🔐 End-to-End JWT Authentication:** Secure registration and login with passwords hashed using `bcryptjs` (salt rounds = 10). Complete user-level data isolation.
- **🏢 Auto-Fetched Company Logos:** Automatically fetches official brand logos via Clearbit Logo API with instant initials-badge fallback.
- **🚇 Subway Map Pipeline Stepper:** Visual recruitment progress bar on every card (`Applied → Interview → Offer → Rejected`) for instant one-click stage updates.
- **🍱 Bento Box Metric Cards:** 5-metric dashboard strip with soft ambient gradients, monospace telemetry counters, and tactile hover elevation.
- **🎨 Color-Coded Card Accents:** Status-tinted ambient background washes with 6px bold left borders (Blue = Applied, Amber = Interview, Emerald = Offer, Red = Rejected).
- **⏳ Dynamic "Days Ago" Badge:** Live human-readable waiting indicators (e.g., `⏳ Today`, `⏳ Yesterday`, `⏳ 14 days ago`).
- **🔍 Filter, Sort & Instant Search:** Real-time client-side text filtering by company or role name alongside status chip selection and sorting.
- **📱 Responsive & Trustworthy UI:** Dark fixed sidebar workspace with user profile details, active session indicators, and sign-out controls.

---

## 👥 Pre-Configured Accounts & Datasets

The database is pre-populated with ready-to-use candidate accounts:

| User | Email | Password | Preloaded Placement Drives |
|:---|:---|:---|:---:|
| **Karthik** | `mrkarthik1811@gmail.com` | `karthik123` | **15 Drives** (HyperVerge, Goldman Sachs, IBM, etc.) |
| **Navadeep** | `navadeep3108@gmail.com` | `navadeep123` | **14 Drives** (Caterpillar, Amazon, Honeywell, etc.) |
| **Demo User**| `demo@hirepro.com` | `password123` | **24 Drives** (All initial campus drives) |

> ⚡ **Tip:** The sign-in page includes **1-Click Instant Login** buttons for all preset accounts.

---

## 🗄️ Database Architecture (MongoDB)

The database (`hirepro_db`) uses a clean relational document model linking two collections via `userId`:

```text
 ┌────────────────────────┐
 │      users (1)         │
 │  _id: "6ad12d41..."    │
 │  email, hashed password│
 └───────────┬────────────┘
             │ 1-to-Many Link
             │ (userId)
             ▼
 ┌──────────────────────────────────────────────┐
 │             applications (Many)              │
 │  userId: "6ad12d41...", company, role,       │
 │  salary, status, interviewDates, notes       │
 └──────────────────────────────────────────────┘
```

### 1. `users` Collection Schema
```json
{
  "_id": "ObjectId",
  "name": "Karthik",
  "email": "mrkarthik1811@gmail.com",
  "password": "$2a$10$hashed_password_string...",
  "createdAt": "2026-10-15T20:49:50.000Z"
}
```

### 2. `applications` Collection Schema
```json
{
  "_id": "ObjectId",
  "userId": "6ad12d41d62444cdd4139324",
  "company": "HyperVerge",
  "role": "B.Tech 2027 POB",
  "jobLink": "https://careers.hyperverge.co",
  "salaryExpectation": "10L-16L | Stipend: 35K-45K/month",
  "applicationDate": "2026-09-10",
  "status": "Interview",
  "interviewDates": ["2026-09-16"],
  "notes": "Apply Before: 14 Sept 2026 | Type: Intern Leads to Full Time",
  "createdAt": "2026-10-15T20:49:50.000Z"
}
```

---

## 📡 REST API Reference (Mapped to CRUD)

All `/api/applications` endpoints require header: `Authorization: Bearer <token>`.

| Method | Endpoint | CRUD | Auth? | Description |
|:---|:---|:---:|:---:|:---|
| `GET` | `/` | **Read** | No | Health check & API documentation |
| `POST` | `/api/auth/register` | **Create** | No | Register new account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | **Read** | No | Verify credentials & receive signed JWT token |
| `GET` | `/api/auth/me` | **Read** | Yes | Get currently authenticated profile |
| `GET` | `/api/applications` | **Read** | Yes | Get user's applications (supports `?status=`, `?sort=`) |
| `GET` | `/api/applications/stats` | **Read** | Yes | MongoDB aggregation grouping counts by status |
| `POST` | `/api/applications` | **Create** | Yes | Create new application bound to `userId` |
| `PATCH` | `/api/applications/:id/status`| **Update** | Yes | Instant status changer from Subway Stepper |
| `PATCH` | `/api/applications/:id` | **Update** | Yes | Full edit of application fields via modal |
| `DELETE`| `/api/applications/:id` | **Delete** | Yes | Permanently remove application |

---

## 🛠️ Project Structure

```text
hirepro/
├── backend/
│   ├── server.js              ← Express REST server, MongoDB connection, JWT auth
│   ├── seed.js                ← Initial placement drives seed script
│   ├── seed_accounts.js       ← Karthik & Navadeep accounts seed script
│   ├── package.json           ← Backend dependencies (express, mongodb, bcryptjs, jwt)
│   └── .env                   ← Backend environment configuration (git-ignored)
│
├── frontend/
│   ├── index.html             ← Single HTML root page
│   ├── vercel.json            ← Vercel SPA routing rewrite rules
│   ├── package.json           ← Frontend dependencies (react, vite, axios)
│   ├── public/
│   │   └── _redirects         ← Netlify SPA routing fallback
│   └── src/
│       ├── main.jsx           ← React DOM entry point
│       ├── App.jsx            ← Root shell (session manager & router)
│       ├── index.css          ← Design tokens, color system, and shell layout
│       ├── api.js             ← Centralized Axios client + JWT interceptor
│       ├── pages/
│       │   ├── AuthView.jsx / .css   ← Login / Signup with 1-click accounts
│       │   └── Dashboard.jsx / .css  ← Main application workspace
│       └── components/
│           ├── Sidebar.jsx / .css         ← Dark navigation sidebar
│           ├── StatCards.jsx / .css       ← Bento Box metric tiles
│           ├── ApplicationCard.jsx / .css ← Interactive job card row
│           └── ApplicationForm.jsx / .css ← Add / Edit modal dialog
│
├── .gitignore                 ← Git ignore rules (node_modules, .env, dist)
└── README.md                  ← Project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port 27017 (or MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/KarthikMallareddy/HirePro.git
cd HirePro
```

### 2. Configure & Start the Backend
```bash
cd backend
npm install
node server.js
```
*Backend runs at:* `http://localhost:5000`

### 3. Start the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

### 4. (Optional) Run Account Seeder
To populate Karthik, Navadeep, and sample data into your database:
```bash
cd backend
node seed_accounts.js
```

---

## 🌐 Production Deployment Guide

### Backend on [Render.com](https://render.com)
1. Create a new **Web Service** and connect the `HirePro` repository.
2. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
3. Environment Variables:
   - `MONGO_URL` = `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/hirepro_db?retryWrites=true&w=majority`
   - `JWT_SECRET` = `hirepro_production_secret_2026`

### Frontend on [Vercel.com](https://vercel.com)
1. Create a new Project and import `HirePro`.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
3. Environment Variables:
   - `VITE_API_URL` = `https://your-render-service.onrender.com/api`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
