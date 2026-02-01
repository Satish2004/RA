# 🚀 Complete Step-by-Step Startup Guide

Follow these steps in order to start your AI Resume Analyzer project.

## ✅ Step 1: Verify Prerequisites

Before starting, ensure you have these installed:

### Check Node.js
```powershell
node --version
```
**Required:** v16 or higher  
**If not installed:** Download from https://nodejs.org/

### Check Python
```powershell
python --version
```
**Required:** v3.8 or higher  
**If not installed:** Download from https://www.python.org/

### Check MongoDB
**Option A - Local MongoDB:**
```powershell
mongod --version
```
**If not installed:** Download from https://www.mongodb.com/try/download/community

**Option B - MongoDB Atlas (Cloud - Recommended for beginners):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string

---

## 📦 Step 2: Install All Dependencies

From the project root directory (`d:\25jan`), run:

```powershell
npm run install:all
```

This will install:
- Root dependencies
- Frontend dependencies (React)
- Backend dependencies (Node.js/Express)
- Python AI service dependencies

**Note:** If the script fails, install manually:
```powershell
# Root
npm install

# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..

# AI Service
cd ai-service
pip install -r requirements.txt
cd ..
```

---

## ⚙️ Step 3: Set Up Environment Variables

### 3.1 Backend Configuration

1. Navigate to backend folder:
```powershell
cd backend
```

2. Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

3. Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer

JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Email Setup (Gmail):**
- Enable 2-factor authentication on your Gmail account
- Generate App Password: https://myaccount.google.com/apppasswords
- Use the generated app password in `EMAIL_PASS`

4. Go back to root:
```powershell
cd ..
```

### 3.2 AI Service Configuration

1. Navigate to ai-service folder:
```powershell
cd ai-service
```

2. Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

3. Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
# OR for MongoDB Atlas (same as backend):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer

OPENAI_API_KEY=your-openai-api-key-optional
YOUTUBE_API_KEY=your-youtube-api-key-optional
```

**Note:** OpenAI and YouTube API keys are optional. The service works without them.

4. Go back to root:
```powershell
cd ..
```

### 3.3 Frontend Configuration

1. Navigate to frontend folder:
```powershell
cd frontend
```

2. Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

3. The `.env` file should contain:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Go back to root:
```powershell
cd ..
```

---

## 📁 Step 4: Create Required Directories

Create the uploads directory for storing resume PDFs:

```powershell
mkdir backend\uploads
```

---

## 🗄️ Step 5: Start MongoDB

### If using Local MongoDB:
```powershell
mongod
```
Keep this terminal open. MongoDB will run in the foreground.

### If using MongoDB Atlas:
No need to start anything - it's cloud-based! Just make sure your connection string in `.env` files is correct.

---

## 🚀 Step 6: Start All Services

You need **3 separate terminal windows** running simultaneously:

### Terminal 1 - Frontend (React)
```powershell
cd d:\25jan
npm run dev:frontend
```
**Runs on:** http://localhost:3000

### Terminal 2 - Backend (Node.js/Express)
```powershell
cd d:\25jan
npm run dev:backend
```
**Runs on:** http://localhost:5000

### Terminal 3 - AI Service (Python/FastAPI)
```powershell
cd d:\25jan
npm run dev:ai
```
**Runs on:** http://localhost:8000

**Alternative for AI Service (if npm script doesn't work):**
```powershell
cd d:\25jan\ai-service
python -m uvicorn main:app --reload --port 8000
```

---

## ✅ Step 7: Verify Everything is Running

1. **Check Frontend:** Open http://localhost:3000 in your browser
   - You should see the application homepage

2. **Check Backend:** Open http://localhost:5000/api/auth/me
   - Should return an error (expected - not authenticated)

3. **Check AI Service:** Open http://localhost:8000/docs
   - Should show FastAPI documentation page

---

## 🎯 Step 8: Test the Application

1. **Open the app:** http://localhost:3000

2. **Register a new account:**
   - Click "Register" or "Sign Up"
   - Fill in your details
   - Submit

3. **Upload a resume:**
   - Login with your account
   - Go to "Upload Resume"
   - Select a PDF file
   - Choose a target job role
   - Submit and wait for analysis

4. **View results:**
   - See skill gap analysis
   - Check personalized roadmap
   - Try the chatbot feature

---

## 🔧 Troubleshooting

### Issue: Port already in use
**Solution:** Change the port in `.env` files and update corresponding URLs

### Issue: MongoDB connection failed
**Solution:** 
- Check if MongoDB is running (local) or connection string is correct (Atlas)
- Verify `MONGODB_URI` in both `backend/.env` and `ai-service/.env`

### Issue: Python dependencies error
**Solution:** Use virtual environment:
```powershell
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: Email not sending
**Solution:**
- Verify Gmail app password is correct
- Check email credentials in `backend/.env`
- Check spam folder

### Issue: PDF upload fails
**Solution:**
- Ensure `backend/uploads` directory exists
- Check file size (max 5MB)
- Verify file is PDF format

### Issue: NLTK data missing
**Solution:** The service will auto-download on first run, or manually:
```powershell
cd ai-service
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
```

---

## 📝 Quick Reference

### All Services Running:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000
- ✅ AI Service: http://localhost:8000

### Important Files:
- Backend config: `backend/.env`
- AI Service config: `ai-service/.env`
- Frontend config: `frontend/.env`

### Stop All Services:
Press `Ctrl+C` in each terminal window

---

## 🎉 You're All Set!

Your AI Resume Analyzer is now running. Start analyzing resumes and building your career roadmap!

For more details, see:
- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Detailed setup instructions
