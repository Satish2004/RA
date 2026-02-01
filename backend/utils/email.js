import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendAnalysisEmail = async (email, name, jobRole, matchPercentage, skillGaps, analysisId) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const analysisLink = `${frontendUrl}/analysis/${analysisId}`;

    const skillGapsList = skillGaps.length > 0 
      ? skillGaps.map(gap => `• ${gap}`).join('\n')
      : 'None - Great job!';

    const mailOptions = {
      from: `"Resume Analyzer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Resume Analysis Complete - ${jobRole}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .score { font-size: 48px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .skill-gaps { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Resume Analysis Complete! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Your resume has been analyzed for the <strong>${jobRole}</strong> position.</p>
              
              <div class="score">${matchPercentage}%</div>
              <p style="text-align: center; font-size: 18px;">Match Score</p>
              
              <div class="skill-gaps">
                <h3>Skill Gaps Identified:</h3>
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${skillGapsList}</pre>
              </div>
              
              <p>We've generated a personalized learning roadmap to help you bridge these gaps and improve your resume match score.</p>
              
              <div style="text-align: center;">
                <a href="${analysisLink}" class="button">View Full Analysis & Roadmap</a>
              </div>
              
              <div class="footer">
                <p>This is an automated email from the Resume Analyzer Platform.</p>
                <p>If you have any questions, feel free to use our AI chatbot on the platform.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};
