# AI-study-Assistant

## Overview
AI Study Assistant is a full‑stack application that helps students turn their notes into structured study materials and quick practice quizzes. Users can register/login, paste text notes, and receive a generated summary and quiz. Study history is saved for future reference.

## Features
- **Authentication**: Register and login with JWT-based auth.
- **Study Material Generation**: Send notes and get a concise summary and practice quiz.
- **History Tracking**: View previous generated study sessions and quiz scores.
- **Redux State**: Frontend state management with Redux Toolkit.

## Tech Stack
- **Frontend**: React + Vite, Redux Toolkit, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **AI**: Google Generative AI (Gemini) via `@google/generative-ai`


## Environment Variables
Create `backend/.env` with:
```
PORT=8080
MONGO_URI="mongodb://localhost:27017/AI-Study"   # or your Atlas URI
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## Install & Run
Open two terminals.

1) Backend
```
cd backEnd
npm install
npm start
# Server: http://localhost:8080
```

2) Frontend
```
cd frontEnd
npm install
npm run dev
# App: http://localhost:5173
```
