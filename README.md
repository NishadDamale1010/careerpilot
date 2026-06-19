# 🚀 CareerPilot

**CareerPilot** is an intelligent, AI-powered career coaching and job-matching platform built on the MERN stack. It analyzes your resume, tracks your skill gaps, and matches you with real-time job postings tailored precisely to your background and aspirations.

---

## ✨ Features

- 🧠 **AI Resume Parsing:** Upload your PDF resume and let our AI automatically extract your skills, experience level, and professional role.
- 🎯 **Smart Job Matching:** Gets real-time, non-fake job recommendations (via JSearch API) intelligently filtered against your specific skill set.
- 📊 **Skill Gap Analysis:** Highlights which requested skills you're missing for jobs you want, giving you actionable learning targets.
- 🤖 **AI Career Coach:** Chat with an integrated LLM powered by Groq (`llama-3.3-70b-versatile`) for personalized interview prep, roadmap generation, and career advice.
- 💼 **Application Tracking:** Save jobs, track your application status, and manage your entire job hunt from a unified dashboard.
- 🛡️ **Enterprise-Grade Security:** Fully secured backend with Helmet headers, Rate Limiting, NoSQL injection prevention (`express-mongo-sanitize`), and strict CORS policies.

---

## 🛠️ Technology Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS v4
- React Router DOM
- Context API for state and Dark/Light Mode theming

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- Groq Cloud API (Llama 3.3 for AI processing)
- JSearch API (RapidAPI for live job fetching)
- `pdf-parse` (for extracting text from uploaded resumes)
- Security: `helmet`, `express-rate-limit`, `cors`

---

## 📂 Project Structure

```text
careerpilot/
├── client/                 # React Frontend (Vite)
│   ├── public/             # Static assets & deployment redirects
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Sidebar, Cards)
│   │   ├── context/        # Theme & Auth contexts
│   │   ├── pages/          # Main route views (Dashboard, Resume, Settings)
│   │   └── services/       # API abstraction layer
│   └── vite.config.js      # Vite bundler config
│
└── server/                 # Node/Express Backend
    ├── src/
    │   ├── config/         # MongoDB connection strings
    │   ├── controllers/    # Route logic & AI integration
    │   ├── middleware/     # Auth checks & File uploads
    │   ├── models/         # Mongoose DB Schemas
    │   └── routes/         # Express router endpoints
    └── server.js           # App entrypoint & security middleware
```

---

## ⚙️ Local Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### 2. Clone the repository
```bash
git clone https://github.com/yourusername/careerpilot.git
cd careerpilot
```

### 3. Setup the Backend
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# External APIs
GROQ_API_KEY=your_groq_api_key
RAPID_API_KEY=your_rapidapi_jsearch_key

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```
Run the backend development server:
```bash
npm run dev
```

### 4. Setup the Frontend
Open a second terminal and navigate to the `client` directory:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

---

## 🚀 Deployment Guides

### Backend (Render / Heroku)
1. Add your repository to your hosting provider.
2. Set the Build Command to `npm install` and Start Command to `npm start` (ensure your working directory is set to `server/`).
3. Add all your `.env` variables to the provider's Environment settings.

### Frontend (Vercel / Netlify)
1. Import the repository into Vercel/Netlify.
2. Set the Root Directory to `client/`.
3. Framework Preset: **Vite**.
4. Add the environment variable: `VITE_API_URL=https://your-deployed-backend-url.com/api`.
5. *Note:* A `vercel.json` and `public/_redirects` file are already included to gracefully handle React Router SPA redirects in production.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/yourusername/careerpilot/issues).

## 📝 License
This project is licensed under the MIT License.
