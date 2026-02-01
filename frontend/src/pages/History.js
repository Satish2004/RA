import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './History.css';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/resume/history`);
      setAnalyses(response.data.data);
    } catch (error) {
      toast.error('Failed to load history');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return <div className="loading">Loading history...</div>;
  }

  return (
    <div className="container">
      <div className="history-header">
        <h1>Analysis History</h1>
        <p>View all your previous resume analyses</p>
      </div>

      {analyses.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">📋</div>
          <h2>No analyses yet</h2>
          <p>Upload your first resume to get started!</p>
          <Link to="/upload" className="btn btn-primary">
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="history-grid">
          {analyses.map((analysis) => (
            <div key={analysis._id} className="history-card">
              <div className="history-card-header">
                <h3>{analysis.jobRole}</h3>
                <div
                  className="match-badge"
                  style={{ backgroundColor: getMatchColor(analysis.matchPercentage) }}
                >
                  {analysis.matchPercentage.toFixed(1)}% Match
                </div>
              </div>
              
              <div className="history-card-body">
                <div className="history-info">
                  <p><strong>Resume:</strong> {analysis.resumeFileName}</p>
                  <p><strong>Analyzed:</strong> {formatDate(analysis.createdAt)}</p>
                  <p><strong>Skill Gaps:</strong> {analysis.skillGaps?.length || 0} identified</p>
                  {analysis.emailSent && (
                    <p className="email-sent">✓ Email notification sent</p>
                  )}
                </div>
              </div>

              <div className="history-card-footer">
                <Link
                  to={`/analysis/${analysis._id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
