# SnapSeek

SnapSeek is a chat app with a React frontend and an Express backend. It includes user authentication, protected chats, real-time messaging, MongoDB storage, and AI integrations.

## Requirements

- Node.js 18 or newer
- MongoDB
- API keys for the services you want to use

## Setup

Install dependencies in both folders:

```bash
cd BACKEND
npm install

cd ../FRONTEND
npm install
```

Create `BACKEND/.env` and add the values needed by the backend:

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

Do not commit `.env` files or API keys.

## Run the App

Open two terminals.

Backend:

```bash
cd BACKEND
npm run dev
```

Frontend:

```bash
cd FRONTEND
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:3000`.

## Main Routes

- `/login` - Login
- `/register` - Create an account
- `/` - Protected chat dashboard

Frontend checks:

```bash
npm run lint
npm run build
```
