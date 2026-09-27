# SnapSeek

SnapSeek is an AI chat workspace. Users can create an account, verify their email, sign in from a PC or mobile device, create conversations, and receive streamed AI responses with Markdown rendering. Conversations and messages are stored in MongoDB.

This repository contains two independently runnable applications:

- `BACKEND` - Node.js, Express, MongoDB/Mongoose, JWT cookie authentication, Socket.IO, LangChain, and email delivery.
- `FRONTEND` - React 19, Vite, Redux Toolkit, React Router, Tailwind CSS, Socket.IO Client, and React Toastify.

## Current State

Implemented today:

- Registration with username, email, password validation, and email verification.
- Login and logout using an HTTP-only JWT cookie.
- Device-aware sessions with one PC session and one mobile session per user. A new login replaces the existing session of the same device type.
- Protected routes and API endpoints.
- Chat creation, chat listing, message history, and chat deletion endpoints.
- Streaming assistant responses over Socket.IO.
- Groq is the active chat and title-generation model through LangChain.
- Tavily web search is available to the AI agent as a tool.
- Assistant responses render Markdown and GitHub Flavored Markdown.
- Responsive dashboard with a collapsible sidebar, recent chats, new-chat action, account menu, and logout.
- Toast notifications for login and registration failures.
- Health endpoint at `/health`.
- Transactional verification email through Brevo's HTTPS API, avoiding outbound SMTP port restrictions on hosts such as Render.

The project is functional but still in active development. It has no automated test suite yet.

## Architecture

```text
SnapSeek/
├── BACKEND/
│   ├── config/          MongoDB connection
│   ├── controller/      Authentication and chat request handlers
│   ├── middleware/      Authentication and rate limiting
│   ├── model/           User, device, chat, and message schemas
│   ├── routes/          Auth and chat API routes
│   ├── services/        AI, email, device, and web-search integrations
│   ├── socket/          Socket.IO server and authenticated chat rooms
│   └── server.js        HTTP server entry point
└── FRONTEND/
	└── src/
		├── app/         Router, Redux store, and global styles
		├── features/
		│   ├── auth/    Auth state, API calls, pages, and route guard
		│   └── chat/    Chat state, API calls, socket, pages, and UI
		└── utils/       Axios client and device ID helper
```

## Requirements

- Node.js 20 or newer is recommended. Several current LangChain packages require Node 20.
- MongoDB, local or hosted.
- API credentials for the AI, web search, and email services.

## Installation

Install each application separately:

```bash
cd BACKEND
npm install

cd ../FRONTEND
npm install
```

## Environment Variables

Create `BACKEND/.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
MISTRAL_API_KEY=your_mistral_key
TAVILY_API_KEY=your_tavily_key

BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=your_verified_brevo_sender_email
```

`GROQ_API_KEY` and `TAVILY_API_KEY` are required by the active AI and web-search services. Gemini and Mistral clients are also initialized by the current AI service and should be configured if those providers are used.

Create `FRONTEND/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Do not commit `.env` files, API keys, JWT secrets, or database credentials.

## Local Development

Run the backend and frontend in separate terminals:

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

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/health`

## HTTP API

### Authentication

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account and send a verification email |
| `POST` | `/api/auth/login` | Public | Sign in and create a device session |
| `GET` | `/api/auth/get-me` | Authenticated | Fetch the current user |
| `POST` | `/api/auth/verify-email` | Public | Verify an email token and create a session |
| `POST` | `/api/auth/logout` | Authenticated | Delete the device session and clear the cookie |

Authentication endpoints are rate limited to 10 requests per IP in 15 minutes.

### Chats

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/chats/` | Authenticated | List the current user's chats |
| `POST` | `/api/chats/message` | Authenticated | Create a message and start AI generation |
| `GET` | `/api/chats/:chatId/messeges` | Authenticated | Fetch messages for a chat |
| `DELETE` | `/api/chats/:chatId/delete` | Authenticated | Delete a chat and its messages |

The `messeges` spelling is part of the current route contract and should be corrected only together with its frontend API caller.

Chat requests are limited to 100 requests per user in 15 minutes.

## Authentication and Realtime Flow

1. The frontend creates and stores a persistent device ID in `localStorage`.
2. Login sends the device ID to the backend.
3. The backend stores a device session and signs a JWT containing the user, device type, and device ID.
4. The JWT is sent as an HTTP-only, secure, `SameSite=None` cookie.
5. Protected REST routes validate both the JWT and the matching device record.
6. Socket.IO reads the same cookie and only permits authenticated users to join their own chat rooms.
7. A message request returns an acknowledgement, then AI tokens and completion events are emitted to the chat room.

## Deployment

The backend can run as a Render web service using:

```bash
npm start
```

The frontend can be deployed as a Vite static site, including Vercel. The frontend deployment must define:

```env
VITE_API_BASE_URL=https://your-backend.example.com
```

The backend must define `FRONTEND_URL` as the exact deployed frontend origin so CORS and Socket.IO credentials work. Because the JWT cookie is secure and cross-site, production must use HTTPS on both frontend and backend.

The frontend `vercel.json` rewrites application paths to `index.html` so React Router routes can load directly.

## Known Limitations

- No automated tests are configured; `BACKEND` has a placeholder test script.
- There is no resend-verification-email flow.
- There is no forgot-password or password-reset flow.
- There is no active-session management UI; replacing a same-type device session is currently the way to free that slot.
- Chat deletion is available in the backend but is not currently wired to a dashboard control.
- Socket `tool_call` events are emitted but the frontend does not yet show a web-search status indicator.
- AI generation cannot currently be cancelled, retried, or regenerated from the UI.
- The backend email handler should validate the Brevo HTTP status explicitly; the current service returns the response body and registration treats any non-null response as a successful send.
- The repository contains some legacy commented-out code and spelling inconsistencies that should be cleaned up during future refactors.

## Frontend Checks

Run these from `FRONTEND`:

```bash
npm run lint
npm run build
```

The production build is currently the primary executable validation because no automated test suite exists.
