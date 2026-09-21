# SnapSeek

SnapSeek is a chat application with a React frontend and an Express backend. It provides user authentication, a protected chat dashboard, Socket.IO support for real-time communication, MongoDB persistence, and AI service integrations.

## Project Structure

```text
SnapSeek/
├── BACKEND/     Express API, authentication, database, AI, mail, and sockets
├── FRONTEND/    React + Vite user interface
└── README.md
```

## Features

- User registration and login
- Protected chat dashboard
- Previous chat list and new chat interface
- Message composer and chat display
- JWT authentication with cookies
- MongoDB integration through Mongoose
- Socket.IO server and client setup
- AI service configuration for Gemini, Mistral, and Groq

## Requirements

- Node.js 18 or newer
- MongoDB instance
- API credentials for the services you plan to use

## Setup

### 1. Install dependencies

Open two terminals and run:

```bash
cd BACKEND
npm install
```

```bash
cd FRONTEND
npm install
```

### 2. Configure the backend

Create `BACKEND/.env` with the required values:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
MISTRAL_API_KEY=your_mistral_key
GROQ_API_KEY=your_groq_key
EMAIL_USER=your_email_address
GOOGLE_APP_PASSWORD=your_google_app_password
```

Only the variables required by the features you use need to be configured. Do not commit `.env` files or API keys.

## Running the Application

Start the backend:

```bash
cd BACKEND
npm run dev
```

The backend runs on `http://localhost:3000` by default.

Start the frontend in a second terminal:

```bash
cd FRONTEND
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Application Routes

| Route | Description |
| --- | --- |
| `/login` | User login page |
| `/register` | User registration page |
| `/` | Protected chat dashboard |
| `/dashboard` | Redirects to `/` |

## Backend Endpoints

- `/api/auth` handles authentication routes.
- `/api/chats` handles chat routes.
- `/` returns a basic API health response.
- Socket.IO is initialized by the backend server for real-time chat communication.

## Frontend Commands

```bash
npm run dev       # Start the Vite development server
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run preview   # Preview the production build
```

## Backend Commands

```bash
npm run dev       # Start the backend with nodemon
```
