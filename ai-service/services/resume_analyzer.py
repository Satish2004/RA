import pdfplumber
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import Dict, List, Any
import io

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)

class ResumeAnalyzer:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        self.job_role_requirements = self._load_job_requirements()
        self.skill_keywords = self._load_skill_keywords()
        
    def _load_job_requirements(self) -> Dict[str, Dict]:
        """Define job role requirements and expected skills"""
        return {
            "AI Engineer": {
                "required_skills": [
                    "python", "machine learning", "deep learning", "neural networks",
                    "tensorflow", "pytorch", "nlp", "computer vision", "data science",
                    "pandas", "numpy", "scikit-learn", "keras", "opencv"
                ],
                "weighted_skills": {
                    "python": 0.15,
                    "machine learning": 0.15,
                    "deep learning": 0.12,
                    "tensorflow": 0.10,
                    "pytorch": 0.10,
                    "nlp": 0.08,
                    "computer vision": 0.08,
                    "data science": 0.07,
                    "pandas": 0.05,
                    "numpy": 0.05,
                    "scikit-learn": 0.05
                }
            },
            "Backend Developer": {
                "required_skills": [
                    "node.js", "express", "python", "java", "spring boot",
                    "rest api", "database", "mongodb", "postgresql", "mysql",
                    "docker", "kubernetes", "aws", "microservices", "git"
                ],
                "weighted_skills": {
                    "node.js": 0.12,
                    "express": 0.10,
                    "python": 0.10,
                    "java": 0.10,
                    "rest api": 0.10,
                    "database": 0.08,
                    "mongodb": 0.08,
                    "postgresql": 0.07,
                    "docker": 0.07,
                    "aws": 0.08,
                    "microservices": 0.05,
                    "git": 0.05
                }
            },
            "Full Stack Developer": {
                "required_skills": [
                    "react", "javascript", "node.js", "express", "html", "css",
                    "mongodb", "postgresql", "rest api", "git", "docker",
                    "aws", "typescript", "redux", "next.js", "vue.js"
                ],
                "weighted_skills": {
                    "react": 0.12,
                    "javascript": 0.12,
                    "node.js": 0.10,
                    "express": 0.08,
                    "html": 0.05,
                    "css": 0.05,
                    "mongodb": 0.08,
                    "rest api": 0.08,
                    "git": 0.05,
                    "docker": 0.06,
                    "aws": 0.06,
                    "typescript": 0.08,
                    "redux": 0.05,
                    "next.js": 0.04
                }
            },
            "Data Scientist": {
                "required_skills": [
                    "python", "machine learning", "data analysis", "pandas",
                    "numpy", "scikit-learn", "sql", "statistics", "matplotlib",
                    "seaborn", "jupyter", "tensorflow", "pytorch"
                ],
                "weighted_skills": {
                    "python": 0.15,
                    "machine learning": 0.15,
                    "data analysis": 0.12,
                    "pandas": 0.10,
                    "numpy": 0.08,
                    "scikit-learn": 0.10,
                    "sql": 0.08,
                    "statistics": 0.08,
                    "matplotlib": 0.05,
                    "seaborn": 0.04,
                    "jupyter": 0.05
                }
            }
        }
    
    def _load_skill_keywords(self) -> Dict[str, List[str]]:
        """Map skills to various keyword variations"""
        return {
            "python": ["python", "python3", "py", "django", "flask", "fastapi"],
            "javascript": ["javascript", "js", "ecmascript", "es6", "es7"],
            "react": ["react", "reactjs", "react.js", "jsx"],
            "node.js": ["node", "nodejs", "node.js", "npm"],
            "machine learning": ["machine learning", "ml", "supervised learning", "unsupervised learning"],
            "deep learning": ["deep learning", "dl", "neural networks", "cnn", "rnn"],
            "tensorflow": ["tensorflow", "tf", "tensor flow"],
            "pytorch": ["pytorch", "torch"],
            "mongodb": ["mongodb", "mongo", "nosql"],
            "postgresql": ["postgresql", "postgres", "pg"],
            "docker": ["docker", "containerization", "containers"],
            "aws": ["aws", "amazon web services", "ec2", "s3", "lambda"],
            "git": ["git", "github", "gitlab", "version control"]
        }
    
    def extract_text_from_pdf(self, pdf_file: io.BytesIO) -> str:
        """Extract text from PDF file"""
        try:
            text = ""
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    def preprocess_text(self, text: str) -> str:
        """NLP preprocessing: tokenization, stopwords removal, lemmatization"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        
        # Tokenize
        tokens = word_tokenize(text)
        
        # Remove stopwords and lemmatize
        processed_tokens = [
            self.lemmatizer.lemmatize(token)
            for token in tokens
            if token not in self.stop_words and len(token) > 2
        ]
        
        return ' '.join(processed_tokens)
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text using keyword matching"""
        found_skills = []
        text_lower = text.lower()
        
        for skill, keywords in self.skill_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    if skill not in found_skills:
                        found_skills.append(skill)
                    break
        
        return found_skills
    
    def calculate_skill_scores(self, resume_skills: List[str], job_role: str) -> List[Dict]:
        """Calculate individual skill scores"""
        if job_role not in self.job_role_requirements:
            job_role = "Full Stack Developer"  # Default
        
        requirements = self.job_role_requirements[job_role]
        weighted_skills = requirements["weighted_skills"]
        required_skills = requirements["required_skills"]
        
        skill_scores = []
        resume_skills_lower = [s.lower() for s in resume_skills]
        
        for skill in required_skills:
            skill_lower = skill.lower()
            weight = weighted_skills.get(skill_lower, 0.05)
            
            # Check if skill exists in resume
            found = any(skill_lower in rs or rs in skill_lower for rs in resume_skills_lower)
            
            if found:
                score = min(weight * 100 * 2, 100)  # Boost found skills
                status = "strong" if score >= 70 else "moderate"
            else:
                score = 0
                status = "missing"
            
            skill_scores.append({
                "skill": skill,
                "score": round(score, 2),
                "status": status
            })
        
        return skill_scores
    
    def calculate_similarity(self, resume_text: str, job_role: str) -> float:
        """Calculate cosine similarity between resume and job requirements"""
        if job_role not in self.job_role_requirements:
            job_role = "Full Stack Developer"
        
        requirements = self.job_role_requirements[job_role]
        required_skills_text = ' '.join(requirements["required_skills"])
        
        # Preprocess both texts
        processed_resume = self.preprocess_text(resume_text)
        processed_requirements = self.preprocess_text(required_skills_text)
        
        # TF-IDF Vectorization
        vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform([processed_resume, processed_requirements])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        return float(similarity * 100)
    
    def detect_skill_gaps(self, skill_scores: List[Dict]) -> List[str]:
        """Identify missing or weak skills"""
        gaps = []
        for skill_data in skill_scores:
            if skill_data["status"] in ["missing", "weak"]:
                gaps.append(skill_data["skill"])
        return gaps
    
    def generate_roadmap(self, skill_gaps: List[str], job_role: str) -> List[Dict]:
        """Generate personalized learning roadmap"""
        if not skill_gaps:
            return []
        
        roadmap = []
        learning_levels = ["beginner", "intermediate", "advanced"]
        
        for skill in skill_gaps[:10]:  # Limit to top 10 gaps
            # Determine learning level based on skill complexity
            if skill in ["python", "javascript", "html", "css", "git"]:
                level = "beginner"
                time = "2-4 weeks"
            elif skill in ["react", "node.js", "express", "mongodb", "docker"]:
                level = "intermediate"
                time = "4-6 weeks"
            else:
                level = "advanced"
                time = "6-8 weeks"
            
            # Generate learning steps
            steps = self._generate_learning_steps(skill, level)
            
            # Get YouTube recommendations
            youtube_links = self._get_youtube_recommendations(skill)
            
            roadmap.append({
                "skill": skill,
                "level": level,
                "estimatedTime": time,
                "steps": steps,
                "youtubeLinks": youtube_links
            })
        
        return roadmap
    
    def _generate_learning_steps(self, skill: str, level: str) -> List[str]:
        """Generate step-by-step learning path"""
        steps_map = {
            "python": [
                "Learn Python basics: variables, data types, control structures",
                "Practice with functions, modules, and packages",
                "Work on projects: calculator, todo app, data analysis",
                "Learn advanced topics: OOP, decorators, generators"
            ],
            "react": [
                "Understand JavaScript ES6+ fundamentals",
                "Learn React basics: components, props, state",
                "Practice with hooks: useState, useEffect, useContext",
                "Build projects: todo app, weather app, e-commerce"
            ],
            "machine learning": [
                "Learn Python and data manipulation (Pandas, NumPy)",
                "Study statistics and linear algebra fundamentals",
                "Learn scikit-learn: supervised and unsupervised learning",
                "Build ML projects: classification, regression, clustering"
            ],
            "node.js": [
                "Master JavaScript fundamentals",
                "Learn Node.js basics: modules, file system, events",
                "Build REST APIs with Express.js",
                "Learn database integration and authentication"
            ]
        }
        
        default_steps = [
            f"Start with {skill} fundamentals and basics",
            f"Practice with hands-on projects",
            f"Build intermediate-level applications",
            f"Master advanced concepts and best practices"
        ]
        
        return steps_map.get(skill.lower(), default_steps)
    
    def _get_youtube_recommendations(self, skill: str) -> List[Dict]:
        """Get YouTube video recommendations for skills"""
        # Trusted channels and their content
        recommendations = {
            "python": [
                {"title": "Python Full Course for Beginners", "url": "https://www.youtube.com/watch?v=kqtD5dpn9C8", "channel": "freeCodeCamp.org"},
                {"title": "Python Tutorial - Python Full Course", "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc", "channel": "Programming with Mosh"}
            ],
            "react": [
                {"title": "React Full Course for Beginners", "url": "https://www.youtube.com/watch?v=bMknfKXIFA8", "channel": "freeCodeCamp.org"},
                {"title": "React Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=SqcY0GlETPk", "channel": "Programming with Mosh"}
            ],
            "machine learning": [
                {"title": "Machine Learning Full Course", "url": "https://www.youtube.com/watch?v=GwIo3gDZCVQ", "channel": "freeCodeCamp.org"},
                {"title": "Machine Learning Course", "url": "https://www.youtube.com/watch?v=aircAruvnKk", "channel": "3Blue1Brown"}
            ],
            "node.js": [
                {"title": "Node.js Full Course", "url": "https://www.youtube.com/watch?v=Oe421EPjBEo", "channel": "freeCodeCamp.org"},
                {"title": "Node.js Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=TlB_eWDSMt4", "channel": "Programming with Mosh"}
            ],
            "javascript": [
                {"title": "JavaScript Full Course", "url": "https://www.youtube.com/watch?v=jS4aFq5-91M", "channel": "freeCodeCamp.org"},
                {"title": "JavaScript Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=W6NZfCO5SIk", "channel": "Programming with Mosh"}
            ]
        }
        
        # Default recommendations
        default_recommendations = [
            {"title": f"{skill} Tutorial for Beginners", "url": f"https://www.youtube.com/results?search_query={skill}+tutorial", "channel": "YouTube Search"},
            {"title": f"Learn {skill} - Full Course", "url": f"https://www.youtube.com/results?search_query=learn+{skill}", "channel": "YouTube Search"}
        ]
        
        return recommendations.get(skill.lower(), default_recommendations)
    
    async def analyze(self, pdf_file: io.BytesIO, job_role: str) -> Dict[str, Any]:
        """Main analysis function"""
        # Extract text from PDF
        extracted_text = self.extract_text_from_pdf(pdf_file)
        
        if not extracted_text or len(extracted_text.strip()) < 50:
            raise Exception("Could not extract sufficient text from PDF")
        
        # Extract skills
        resume_skills = self.extract_skills(extracted_text)
        
        # Calculate skill scores
        skill_scores = self.calculate_skill_scores(resume_skills, job_role)
        
        # Calculate overall similarity/match percentage
        match_percentage = self.calculate_similarity(extracted_text, job_role)
        
        # Weighted match calculation based on skill scores
        weighted_match = sum(s["score"] for s in skill_scores) / len(skill_scores) if skill_scores else 0
        final_match = (match_percentage * 0.4 + weighted_match * 0.6)
        
        # Detect skill gaps
        skill_gaps = self.detect_skill_gaps(skill_scores)
        
        # Generate roadmap
        roadmap = self.generate_roadmap(skill_gaps, job_role)
        
        return {
            "match_percentage": round(final_match, 2),
            "skill_scores": skill_scores,
            "skill_gaps": skill_gaps,
            "roadmap": roadmap,
            "extracted_text": extracted_text[:500]  # First 500 chars for reference
        }
