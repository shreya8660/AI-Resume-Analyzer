# 🤖 AI Resume Analyzer

A full-stack SaaS application that analyzes resumes using Google Gemini AI and provides ATS scoring, skill gap analysis, grammar checking, job match percentage, AI rewriting, cover letter generation, and interview preparation.

---

## 🚀 Features

| Feature | Description |
|---|---|
| **ATS Score** | Analyze resume structure and ATS compatibility (0–100) |
| **Grammar Check** | Detect grammar issues, spelling errors, and weak verbs |
| **Skill Gap Analysis** | Compare your skills with industry requirements |
| **Improvement Suggestions** | Prioritized AI recommendations for every section |
| **Job Match %** | Paste a job description, get a match percentage |
| **AI Rewriter** | Rewrite bullet points with stronger language |
| **Cover Letter Generator** | AI-generated, job-tailored cover letter |
| **Interview Prep** | Technical, behavioral, project, and HR questions |
| **Dashboard** | Overview of all analysis scores and results |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router v6, Recharts  
**Backend:** Node.js, Express.js, Multer, pdf-parse, Mammoth  
**Database:** MongoDB with Mongoose  
**AI:** Google Gemini 1.5 Flash API  

---

## 📁 Folder Structure

```
ai-resume-analyzer/
├── backend/
│   ├── controllers/
│   │   ├── resume.controller.js      # File upload & parsing
│   │   └── analysis.controller.js   # All 8 AI analysis endpoints
│   ├── middleware/
│   │   └── upload.middleware.js      # Multer config
│   ├── models/
│   │   └── resume.model.js           # MongoDB schema
│   ├── routes/
│   │   ├── resume.routes.js
│   │   └── analysis.routes.js
│   ├── utils/
│   │   └── gemini.js                 # Gemini AI helper
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/Layout.jsx     # Sidebar + header
    │   │   └── ui/                   # Reusable components
    │   ├── context/
    │   │   ├── ResumeContext.jsx     # Global resume state
    │   │   └── ThemeContext.jsx      # Dark/light mode
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── UploadPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ATSPage.jsx
    │   │   ├── GrammarPage.jsx
    │   │   ├── SkillsPage.jsx
    │   │   ├── ImprovementsPage.jsx
    │   │   ├── JobMatchPage.jsx
    │   │   ├── RewritePage.jsx
    │   │   ├── CoverLetterPage.jsx
    │   │   └── InterviewPage.jsx
    │   ├── utils/api.js              # Axios API client
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API Key → [Get one here](https://makersuite.google.com/app/apikey)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
```

Start the backend:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

### 4. MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# Start the service
mongod --dbpath /data/db
```

**MongoDB Atlas (recommended for production):**
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get your connection string
3. Replace `MONGODB_URI` in `.env`

---

## 🔌 API Endpoints

### Resume
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/upload` | Upload PDF/DOCX, extract text |
| `GET` | `/api/resume` | Get recent resumes |
| `GET` | `/api/resume/:id` | Get resume by ID |

### Analysis
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/analysis/ats` | `{ resumeId }` | ATS score |
| `POST` | `/api/analysis/grammar` | `{ resumeId }` | Grammar check |
| `POST` | `/api/analysis/skills` | `{ resumeId, jobRole }` | Skill gap |
| `POST` | `/api/analysis/improvements` | `{ resumeId }` | Suggestions |
| `POST` | `/api/analysis/job-match` | `{ resumeId, jobDescription }` | Match % |
| `POST` | `/api/analysis/rewrite` | `{ resumeId }` | AI rewrite |
| `POST` | `/api/analysis/cover-letter` | `{ resumeId, jobDescription, companyName, jobTitle }` | Cover letter |
| `POST` | `/api/analysis/interview-questions` | `{ resumeId, jobRole? }` | Interview Qs |

---

## 🚢 Deployment

### Backend (Railway / Render)
1. Push to GitHub
2. Connect to Railway/Render
3. Set environment variables: `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`
4. Deploy

### Frontend (Vercel / Netlify)
1. Set build command: `npm run build`
2. Set output directory: `dist`
3. Set environment variable: `VITE_API_URL=https://your-backend.railway.app`
4. Update `vite.config.js` proxy OR use full URL in `api.js`

---

## 🌙 Dark Mode
Click the moon/sun icon in the top-right to toggle dark mode. The preference is saved to `localStorage`.

---

## 🔒 Security Notes
- Rate limiting is enabled (100 requests/15 min per IP)
- File upload limited to PDF/DOCX, max 10MB
- All AI calls are server-side; the Gemini key is never exposed to the frontend

---

## 📜 License
MIT
