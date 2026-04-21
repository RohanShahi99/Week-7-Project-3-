# TaskFlow 🗂️

A full-stack SPA for project and task management built with **React + Express + MongoDB**.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Vite, SASS |
| Backend | Express.js, MongoDB, Mongoose |
| Auth | JWT (httpOnly cookies), bcryptjs |
| Session | express-session + cookie-parser |
| Styling | SASS (.scss), Bootstrap 5 |
| PWA | vite-plugin-pwa (manifest + service worker) |
| Security | SSL/HTTPS, httpOnly cookies, CORS |

---

## Project Structure

```
taskflow/
├── client/                  # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── AppLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Tasks.jsx
│   │   ├── scss/
│   │   │   └── main.scss
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                  # Express backend
    ├── middleware/
    │   └── auth.js          # JWT protection middleware
    ├── models/
    │   ├── Project.js
    │   ├── Task.js
    │   └── User.js
    ├── routes/
    │   ├── auth.js          # Signup / Login / Logout / Me
    │   ├── projects.js
    │   └── tasks.js
    ├── .env.example
    ├── index.js
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your MONGO_URI and secrets
```

### 3. Run in Development

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev     # runs on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev     # runs on http://localhost:5173
```

---

## SSL Setup

### Development (self-signed cert)

```bash
cd server
mkdir certs
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes
```

Then in `server/index.js` the production branch will pick them up automatically.

### Production (Let's Encrypt)

```bash
sudo certbot certonly --standalone -d yourdomain.com
# Certs go to /etc/letsencrypt/live/yourdomain.com/
# Update paths in server/index.js
```

---

## Deployment (Live Server)

### Option A — Render.com (Free)

1. Push to GitHub
2. Create a **Web Service** on Render pointing to `/server`
3. Set environment variables in Render dashboard
4. Create a **Static Site** on Render pointing to `/client`, build command: `npm run build`, publish dir: `dist`

### Option B — Railway

```bash
# From /server
railway init && railway up

# From /client — build and serve via express static or Netlify
npm run build
```

### Option C — VPS (DigitalOcean / Linode)

```bash
# On server
pm2 start index.js --name taskflow-api
nginx # reverse proxy :5000 → :443 with SSL
```

---

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, sets httpOnly cookie |
| POST | `/api/auth/logout` | Logout, clears cookie |
| GET | `/api/auth/me` | Get current user |

### Tasks (requires auth)
| Method | Route | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (filterable) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Projects (requires auth)
| Method | Route | Description |
|---|---|---|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project + its tasks |

---

## PWA Features

- Installable on desktop and mobile
- Offline-ready (service worker caches assets)
- API calls cached with NetworkFirst strategy
- Manifest with icons, theme color, standalone display

---

## Submission Checklist

- [x] React SPA with add/update functionality
- [x] Express + MongoDB + Mongoose backend
- [x] SASS (.scss) styling
- [x] SSL support (dev: self-signed, prod: Let's Encrypt)
- [x] Signup / Login / Logout with JWT Auth
- [x] Authorization (owner-scoped queries)
- [x] Sessions (express-session) + Cookies (httpOnly JWT)
- [x] PWA (manifest + service worker via vite-plugin-pwa)
- [x] Responsive design (mobile sidebar toggle)
- [x] Form validation (client-side + server-side)
- [ ] Push to GitHub
- [ ] Deploy to live server
