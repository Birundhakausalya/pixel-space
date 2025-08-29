import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage for demo (in production, use a real database)
const users = new Map();
const userProgress = new Map();
const certificates = new Map();

// Import route handlers
import { handleDemo } from './routes/demo.js';
import { handleSentimentAnalysis, handleGetExamples } from './routes/sentiment.js';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files (certificates, etc.)
  app.use('/static', express.static(path.join(__dirname, 'public')));

  // Basic routes
  app.get("/api/ping", (req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Sentiment Analysis routes
  app.post("/api/sentiment/analyze", handleSentimentAnalysis);
  app.get("/api/sentiment/examples", handleGetExamples);

  // User Management routes
  app.post("/api/users/create", (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      // Check if user already exists
      for (const [id, user] of users.entries()) {
        if (user.email === email) {
          return res.json({ 
            userId: id, 
            user: user,
            message: 'User already exists' 
          });
        }
      }

      const userId = uuidv4();
      const user = {
        id: userId,
        name,
        email,
        createdAt: new Date().toISOString()
      };

      users.set(userId, user);
      
      // Initialize progress
      userProgress.set(userId, {
        modulesCompleted: [],
        gamesPlayed: [],
        quizScores: [],
        totalScore: 0,
        certificatesEarned: [],
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      });

      res.json({ userId, user, message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Progress tracking routes
  app.post("/api/progress/update", (req, res) => {
    try {
      const { userId, type, data } = req.body;
      
      if (!userId || !type || !data) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!userProgress.has(userId)) {
        return res.status(404).json({ error: 'User not found' });
      }

      const progress = userProgress.get(userId);
      progress.lastActivity = new Date().toISOString();

      switch (type) {
        case 'module_completed':
          if (!progress.modulesCompleted.includes(data.moduleId)) {
            progress.modulesCompleted.push(data.moduleId);
            progress.totalScore += 20; 
          }
          break;
          
        case 'game_completed':
          progress.gamesPlayed.push({
            gameType: data.gameType,
            score: data.score,
            totalQuestions: data.totalQuestions,
            percentage: data.percentage,
            completedAt: new Date().toISOString()
          });
          progress.totalScore += Math.floor(data.percentage / 10); // Points based on percentage
          break;
          
        case 'quiz_completed':
          progress.quizScores.push({
            score: data.score,
            totalQuestions: data.totalQuestions,
            percentage: data.percentage,
            completedAt: new Date().toISOString()
          });
          progress.totalScore += Math.floor(data.percentage / 5); // Points based on percentage
          break;
      }

      userProgress.set(userId, progress);

      // Check if user qualifies for certificate
      checkCertificateEligibility(userId);

      res.json({ 
        success: true, 
        progress: progress,
        message: 'Progress updated successfully' 
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  });

  app.get("/api/progress/:userId", (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userProgress.has(userId)) {
        return res.status(404).json({ error: 'User progress not found' });
      }

      const progress = userProgress.get(userId);
      const user = users.get(userId);

      res.json({ 
        user,
        progress,
        certificates: certificates.get(userId) || []
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  });

  // Certificate generation
  app.post("/api/certificates/generate", (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId || !users.has(userId) || !userProgress.has(userId)) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users.get(userId);
      const progress = userProgress.get(userId);

      // Check eligibility
      const isEligible = checkCertificateEligibility(userId);
      
      if (!isEligible) {
        return res.status(400).json({ 
          error: 'User not eligible for certificate',
          requirements: {
            modulesRequired: 5,
            modulesCompleted: progress.modulesCompleted.length,
            averageScoreRequired: 80,
            averageScore: calculateAverageScore(progress)
          }
        });
      }

      // Generate certificate
      const certificateId = uuidv4();
      const certificate = {
        id: certificateId,
        userId,
        userName: user.name,
        courseName: 'Sentiment Analysis Mastery',
        issueDate: new Date().toISOString(),
        score: calculateAverageScore(progress),
        modules: progress.modulesCompleted.length,
        games: progress.gamesPlayed.length,
        certificateUrl: `/api/certificates/${certificateId}/download`
      };

      // Store certificate
      if (!certificates.has(userId)) {
        certificates.set(userId, []);
      }
      certificates.get(userId).push(certificate);

      // Add to user progress
      progress.certificatesEarned.push(certificateId);
      userProgress.set(userId, progress);

      res.json({ 
        success: true, 
        certificate,
        message: 'Certificate generated successfully!' 
      });

    } catch (error) {
      console.error('Error generating certificate:', error);
      res.status(500).json({ error: 'Failed to generate certificate' });
    }
  });

  app.get("/api/certificates/:certificateId/download", (req, res) => {
    try {
      const { certificateId } = req.params;
      
      // Find certificate
      let certificate = null;
      for (const userCerts of certificates.values()) {
        certificate = userCerts.find(cert => cert.id === certificateId);
        if (certificate) break;
      }

      if (!certificate) {
        return res.status(404).json({ error: 'Certificate not found' });
      }

      // Generate certificate HTML
      const certificateHtml = generateCertificateHtml(certificate);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(certificateHtml);

    } catch (error) {
      console.error('Error downloading certificate:', error);
      res.status(500).json({ error: 'Failed to download certificate' });
    }
  });

  // Dashboard data
  app.get("/api/dashboard/:userId", (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!users.has(userId) || !userProgress.has(userId)) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users.get(userId);
      const progress = userProgress.get(userId);
      const userCertificates = certificates.get(userId) || [];

      // Calculate statistics
      const stats = {
        totalModules: 5,
        completedModules: progress.modulesCompleted.length,
        totalGames: progress.gamesPlayed.length,
        averageGameScore: calculateAverageGameScore(progress),
        totalScore: progress.totalScore,
        certificatesEarned: userCertificates.length,
        daysActive: calculateDaysActive(progress),
        completionPercentage: Math.round((progress.modulesCompleted.length / 5) * 100),
        nextMilestone: getNextMilestone(progress)
      };

      res.json({
        user,
        stats,
        recentActivity: getRecentActivity(progress),
        certificates: userCertificates,
        progress
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  return app;
}

// Helper functions
function checkCertificateEligibility(userId) {
  const progress = userProgress.get(userId);
  if (!progress) return false;

  const modulesCompleted = progress.modulesCompleted.length >= 5;
  const averageScore = calculateAverageScore(progress) >= 80;
  const gamesPlayed = progress.gamesPlayed.length >= 2;

  return modulesCompleted && averageScore && gamesPlayed;
}

function calculateAverageScore(progress) {
  const allScores = [
    ...progress.gamesPlayed.map(game => game.percentage),
    ...progress.quizScores.map(quiz => quiz.percentage)
  ];
  
  if (allScores.length === 0) return 0;
  
  return Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);
}

function calculateAverageGameScore(progress) {
  if (progress.gamesPlayed.length === 0) return 0;
  
  return Math.round(
    progress.gamesPlayed.reduce((sum, game) => sum + game.percentage, 0) / progress.gamesPlayed.length
  );
}

function calculateDaysActive(progress) {
  const startDate = new Date(progress.startedAt);
  const lastDate = new Date(progress.lastActivity);
  const diffTime = Math.abs(lastDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getNextMilestone(progress) {
  if (progress.modulesCompleted.length < 5) {
    return `Complete ${5 - progress.modulesCompleted.length} more modules`;
  }
  if (progress.gamesPlayed.length < 2) {
    return `Play ${2 - progress.gamesPlayed.length} more games`;
  }
  const avgScore = calculateAverageScore(progress);
  if (avgScore < 80) {
    return `Improve average score to 80% (current: ${avgScore}%)`;
  }
  return "Ready for certificate!";
}

function getRecentActivity(progress) {
  const activities = [];
  
  // Add recent games
  progress.gamesPlayed.slice(-3).forEach(game => {
    activities.push({
      type: 'game',
      description: `Played ${game.gameType} - ${game.percentage}%`,
      date: game.completedAt
    });
  });
  
  // Add recent modules
  progress.modulesCompleted.slice(-3).forEach(moduleId => {
    activities.push({
      type: 'module',
      description: `Completed Module ${moduleId}`,
      date: progress.lastActivity
    });
  });
  
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
}

function generateCertificateHtml(certificate) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Certificate of Completion</title>
        <style>
            body {
                font-family: 'Georgia', serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .certificate {
                background: white;
                padding: 60px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 800px;
                border: 8px solid #f0f0f0;
                position: relative;
            }
            .certificate::before {
                content: '';
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                border: 3px solid #667eea;
                border-radius: 10px;
            }
            .header {
                color: #667eea;
                font-size: 48px;
                font-weight: bold;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 4px;
            }
            .subtitle {
                color: #666;
                font-size: 24px;
                margin-bottom: 40px;
            }
            .recipient {
                font-size: 36px;
                color: #333;
                margin: 30px 0;
                font-style: italic;
            }
            .course {
                font-size: 28px;
                color: #667eea;
                font-weight: bold;
                margin: 30px 0;
            }
            .details {
                font-size: 18px;
                color: #666;
                margin: 20px 0;
            }
            .score {
                font-size: 24px;
                color: #28a745;
                font-weight: bold;
                margin: 20px 0;
            }
            .date {
                font-size: 16px;
                color: #999;
                margin-top: 40px;
            }
            .footer {
                margin-top: 50px;
                padding-top: 30px;
                border-top: 2px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .emoji {
                font-size: 60px;
                margin: 20px 0;
            }
            @media print {
                body { background: white; padding: 0; }
                .certificate { box-shadow: none; border: 2px solid #333; }
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="header">Certificate</div>
            <div class="subtitle">of Achievement</div>
            
            <div class="emoji">🏆</div>
            
            <div style="font-size: 20px; color: #666; margin: 30px 0;">
                This is to certify that
            </div>
            
            <div class="recipient">${certificate.userName}</div>
            
            <div style="font-size: 20px; color: #666; margin: 30px 0;">
                has successfully completed
            </div>
            
            <div class="course">${certificate.courseName}</div>
            
            <div class="details">
                Successfully completed ${certificate.modules} learning modules<br>
                and demonstrated proficiency in sentiment analysis concepts
            </div>
            
            <div class="score">
                Final Score: ${certificate.score}%
            </div>
            
            <div class="date">
                Issued on ${new Date(certificate.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
            </div>
            
            <div class="footer">
                <div>🧠 SentiLearn - Sentiment Analysis Education Platform</div>
                <div style="margin-top: 10px;">Certificate ID: ${certificate.id}</div>
            </div>
        </div>
        
        <script>
            // Auto-print when opened
            window.onload = function() {
                setTimeout(() => {
                    window.print();
                }, 1000);
            };
        </script>
    </body>
    </html>
  `;
}

// Start server if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const app = createServer();
  const port = process.env.PORT || 3000;
  
  app.listen(port, () => {
    console.log(`🚀 SentiLearn Backend Server running on port ${port}`);
    console.log(`📊 Dashboard: http://localhost:${port}/api/dashboard`);
    console.log(`🎓 Certificates: http://localhost:${port}/api/certificates`);
  });
}

export { createServer };
