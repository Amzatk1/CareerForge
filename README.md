# 🔥 CareerForge AI

**CareerForge AI** is a full-stack, AI-powered mobile application designed to help users **explore career paths**, **improve their resumes**, **track their growth**, and **apply for jobs** — all with intelligent automation and personalization.

Whether you're a student, recent graduate, career switcher, or self-taught learner, CareerForge gives you a **personal career mentor in your pocket**.

## ⚙️ Tech Stack

### 🧠 Backend (Django + Django REST Framework)
- **Framework:** Django 4.x
- **API Layer:** Django REST Framework (DRF)
- **Authentication:** JWT (SimpleJWT)
- **Database:** PostgreSQL
- **AI Integration:**
  - OpenAI GPT-4 (career roadmap generation)
  - spaCy or PDFMiner (resume parsing)
- **Storage:** Cloudinary / Firebase (for resume uploads)
- **Containerization:** Docker + Docker Compose

### 📱 Frontend (React Native + Expo)
- **Framework:** React Native (via Expo)
- **Navigation:** react-navigation, Expo Router
- **State Management:** React Context API + AsyncStorage
- **HTTP Client:** Axios + interceptor
- **Storage:** AsyncStorage (JWTs, profile, settings)
- **Design System:** React Native Paper / Tailwind-RN
- **Notifications (Future):** OneSignal

## 🧭 Key Features

### 1. ✅ User Authentication
- Register/Login with email
- JWT-based secure login flow
- Token storage in AsyncStorage
- Auto-login and logout with refresh handling

### 2. 🧠 AI Career Roadmap Generator
- Input: Interests, education, goals
- Output: 6–12 month career plan via GPT-4
- Includes:
  - Key skills to learn
  - Tools to master
  - Certifications to take
  - Projects to build
  - Suggested learning resources

### 3. 📄 Resume Analyzer
- Upload PDF/DOCX
- NLP engine extracts:
  - Experience
  - Education
  - Skills
- GPT or spaCy suggests:
  - Format improvements
  - Keyword optimization
  - Missing content (based on job role)

### 4. 💼 Job Matching Engine
- Pull job listings via RapidAPI or Adzuna
- Filter by:
  - Skills
  - Location (or remote)
  - Salary
  - Career stage
- Ranking based on resume/job match score

### 5. 📚 Learning Hub
- Smart content recommendations
  - Courses (Udemy, freeCodeCamp, Coursera)
  - Books
  - Projects
- Organized by roadmap step or skill
- Tracked in weekly planner

### 6. 📆 Progress Tracker
- Daily/weekly tasks from AI roadmap
- Task status tracking (in progress / done)
- Motivation score based on consistency
- Local sync via AsyncStorage + remote sync via API

### 7. ⚙️ User Profile & Settings
- View/update user data
- Edit roadmap preferences
- View uploaded resumes
- Delete account (GDPR-safe)

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Docker & Docker Compose
- Expo CLI

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd mobile-app
npm install
npx expo start
```

### Docker Setup
```bash
docker-compose up --build
```

## 📦 Project Structure

```
CareerForge/
├── backend/                 # Django backend
│   ├── config/             # Django project config
│   ├── core/               # User authentication
│   ├── career/             # Career path logic
│   ├── resume/             # Resume parsing
│   ├── jobs/               # Job matching
│   └── requirements.txt
├── mobile-app/             # React Native frontend
│   ├── app/               # Expo Router structure
│   ├── components/        # Reusable components
│   ├── services/          # API services
│   └── utils/             # Helper functions
├── docker-compose.yml
└── README.md
```

## 🔑 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login/` | POST | User login |
| `/api/auth/register/` | POST | User registration |
| `/api/profile/` | GET/PUT | User profile |
| `/api/roadmap/` | POST | Generate AI roadmap |
| `/api/resume/upload/` | POST | Upload resume |
| `/api/jobs/` | GET | Get matching jobs |
| `/api/tasks/` | GET/POST | Weekly tasks |

## 🔧 Environment Variables

### Backend (.env)
```
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/careerforge
OPENAI_API_KEY=your_openai_key
CLOUDINARY_URL=your_cloudinary_url
```

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

## 📋 Development Roadmap

- [x] Project setup and structure
- [x] User authentication system
- [x] AI roadmap generation
- [x] Resume upload and parsing
- [x] Job matching engine
- [x] Progress tracking
- [ ] Learning hub integration
- [ ] Mobile app optimization
- [ ] Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 