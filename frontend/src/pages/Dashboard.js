import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <div className="dashboard-hero">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p className="hero-subtitle">
          Get AI-powered insights into your resume and discover personalized learning paths
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📄</div>
          <h2>Upload Resume</h2>
          <p>Upload your resume and select a target job role to get started with AI analysis.</p>
          <Link to="/upload" className="btn btn-primary">
            Upload Now
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h2>View History</h2>
          <p>Check your previous resume analyses and track your progress over time.</p>
          <Link to="/history" className="btn btn-secondary">
            View History
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🎯</div>
          <h2>AI Analysis</h2>
          <p>Get detailed skill gap analysis and match percentage for your target role.</p>
          <Link to="/upload" className="btn btn-success">
            Analyze Resume
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>What You'll Get</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <h3>Resume Match Score</h3>
            <p>See how well your resume matches your target job role</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📈</span>
            <h3>Skill Gap Analysis</h3>
            <p>Identify missing or weak skills that need improvement</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🗺️</span>
            <h3>Personalized Roadmap</h3>
            <p>Get step-by-step learning paths from beginner to advanced</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎥</span>
            <h3>YouTube Resources</h3>
            <p>Access curated learning videos from trusted channels</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <h3>AI Chatbot</h3>
            <p>Get instant career guidance from our AI assistant</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📧</span>
            <h3>Email Notifications</h3>
            <p>Receive analysis results and updates via email</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
