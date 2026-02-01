import express from 'express';
import { protect } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

// @route   POST /api/chatbot/message
// @desc    Send message to AI chatbot
// @access  Private
router.post('/message', protect, async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Call AI service for chatbot response
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const chatbotResponse = await axios.post(
      `${aiServiceUrl}/api/chatbot`,
      {
        message,
        context: context || {},
        user_id: req.user._id.toString()
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    res.json({
      success: true,
      response: chatbotResponse.data.response
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: error.response.data?.message || 'AI service error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during chatbot interaction'
    });
  }
});

export default router;
