# SentiLearn 🧠✨

An interactive web application that teaches 6th grade students (ages 11-12) the fascinating concept of **Sentiment Analysis** through storytelling, hands-on demos, fun games, and progress tracking with certificate generation!

## 🏗️ Project Structure

This project is now organized into separate **backend** and **frontend** folders for better development and deployment:

```
sentilearn/
├── backend/           # Node.js Express API server
│   ├── routes/        # API route handlers
│   ├── shared/        # Shared utilities and constants
│   ├── public/        # Static files (certificates, etc.)
│   ├── package.json   # Backend dependencies
│   └── server.js      # Main server file
├── frontend/          # React application
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── context/       # React contexts (UserContext)
│   ├── lib/           # Utility functions
│   ├── public/        # Public assets
│   ├── package.json   # Frontend dependencies
│   └── App.jsx        # Main React app
└── README.md
```

## 🌟 New Features

### 🎓 **User Progress Tracking**
- Create user accounts with name and email
- Track module completion and game scores
- Calculate progress percentages and achievement points
- Store learning history and activity timeline

### 📊 **Interactive Dashboard**
- Visual progress overview with charts and stats
- Recent activity feed
- Achievement milestones and next goals
- Quick access to all learning modules

### 🏆 **Certificate Generation**
- Automatic certificate generation for completed learners
- Beautiful HTML certificates with user details
- Requirements: Complete all 5 modules, play 2+ games, achieve 80%+ average score
- Downloadable and printable certificates

### 🎯 **Enhanced Gamification**
- Point system for activities (modules: 20pts, games: based on score)
- Achievement badges and milestones
- Progress encouragement messages
- Completion celebration

## 🛠 Tech Stack

### Backend (Node.js)
- **Express.js** - REST API server
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation
- **In-memory storage** - User data and progress (easily replaceable with database)

### Frontend (React)
- **React 18** with JSX (no TypeScript)
- **React Router 6** for SPA navigation
- **TailwindCSS 3** for styling
- **Radix UI** components for accessibility
- **Lucide React** for beautiful icons
- **Framer Motion** for animations
- **React Query** for API state management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd sentilearn
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Start Backend Server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

5. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

The frontend will proxy API requests to the backend automatically.

### Production Build

1. **Build Backend**
```bash
cd backend
npm run build
```

2. **Build Frontend**
```bash
cd frontend
npm run build
```

3. **Start Production Server**
```bash
cd backend
npm start
```

## 📖 API Documentation

### User Management

**POST** `/api/users/create`
```json
{
  "name": "Student Name",
  "email": "student@example.com"
}
```

### Progress Tracking

**POST** `/api/progress/update`
```json
{
  "userId": "user-uuid",
  "type": "module_completed" | "game_completed" | "quiz_completed",
  "data": {
    "moduleId": 1,
    "score": 85,
    "percentage": 85
  }
}
```

**GET** `/api/progress/:userId`
Returns user progress data, statistics, and certificates.

### Certificate Generation

**POST** `/api/certificates/generate`
```json
{
  "userId": "user-uuid"
}
```

**GET** `/api/certificates/:certificateId/download`
Returns downloadable HTML certificate.

### Dashboard Data

**GET** `/api/dashboard/:userId`
Returns comprehensive dashboard data including stats, recent activity, and achievements.

## 🎓 Educational Features

### 📚 **Learning Modules**
1. **What Are Emotions?** - Understanding feelings and expressions
2. **Teaching Computers About Feelings** - How machines learn emotions
3. **Finding Emotion Clues** - Detecting emotional words and patterns
4. **The Math Behind the Magic** - How computers calculate sentiment scores
5. **Real-World Applications** - Where sentiment analysis is used

### 🎮 **Interactive Games**
- **Smart Quiz** - Learn with detailed explanations
- **Speed Challenge** - Quick-fire sentiment guessing
- **Progress tracking** - Scores and achievements saved

### 🔬 **Demo Features**
- **Real-time Analysis** - Type messages and see instant results
- **Two Approaches** - Simple keyword vs. Advanced AI analysis
- **Visual Feedback** - Confidence scores and explanation
- **Educational Tooltips** - Learn how each approach works

## 🎨 Design Features

- **Kid-Friendly Colors** - Bright, engaging but not overwhelming
- **Large Touch Targets** - Easy interaction for young users
- **Clear Typography** - Readable fonts and appropriate sizes
- **Encouraging Messages** - Positive reinforcement throughout
- **Visual Progress** - Clear indicators of learning advancement
- **Responsive Design** - Works on all devices

## 🏆 Certificate Requirements

To earn a certificate, students must:
- ✅ Complete all 5 learning modules
- ✅ Play at least 2 games
- ✅ Achieve an 80% average score across activities

## 🔧 Configuration

### Backend Configuration
- Port: `3000` (configurable via `PORT` environment variable)
- CORS: Enabled for frontend domain
- Static files: Served from `/static` route

### Frontend Configuration
- Development port: `5173`
- API proxy: Automatically proxies `/api/*` to backend
- Build output: `frontend/dist`

## 🚀 Deployment Options

### Option 1: Separate Deployment
- Deploy backend to Node.js hosting (Railway, Render, etc.)
- Deploy frontend to static hosting (Netlify, Vercel, etc.)
- Update frontend API base URL for production

### Option 2: Combined Deployment
- Build frontend and serve from backend
- Single deployment target
- Backend serves both API and static files

## 🎯 Perfect for

- **Students**: 6th graders learning about AI and technology
- **Teachers**: Classroom demonstrations and assignments
- **Parents**: Home learning activities about computer science
- **Schools**: STEM education and digital literacy programs

## 🔮 Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Teacher dashboard for classroom management
- Multi-language support
- Advanced analytics and reporting
- Social features (sharing certificates)
- Voice sentiment analysis
- Emoji sentiment analysis
- Mobile app version

---

**Built with ❤️ for young learners exploring the amazing world of AI and sentiment analysis!**

## 📄 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.
