from typing import Dict, Optional
import os

class CareerChatbot:
    def __init__(self):
        self.context_memory = {}
        self.responses = {
            "greeting": [
                "Hello! I'm your career guidance assistant. How can I help you today?",
                "Hi there! Ready to boost your career? What would you like to know?",
                "Welcome! I'm here to help with your career questions. What can I assist you with?"
            ],
            "skill_gap": [
                "Based on your resume analysis, I recommend focusing on the identified skill gaps. Would you like me to suggest specific learning resources?",
                "Skill gaps are opportunities for growth! Let's create a learning plan together.",
                "I can help you bridge those skill gaps. Which skill would you like to start with?"
            ],
            "roadmap": [
                "A personalized roadmap is a great way to track your progress. Would you like me to explain any step in detail?",
                "Following a structured roadmap will help you stay focused. Need help with any specific skill?",
                "Your roadmap is designed to take you from beginner to advanced. Let's discuss your learning goals!"
            ],
            "resume": [
                "A well-crafted resume is crucial. Focus on highlighting relevant skills and achievements.",
                "Your resume should be tailored to each job role. I can help you improve it!",
                "Resume optimization is key. Let's work on making yours stand out!"
            ],
            "career": [
                "Career growth requires continuous learning and skill development. What area interests you most?",
                "Building a successful career takes planning. I'm here to guide you!",
                "Every expert was once a beginner. Let's plan your career journey together!"
            ],
            "default": [
                "That's an interesting question! Could you provide more context?",
                "I'd be happy to help! Can you tell me more about what you're looking for?",
                "Let me help you with that. Could you elaborate a bit more?"
            ]
        }
    
    def _classify_intent(self, message: str) -> str:
        """Classify user intent from message"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["hello", "hi", "hey", "greetings"]):
            return "greeting"
        elif any(word in message_lower for word in ["skill", "gap", "missing", "weak"]):
            return "skill_gap"
        elif any(word in message_lower for word in ["roadmap", "path", "plan", "learn"]):
            return "roadmap"
        elif any(word in message_lower for word in ["resume", "cv", "curriculum"]):
            return "resume"
        elif any(word in message_lower for word in ["career", "job", "position", "role"]):
            return "career"
        else:
            return "default"
    
    def _get_contextual_response(self, intent: str, context: Dict, message: str) -> str:
        """Generate contextual response based on intent and context"""
        import random
        
        if intent == "greeting":
            return random.choice(self.responses["greeting"])
        
        elif intent == "skill_gap":
            if "skill_gaps" in context and context["skill_gaps"]:
                gaps = context["skill_gaps"][:3]  # Top 3 gaps
                return f"I see you have skill gaps in: {', '.join(gaps)}. Would you like me to suggest learning resources for any of these?"
            return random.choice(self.responses["skill_gap"])
        
        elif intent == "roadmap":
            if "roadmap" in context and context["roadmap"]:
                return "Your personalized roadmap is ready! It includes step-by-step learning paths. Which skill would you like to focus on first?"
            return random.choice(self.responses["roadmap"])
        
        elif intent == "resume":
            if "match_percentage" in context:
                score = context["match_percentage"]
                if score < 50:
                    return f"Your current match score is {score}%. Let's work on improving it by focusing on the identified skill gaps!"
                elif score < 75:
                    return f"Your match score is {score}% - good progress! With some targeted learning, you can reach 80%+."
                else:
                    return f"Great job! Your match score is {score}%. Keep maintaining and updating your skills!"
            return random.choice(self.responses["resume"])
        
        elif intent == "career":
            if "job_role" in context:
                role = context["job_role"]
                return f"Pursuing a career as a {role} is exciting! I can help you create a learning plan to achieve your goals."
            return random.choice(self.responses["career"])
        
        else:
            # Try to provide helpful default response
            if "python" in message.lower():
                return "Python is a great language to learn! It's versatile and widely used. Would you like resources for learning Python?"
            elif "react" in message.lower():
                return "React is excellent for frontend development! I can suggest learning paths and projects."
            elif "machine learning" in message.lower() or "ml" in message.lower():
                return "Machine Learning is a fascinating field! Start with Python and data science fundamentals."
            else:
                return random.choice(self.responses["default"])
    
    async def get_response(self, message: str, context: Optional[Dict] = None, user_id: Optional[str] = None) -> str:
        """Get chatbot response"""
        if context is None:
            context = {}
        
        # Classify intent
        intent = self._classify_intent(message)
        
        # Get contextual response
        response = self._get_contextual_response(intent, context, message)
        
        # Store context for future interactions
        if user_id:
            if user_id not in self.context_memory:
                self.context_memory[user_id] = {}
            self.context_memory[user_id].update(context)
        
        return response
