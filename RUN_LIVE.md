# 🚀 Project Live Chalane Ka Step-by-Step Process

Teeno services (Backend, Frontend, AI-Service) ko live run karne ke liye ye steps follow karein.

---

## Pehle Ek Baar Setup (First-Time Only)

### Step 0.1 – Prerequisites check karein

```powershell
node --version    # v16+ hona chahiye
python --version  # v3.8+ hona chahiye
```

MongoDB: local (`mongod` chalana) ya Atlas ka connection string use karein.

### Step 0.2 – Dependencies install karein

Project root `d:\25jan` par jao aur run karein:

```powershell
cd d:\25jan
npm run install:all
```

### Step 0.3 – Environment files banao

**Backend:**  
`backend` folder mein `.env.example` ko copy karke `.env` banao aur apne values daalo (MongoDB URI, JWT_SECRET, email, etc.).

**AI Service:**  
`ai-service` folder mein `.env.example` ko copy karke `.env` banao aur `MONGODB_URI` daalo.

**Frontend:**  
`frontend` folder mein `.env.example` ko copy karke `.env` banao. Default: `REACT_APP_API_URL=http://localhost:5000/api`

### Step 0.4 – Uploads folder banao

```powershell
mkdir d:\25jan\backend\uploads
```

### Step 0.5 – MongoDB start karein (agar local use kar rahe ho)

```powershell
mongod
```

Is terminal ko open chhod dein.

---

## Live Run Karne Ke Steps (Har Baar)

**3 alag terminals chahiye.** Har terminal mein ek command.

### Terminal 1 – Backend (Node/Express)

```powershell
cd d:\25jan
npm run dev:backend
```

- **Port:** 5000  
- **Live:** http://localhost:5000  

Success hone par "Server running on port 5000" jaisa message aana chahiye.

---

### Terminal 2 – AI Service (Python/FastAPI)

```powershell
cd d:\25jan
npm run dev:ai
```

Agar ye fail ho to ye use karein:

```powershell
cd d:\25jan\ai-service
python -m uvicorn main:app --reload --port 8000
```

- **Port:** 8000  
- **Live:** http://localhost:8000  
- **Docs:** http://localhost:8000/docs  

---

### Terminal 3 – Frontend (React)

```powershell
cd d:\25jan
npm run dev:frontend
```

- **Port:** 3000  
- **Live:** http://localhost:3000  

Browser mein **http://localhost:3000** open karein – yahi se app use karenge.

---

## Summary – Teen Services Ek Saath

| Service    | Command              | Port | URL                    |
|-----------|----------------------|------|------------------------|
| Backend   | `npm run dev:backend`| 5000 | http://localhost:5000  |
| AI Service| `npm run dev:ai`     | 8000 | http://localhost:8000  |
| Frontend  | `npm run dev:frontend`| 3000| http://localhost:3000  |

**Order:** Pehle Backend aur AI Service start karein, phir Frontend. Phir browser mein **http://localhost:3000** khol kar app use karein.

---

## Band Kaise Karein

Har terminal mein **Ctrl + C** dabayein jahan service chal rahi hai.

---

## Agar Error Aaye

- **Port already in use:** Us port ko use karne wala dusra app band karein ya `.env` mein port change karein.
- **MongoDB error:** Local hai to `mongod` chal raha hai confirm karein; Atlas hai to connection string sahi hai check karein.
- **AI service / Python error:** `ai-service` folder mein `pip install -r requirements.txt` dobara chala kar dekhein.

Is process se teeno (backend, frontend, ai-service) live run ho jayenge.
