# 🎓 Trio Academy — DBMS Lab Project

**Course:** Database Management System (Sessional) — 0612-1209  
**Batch:** CSE 14th (B) | **Session:** Fall-2024  
**Team:** Data Miners — Bakia Shifa, Mofasserul Hoque, Munem Ashad  
**Submitted to:** Mohammed Aftab Uddin Alif, CCN University of Science and Technology

---

## 📋 Overview

Trio Academy is a full-stack tutorial-based web platform built with the **MERN Stack**:
- **M**ongoDB — Database
- **E**xpress.js — Backend framework
- **R**eact — Frontend UI
- **N**ode.js — Runtime environment

---

## 🗂 Project Structure

```
trio-academy/
├── backend/                  ← Express + MongoDB API
│   ├── server.js             ← Entry point
│   ├── .env                  ← Environment variables
│   ├── models/
│   │   ├── User.js
│   │   ├── Tutorial.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── auth.js           ← Register / Login / Me
│   │   ├── tutorials.js      ← Full CRUD + search
│   │   ├── categories.js     ← Category management
│   │   └── admin.js          ← Stats & user management
│   └── middleware/
│       └── auth.js           ← JWT protect + adminOnly
│
└── frontend/                 ← React app
    ├── public/index.html
    └── src/
        ├── App.js            ← Routes
        ├── index.css         ← Global styles
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js / .css
        │   ├── Footer.js / .css
        │   ├── TutorialCard.js / .css
        │   └── SearchBar.js / .css
        └── pages/
            ├── Home.js / .css
            ├── Tutorials.js / .css
            ├── TutorialDetail.js / .css
            ├── AdminLogin.js / .css
            └── AdminPanel.js / .css
```

---

## ⚙️ Prerequisites

Install these before starting:
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local) **OR** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- [VS Code](https://code.visualstudio.com/)

---

## 🚀 Setup & Run

### Step 1 — Backend

```bash
cd trio-academy/backend
npm install
```

Edit `.env` with your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/trio_academy
JWT_SECRET=change_this_to_a_long_random_string
```

Start the backend:
```bash
npm run dev        # development (auto-restart with nodemon)
# or
npm start          # production
```

Backend runs at: **http://localhost:5000**

---

### Step 2 — Frontend

Open a **new terminal**, then:

```bash
cd trio-academy/frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

### Step 3 — Create your first Admin account

Use Postman, Thunder Client (VS Code extension), or curl:

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@trio.com",
  "password": "admin123",
  "role": "admin"
}
```

Then go to **http://localhost:3000/admin/login** and sign in.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Tutorials
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tutorials` | List all (search, category, page) |
| GET | `/api/tutorials/latest` | 6 latest tutorials |
| GET | `/api/tutorials/:id` | Single tutorial (increments views) |
| POST | `/api/tutorials` | Create (admin only) |
| PUT | `/api/tutorials/:id` | Update (admin only) |
| DELETE | `/api/tutorials/:id` | Delete (admin only) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Add category (admin only) |
| PUT | `/api/categories/:id` | Update category (admin only) |
| DELETE | `/api/categories/:id` | Delete category (admin only) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats (admin only) |
| GET | `/api/admin/users` | List all users (admin only) |
| DELETE | `/api/admin/users/:id` | Delete user (admin only) |

---

## ✨ Features

- 🏠 **Homepage** with hero, category chips, latest tutorials
- 🔍 **Search** tutorials by keyword
- 📂 **Filter** by category (HTML, CSS, JS, Java, Node.js...)
- 📄 **Tutorial Detail** page with view counter
- 🔐 **Admin Panel** with 4 tabs:
  - Dashboard stats (tutorials, categories, users, views)
  - Tutorials CRUD (create, edit, delete)
  - Categories CRUD
  - User management
- 🌙 Dark theme design
- 📱 Fully responsive

---

## 🛠 VS Code Recommended Extensions

- **Prettier** — Code formatter
- **ES7+ React/Redux Snippets**
- **Thunder Client** — API testing (alternative to Postman)
- **MongoDB for VS Code** — Browse your database
- **Auto Rename Tag** — HTML/JSX tag editing

---

## 👨‍💻 Team

| Name | Student ID | Role |
|------|-----------|------|
| Jannatul Islam Bakia Shifa | 111224111 | Frontend, Database |
| MD. Mofasserul Hoque Chowdhury | 111224144 | Backend, API |
| Munem Ashad | 111224145 | Full Stack, Testing |

---

*Submission Date: 19-04-2026*
# trio-academy
# trio-academy
