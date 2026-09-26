# SnapSeek

SnapSeek is a chat app with a React frontend and an Express backend. It includes user authentication, protected chats, real-time messaging, MongoDB storage, and AI integrations.

## Dashboard Features

- Responsive chat dashboard with separate sidebar and conversation panel components.
- Collapsible sidebar with vertical SnapSeek branding in its compact state.
- Recent chat selection and new conversation controls.
- Account menu with workspace details and logout action.
- Markdown and GitHub Flavored Markdown rendering for assistant messages.

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
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_key
MISTRAL_API_KEY=your_mistral_key
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
EMAIL_USER=your_email_address
GOOGLE_APP_PASSWORD=your_google_app_password
```

Create `FRONTEND/.env` for the frontend API endpoint:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Use the deployed frontend and backend URLs for `FRONTEND_URL`, `CORS_ORIGIN`, and `VITE_API_BASE_URL` in production. Do not commit `.env` files or API keys.

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
- `/logout` - Protected logout flow

The main dashboard UI is organized under `FRONTEND/src/features/chat`:

- `components/Sidebar.jsx` - Chat navigation, collapse control, and account menu.
- `components/ConversationPanel.jsx` - Active conversation, messages, and composer.
- `pages/Dashboard.jsx` - Chat state, socket setup, and coordination between components.

Frontend checks:

```bash
npm run lint
npm run build
```
