# 🤖 AI Resume Analyzer

A full-stack AI-powered SaaS application that analyzes resumes using **Groq AI (Llama 3.3 70B)** and provides ATS scoring, skill gap analysis, grammar checking, job match percentage, AI rewriting, cover letter generation, interview preparation, and downloadable PDF reports.

**Live Demo:** [ai-resume-analyzer-frontend-an50.onrender.com]( https://ai-resume-analyzer-frontend-an50.onrender.com/)

---

## 🚀 Features

| Feature | Description |
|---|---|
| **📄 Resume Upload** | Drag & drop PDF or DOCX files up to 10MB |
| **🎯 ATS Score** | Analyze resume structure and ATS compatibility (0–100) |
| **✍️ Grammar Check** | Detect grammar issues, spelling errors, and weak verbs |
| **⚡ Skill Gap Analysis** | Compare your skills with industry requirements |
| **✨ Improvement Suggestions** | Prioritized AI recommendations for every section |
| **💼 Job Match %** | Paste a job description, get a match percentage |
| **🪄 AI Rewriter** | Rewrite bullet points with stronger language + download PDF |
| **📧 Cover Letter Generator** | AI-generated, job-tailored cover letter |
| **🎤 Interview Prep** | Technical, behavioral, project, and HR questions |
| **📊 Dashboard** | Overview of all scores, results, and download full report |
| **📥 PDF Report** | Download complete AI analysis report as PDF |
| **🌙 Dark / Light Mode** | Toggle between themes |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, React Router v6 |
| **Backend** | Node.js, Express.js, Multer, pdf-parse, Mammoth |
| **Database** | MongoDB Atlas with Mongoose |
| **AI** | Groq API — Llama 3.3 70B Versatile |
| **PDF Generation** | jsPDF |
| **Deployment** | Render (Frontend + Backend) |

---

## 📁 Folder Structure

```
ai-resume-analyzer/
├── backend/
│   ├── controllers/
│   │   ├── resume.controller.js       # File upload & text extraction
│   │   └── analysis.controller.js    # All 8 AI analysis endpoints
│   ├── middleware/
│   │   └── upload.middleware.js       # Multer config (PDF/DOCX, 10MB)
│   ├── models/
│   │   └── resume.model.js            # MongoDB schema
│   ├── routes/
│   │   ├── resume.routes.js
│   │   └── analysis.routes.js
│   ├── utils/
│   │   └── groq.js                    # Groq AI helper (Llama 3.3 70B)
│   ├── server.js                      # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── _redirects                 # Render SPA routing fix
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── Layout.jsx         # Sidebar + top navigation
    │   │   └── ui/
    │   │       ├── index.jsx          # Reusable UI components
    │   │       └── NoResume.jsx       # Guard for empty state
    │   ├── context/
    │   │   ├── ResumeContext.jsx      # Global resume & analysis state
    │   │   └── ThemeContext.jsx       # Dark/light mode
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── UploadPage.jsx
    │   │   ├── DashboardPage.jsx      # Scores + download report
    │   │   ├── ATSPage.jsx
    │   │   ├── GrammarPage.jsx
    │   │   ├── SkillsPage.jsx
    │   │   ├── ImprovementsPage.jsx
    │   │   ├── JobMatchPage.jsx
    │   │   ├── RewritePage.jsx        # AI rewrite + PDF download
    │   │   ├── CoverLetterPage.jsx
    │   │   └── InterviewPage.jsx
    │   ├── utils/
    │   │   ├── api.js                 # Axios API client
    │   │   └── reportGenerator.js     # Full PDF report builder
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API Key → [Get one free at console.groq.com](https://console.groq.com)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/shreya8660/AI-Resume-Analyzer.git
cd ai-resume-analyzer
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
GROQ_API_KEY=gsk_your_groq_api_key_here
NODE_ENV=development
```

Start the backend:
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

---

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

### Step 4 — MongoDB Setup

**Option A — Local MongoDB:**
```bash
mongod --dbpath /data/db
```

**Option B — MongoDB Atlas (recommended):**
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user and whitelist your IP
3. Get your connection string and add to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-resume-analyzer?retryWrites=true&w=majority
```

---

## 🔑 Getting a Groq API Key (Free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / Log in with Google
3. Click **"API Keys"** → **"Create API Key"**
4. Copy the key (starts with `gsk_`)
5. Add it to your `.env` as `GROQ_API_KEY`

**Free tier limits:** 14,400 requests/day · 30 requests/minute — more than enough for development.

---

## 🔌 API Endpoints

### Resume
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/upload` | Upload PDF/DOCX, extract text |
| `GET` | `/api/resume` | Get recent 10 resumes |
| `GET` | `/api/resume/:id` | Get resume by ID |
| `GET` | `/health` | Health check |

### Analysis
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/analysis/ats` | `{ resumeId }` | ATS score analysis |
| `POST` | `/api/analysis/grammar` | `{ resumeId }` | Grammar & writing check |
| `POST` | `/api/analysis/skills` | `{ resumeId, jobRole }` | Skill gap analysis |
| `POST` | `/api/analysis/improvements` | `{ resumeId }` | Improvement suggestions |
| `POST` | `/api/analysis/job-match` | `{ resumeId, jobDescription }` | Job match percentage |
| `POST` | `/api/analysis/rewrite` | `{ resumeId }` | AI resume rewriter |
| `POST` | `/api/analysis/cover-letter` | `{ resumeId, jobDescription, companyName, jobTitle }` | Cover letter |
| `POST` | `/api/analysis/interview-questions` | `{ resumeId, jobRole? }` | Interview questions |

---

## 🚢 Deployment on Render

### Step 1 — Setup MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Allow access from anywhere (`0.0.0.0/0`)
3. Copy your connection string

### Step 2 — Deploy Backend
1. Render → **New Web Service** → Connect GitHub repo
2. Settings:

| Field | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Instance Type | Free |

3. Environment Variables:

| Key | Value |
|---|---|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `your atlas connection string` |
| `GROQ_API_KEY` | `gsk_your_key` |

### Step 3 — Deploy Frontend
1. Render → **New Static Site** → Connect same repo
2. Settings:

| Field | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

3. Environment Variables:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.onrender.com` |

4. Add Rewrite Rule: `/*` → `/index.html` → `Rewrite`

### Step 4 — Update CORS
In `backend/server.js`, add your frontend URL to the CORS origin list and push to GitHub.

---

## 📥 PDF Downloads

| Feature | Download |
|---|---|
| **AI Rewriter** | Downloads rewritten resume as styled PDF |
| **Full Report** | Downloads complete analysis report as multi-page PDF |

Both use **jsPDF** for client-side PDF generation with no server required.

---

## 🔒 Security

- Rate limiting: 100 requests / 15 min per IP
- File upload: PDF/DOCX only, max 10MB
- All AI calls are server-side (API keys never exposed to frontend)
- Environment variables via `.env` (never committed to git)

---

## ⚠️ Free Tier Notes (Render)

- Backend **spins down** after 15 min of inactivity
- First request after sleep takes **30–60 seconds**
- Use [UptimeRobot](https://uptimerobot.com) to ping `/health` every 10 min to keep it awake

---

## 🐛 Common Issues

| Issue | Fix |
|---|---|
| `EADDRINUSE :5000` | Port in use — run `netstat -ano \| findstr :5000` then `taskkill /PID xxxx /F` |
| `404 on API calls` | Check `VITE_API_URL` has no trailing `/api` — just the base URL |
| `500 on AI calls` | Check `GROQ_API_KEY` is set in Render environment variables |
| `Not Found` on frontend | Add `/*` → `/index.html` rewrite rule in Render static site settings |
| Network error on upload | Backend is sleeping — wait 60s and try again |

---

## 📜 License

MIT — feel free to use, modify, and distribute.

---

## 👩‍💻 Built By

**Shreya** · [GitHub](https://github.com/shreya8660)

> Built with React, Node.js, MongoDB, Groq AI, and deployed on Render.
