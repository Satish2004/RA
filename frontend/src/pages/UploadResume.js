import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './UploadResume.css';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const jobRoles = [
    'AI Engineer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    
    if (!jobRole) {
      toast.error('Please select a job role');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobRole', jobRole);

    try {
      const response = await axios.post(`${API_URL}/resume/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });

      toast.success('Resume analyzed successfully!');
      navigate(`/analysis/${response.data.data._id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="upload-header">
        <h1>Upload Your Resume</h1>
        <p>Get AI-powered analysis and personalized career guidance</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Select Job Role</label>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
            >
              <option value="">Choose a target job role...</option>
              {jobRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Upload Resume (PDF only, max 5MB)</label>
            <div className="file-upload-area">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
                id="resume-upload"
                required
              />
              <label htmlFor="resume-upload" className="file-label">
                {file ? file.name : 'Choose PDF file or drag and drop'}
              </label>
            </div>
            {file && (
              <p className="file-info">✓ {file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !file || !jobRole}
          >
            {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
          </button>
        </form>
      </div>

      <div className="info-card">
        <h3>📋 What happens next?</h3>
        <ul>
          <li>Your resume will be analyzed using AI/ML techniques</li>
          <li>We'll calculate a match percentage for your selected role</li>
          <li>Skill gaps will be identified and a roadmap will be generated</li>
          <li>You'll receive an email with the analysis results</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadResume;
