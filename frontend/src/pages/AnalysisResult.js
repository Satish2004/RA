import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthContext from '../context/AuthContext';
import './AnalysisResult.css';

const AnalysisResult = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/resume/${id}`);
      setAnalysis(response.data.data);
    } catch (error) {
      toast.error('Failed to load analysis');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analysis...</div>;
  }

  if (!analysis) {
    return (
      <div className="container">
        <div className="error">Analysis not found</div>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const matchPercentage = analysis.matchPercentage;
  const skillScores = analysis.skillScores || [];
  const skillGaps = analysis.skillGaps || [];
  const roadmap = analysis.roadmap || [];

  // Prepare data for charts
  const pieData = [
    { name: 'Match', value: matchPercentage },
    { name: 'Gap', value: 100 - matchPercentage }
  ];

  const barData = skillScores.map(skill => ({
    name: skill.skill.length > 15 ? skill.skill.substring(0, 15) + '...' : skill.skill,
    score: skill.score,
    status: skill.status
  }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'strong': return '#28a745';
      case 'moderate': return '#ffc107';
      case 'weak': return '#fd7e14';
      default: return '#dc3545';
    }
  };

  return (
    <div className="container">
      <div className="analysis-header">
        <h1>Resume Analysis Results</h1>
        <p className="job-role">Target Role: <strong>{analysis.jobRole}</strong></p>
      </div>

      {/* Match Percentage Card */}
      <div className="card match-card">
        <h2>Resume Match Score</h2>
        <div className="match-display">
          <div className="match-circle">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="match-percentage">
              <span className="percentage-value">{matchPercentage.toFixed(1)}%</span>
              <span className="percentage-label">Match</span>
            </div>
          </div>
        </div>
        <div className="match-feedback">
          {matchPercentage >= 80 ? (
            <p className="feedback-excellent">🎉 Excellent! Your resume is well-aligned with this role.</p>
          ) : matchPercentage >= 60 ? (
            <p className="feedback-good">👍 Good match! Some improvements can boost your score further.</p>
          ) : (
            <p className="feedback-needs-work">💪 There's room for improvement. Follow the roadmap below!</p>
          )}
        </div>
      </div>

      {/* Skill Scores Chart */}
      <div className="card">
        <h2>Skill-wise Score Breakdown</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Scores Table */}
      <div className="card">
        <h2>Detailed Skill Analysis</h2>
        <div className="skill-table">
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {skillScores.map((skill, idx) => (
                <tr key={idx}>
                  <td>{skill.skill}</td>
                  <td>{skill.score.toFixed(1)}%</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(skill.status) }}
                    >
                      {skill.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skill Gaps */}
      {skillGaps.length > 0 && (
        <div className="card skill-gaps-card">
          <h2>🔍 Identified Skill Gaps</h2>
          <div className="skill-gaps-list">
            {skillGaps.map((gap, idx) => (
              <div key={idx} className="gap-item">
                <span className="gap-icon">⚠️</span>
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Roadmap */}
      {roadmap.length > 0 && (
        <div className="card roadmap-card">
          <h2>🗺️ Personalized Learning Roadmap</h2>
          <p className="roadmap-intro">
            Follow this step-by-step path to bridge your skill gaps and improve your resume match score.
          </p>
          {roadmap.map((item, idx) => (
            <div key={idx} className="roadmap-item">
              <div className="roadmap-header">
                <h3>{item.skill}</h3>
                <div className="roadmap-meta">
                  <span className="level-badge">{item.level}</span>
                  <span className="time-estimate">⏱️ {item.estimatedTime}</span>
                </div>
              </div>
              
              <div className="roadmap-steps">
                <h4>Learning Steps:</h4>
                <ol>
                  {item.steps.map((step, stepIdx) => (
                    <li key={stepIdx}>{step}</li>
                  ))}
                </ol>
              </div>

              {item.youtubeLinks && item.youtubeLinks.length > 0 && (
                <div className="youtube-links">
                  <h4>📺 Recommended Learning Resources:</h4>
                  <div className="video-links">
                    {item.youtubeLinks.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-link"
                      >
                        <span className="video-icon">▶️</span>
                        <div className="video-info">
                          <span className="video-title">{link.title}</span>
                          <span className="video-channel">{link.channel}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="action-buttons">
        <Link to="/upload" className="btn btn-primary">Analyze Another Resume</Link>
        <Link to="/history" className="btn btn-secondary">View History</Link>
      </div>
    </div>
  );
};

export default AnalysisResult;
