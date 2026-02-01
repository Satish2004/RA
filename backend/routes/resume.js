import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import axios from 'axios';
import { sendAnalysisEmail } from '../utils/email.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   POST /api/resume/upload
// @desc    Upload and analyze resume
// @access  Private
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload a PDF file' 
      });
    }

    const { jobRole } = req.body;
    if (!jobRole) {
      // Delete uploaded file if job role is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'Please select a job role' 
      });
    }

    // Read PDF file and send to AI service
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfBase64 = pdfBuffer.toString('base64');

    // Call AI service for analysis
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const analysisResponse = await axios.post(
      `${aiServiceUrl}/api/analyze`,
      {
        pdf_base64: pdfBase64,
        job_role: jobRole,
        filename: req.file.filename
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    const analysisData = analysisResponse.data;

    // Save analysis to database
    const resumeAnalysis = await ResumeAnalysis.create({
      user: req.user._id,
      jobRole,
      resumeFileName: req.file.originalname,
      resumePath: req.file.path,
      matchPercentage: analysisData.match_percentage,
      skillScores: analysisData.skill_scores,
      skillGaps: analysisData.skill_gaps,
      roadmap: analysisData.roadmap,
      extractedText: analysisData.extracted_text
    });

    // Send email notification
    try {
      await sendAnalysisEmail(
        req.user.email,
        req.user.name,
        jobRole,
        analysisData.match_percentage,
        analysisData.skill_gaps,
        resumeAnalysis._id
      );
      resumeAnalysis.emailSent = true;
      await resumeAnalysis.save();
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      data: resumeAnalysis
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: error.response.data?.message || 'AI service error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during resume analysis'
    });
  }
});

// @route   GET /api/resume/history
// @desc    Get user's analysis history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-extractedText');

    res.json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/resume/:id
// @desc    Get specific analysis
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select('-extractedText');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
