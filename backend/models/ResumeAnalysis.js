import mongoose from 'mongoose';

const skillScoreSchema = new mongoose.Schema({
  skill: String,
  score: Number,
  status: {
    type: String,
    enum: ['strong', 'moderate', 'weak', 'missing'],
    default: 'missing'
  }
});

const roadmapItemSchema = new mongoose.Schema({
  skill: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  estimatedTime: String,
  steps: [String],
  youtubeLinks: [{
    title: String,
    url: String,
    channel: String
  }]
});

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true
  },
  resumeFileName: {
    type: String,
    required: true
  },
  resumePath: {
    type: String,
    required: true
  },
  matchPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  skillScores: [skillScoreSchema],
  skillGaps: [String],
  roadmap: [roadmapItemSchema],
  extractedText: {
    type: String,
    select: false
  },
  analysisDate: {
    type: Date,
    default: Date.now
  },
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
