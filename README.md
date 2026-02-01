# AI-Powered Resume Analyzer, Skill Gap Predictor & Personalized Career Roadmap Platform

A production-level, placement-ready AI/ML project that analyzes resumes, identifies skill gaps, and generates personalized learning roadmaps.

## 🎯 Features

- **Resume Analysis**: Upload PDF resumes and get AI-powered analysis
- **Skill Gap Detection**: Identify missing or weak skills for target job roles
- **Personalized Roadmaps**: Step-by-step learning paths from beginner to advanced
- **YouTube Recommendations**: Curated learning resources from trusted channels
- **AI Chatbot**: Context-aware career guidance assistant
- **Email Notifications**: Real-time analysis results via email

## 🛠️ Tech Stack

- **Frontend**: React.js with Charts and Dashboard UI
- **Backend**: Node.js + Express
- **AI/ML Service**: Python (FastAPI)
- **Database**: MongoDB
- **Authentication**: JWT
- **Email**: Nodemailer

## 📁 Project Structure

```
.
├── frontend/          # React.js application
├── backend/           # Node.js/Express API
├── ai-service/        # Python FastAPI ML service
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local or Atlas)
- npm/yarn

### Quick Start

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in `backend/` and `ai-service/`
   - Configure MongoDB connection, JWT secret, email credentials
   - See `SETUP.md` for detailed instructions

3. **Create uploads directory:**
```bash
mkdir backend/uploads
```

4. **Start development servers** (3 terminals):

**Terminal 1 - Frontend:**
```bash
npm run dev:frontend
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

**Terminal 3 - AI Service:**
```bash
npm run dev:ai
```

5. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Register a new account and start analyzing resumes!

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## 🔧 Configuration

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### AI Service (.env)
```
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resume Analysis
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume/history` - Get analysis history
- `GET /api/resume/:id` - Get specific analysis

### Chatbot
- `POST /api/chatbot/message` - Send message to AI chatbot

## 🤖 AI/ML Features

- PDF text extraction
- NLP preprocessing (tokenization, stopwords, lemmatization)
- Skill extraction using keyword mapping
- TF-IDF vectorization
- Cosine similarity for resume-job matching
- Weighted skill importance scoring
- Rule + ML-based roadmap generation

## 📝 License

MIT
