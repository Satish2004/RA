# Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Python** (v3.8 or higher)
   - Download from: https://www.python.org/
   - Verify: `python --version`

3. **MongoDB**
   - Option 1: Local installation - https://www.mongodb.com/try/download/community
   - Option 2: MongoDB Atlas (cloud) - https://www.mongodb.com/cloud/atlas
   - Verify: `mongod --version` (if local)

4. **Git** (optional, for version control)

## Installation Steps

### 1. Install Dependencies

From the project root directory:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install Python AI service dependencies
cd ai-service
pip install -r requirements.txt
cd ..
```

Or use the convenience script:
```bash
npm run install:all
```

### 2. Set Up Environment Variables

#### Backend Configuration

1. Navigate to `backend/` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and configure:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   AI_SERVICE_URL=http://localhost:8000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

   **Email Setup (Gmail):**
   - Enable 2-factor authentication
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the app password in `EMAIL_PASS`

#### AI Service Configuration

1. Navigate to `ai-service/` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   ```

### 3. Create Required Directories

```bash
# Create uploads directory for backend
mkdir -p backend/uploads
```

### 4. Download NLTK Data (First Time Only)

The Python service will automatically download NLTK data on first run, but you can pre-download:

```bash
cd ai-service
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
```

## Running the Application

### Development Mode

You need **3 terminal windows** running simultaneously:

#### Terminal 1 - Frontend (React)
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

#### Terminal 2 - Backend (Node.js/Express)
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

#### Terminal 3 - AI Service (Python/FastAPI)
```bash
cd ai-service
python -m uvicorn main:app --reload --port 8000
```
AI Service will run on: http://localhost:8000

### Production Mode

1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start backend:
   ```bash
   cd backend
   npm start
   ```

3. Start AI service:
   ```bash
   cd ai-service
   python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Testing the Application

1. **Start MongoDB** (if using local):
   ```bash
   mongod
   ```

2. **Access the application:**
   - Open browser: http://localhost:3000
   - Register a new account
   - Upload a PDF resume
   - Select a job role
   - View analysis results

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check Atlas connection string
- Verify `MONGODB_URI` in `.env` files

### Port Already in Use
- Change ports in `.env` files if 3000, 5000, or 8000 are occupied
- Update `FRONTEND_URL` and `AI_SERVICE_URL` accordingly

### Python Dependencies Issues
- Use virtual environment:
  ```bash
  cd ai-service
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

### Email Not Sending
- Verify Gmail app password is correct
- Check email credentials in backend `.env`
- Check spam folder for test emails

### PDF Upload Fails
- Ensure `backend/uploads` directory exists
- Check file size (max 5MB)
- Verify file is PDF format

## Project Structure

```
.
├── frontend/          # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
├── backend/           # Node.js/Express API
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── ai-service/        # Python FastAPI ML service
│   ├── services/
│   │   ├── resume_analyzer.py
│   │   └── chatbot.py
│   └── main.py
└── README.md
```

## Next Steps

1. Customize job roles and skill requirements in `ai-service/services/resume_analyzer.py`
2. Add more YouTube recommendations
3. Enhance chatbot with OpenAI API (optional)
4. Deploy to cloud platforms (Heroku, AWS, etc.)
