from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import base64
import io
import os
from dotenv import load_dotenv

from services.resume_analyzer import ResumeAnalyzer
from services.chatbot import CareerChatbot

load_dotenv()

app = FastAPI(title="Resume Analyzer AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
resume_analyzer = ResumeAnalyzer()
chatbot = CareerChatbot()

class AnalyzeRequest(BaseModel):
    pdf_base64: str
    job_role: str
    filename: str

class ChatbotRequest(BaseModel):
    message: str
    context: Optional[Dict] = {}
    user_id: Optional[str] = None

@app.get("/")
def root():
    return {"message": "Resume Analyzer AI Service is running", "status": "OK"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.post("/api/analyze")
async def analyze_resume(request: AnalyzeRequest):
    try:
        # Decode base64 PDF
        pdf_bytes = base64.b64decode(request.pdf_base64)
        pdf_file = io.BytesIO(pdf_bytes)
        
        # Analyze resume
        analysis_result = await resume_analyzer.analyze(
            pdf_file=pdf_file,
            job_role=request.job_role
        )
        
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.post("/api/chatbot")
async def chatbot_message(request: ChatbotRequest):
    try:
        response = await chatbot.get_response(
            message=request.message,
            context=request.context,
            user_id=request.user_id
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
