# SnapSeek

SnapSeek is an AI chat workspace for creating persistent conversations and receiving streamed assistant responses. It combines a React/Vite client with an Express/MongoDB API, LangChain model orchestration, Tavily web search, email verification, device-aware sessions, and Socket.IO streaming.

[![Architecture diagram of dakshchauhan2005/snapseek](https://gitdiagram.com/dakshchauhan2005/snapseek/diagram.png)](https://gitdiagram.com/dakshchauhan2005/snapseek?utm_source=readme&utm_medium=picture)

## What is in this repository?

SnapSeek is a small monorepo with two independently runnable applications:

| Application | Responsibility | Local URL |
| --- | --- | --- |
| [`BACKEND/`](./BACKEND) | HTTP API, authentication, MongoDB persistence, AI generation, email, and Socket.IO | `http://localhost:3000` |
| [`FRONTEND/`](./FRONTEND) | React UI, routing, Redux state, REST calls, and streamed chat rendering | `http://localhost:5173` |

The deeper implementation notes are in:

- [Architecture](./docs/ARCHITECTURE.md) - components, data model, boundaries, and realtime protocol.
- [Feature flows](./docs/FEATURE-FLOWS.md) - step-by-step registration, login, chat, search, deletion, and error flows.
- [FAQ and design decisions](./docs/FAQ.md) - why Socket.IO is used, how it compares with browser realtime APIs, and common maintenance questions.
- [Roadmap](./Roadmap.md) - planned and potential follow-up work.

## Current capabilities

- Account registration with username, email, password validation, bcrypt hashing, and one-time email verification.
- Verification-link resend with a cooldown and generic responses for unknown addresses.
- HTTP-only JWT cookie authentication.
- Device-aware sessions: one active PC session and one active mobile session per user. A new login of the same device type replaces the previous record.
- Protected REST endpoints and Socket.IO chat-room ownership checks.
- Persistent chat creation, chat listing, message history, and chat deletion.
- AI-generated titles for new chats.
- Streaming assistant tokens from a LangChain agent backed by Groq.
- Optional Tavily web search tool for current-information questions.
- Markdown and GitHub Flavored Markdown rendering in assistant messages.
- Responsive dashboard with recent chats, chat deletion, sidebar collapse, account menu, and automatic scroll-to-latest behavior.
- Authentication and chat rate limiting.
- `/health` endpoint for deployment checks.

## Technology stack

### Backend

- Node.js 20+ and ECMAScript modules
- Express 5, `cookie-parser`, CORS, Morgan
- MongoDB through Mongoose
- JWT, bcrypt, `ua-parser-js`, and `express-rate-limit`
- LangChain with Groq (active model), Gemini/Mistral client definitions, Zod tool schema
- Tavily web search
- Brevo email delivery over HTTPS
- Socket.IO 4

### Frontend

- React 19 and React Router
- Vite
- Redux Toolkit and React Redux
- Axios with credentialed requests
- Socket.IO Client
- Tailwind CSS
- `react-markdown` with `remark-gfm`
- React Toastify

## Requirements

- Node.js 20 or newer
- A MongoDB database (local or hosted)
- A Groq API key
- A Tavily API key
- Brevo API credentials and a verified sender email for registration emails

Gemini and Mistral clients are currently constructed by the AI service, so provide their keys if those providers are enabled in a future model selection change.

## Installation

Install dependencies separately because each app has its own `package.json`:

```bash
git clone <repository-url>
cd SnapSeek

cd BACKEND
npm install

cd ../FRONTEND
npm install
```

Create `BACKEND/.env`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/snapseek
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173

GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key

BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=verified_sender@example.com
```

Create `FRONTEND/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Never commit environment files, API keys, JWT secrets, or database credentials. The backend expects a verified Brevo sender in `EMAIL_USER`.

## Running locally

Use two terminals:

```bash
# Terminal 1
cd BACKEND
npm run dev
```

```bash
# Terminal 2
cd FRONTEND
npm run dev
```

Open `http://localhost:5173`. Check backend availability at `http://localhost:3000/health`.

The backend uses `server.js` to load environment variables, create the HTTP server, attach Socket.IO, and listen on `PORT`. The frontend is a Vite SPA; `FRONTEND/vercel.json` rewrites application paths to `index.html` for client-side routing.

## How a request is split between HTTP and Socket.IO

SnapSeek deliberately uses both transports:

1. The frontend sends `POST /api/chats/message` over Axios.
2. The backend authenticates the request, creates or finds the chat, saves the user message, and returns `202` with the current chat and messages.
3. The frontend joins the chat's Socket.IO room.
4. The backend runs the AI agent and emits `stream_event` messages to that room.
5. The frontend appends each `token` event to a temporary assistant message and finalizes it on `done`.
6. The complete assistant response is saved to MongoDB after generation.

This provides a reliable request/response boundary for commands and an efficient push channel for many small streaming updates. See [FAQ and design decisions](./docs/FAQ.md) for why browser-native alternatives are not a direct replacement here.

## HTTP API

All protected endpoints use the HTTP-only `token` cookie. Axios is configured with `withCredentials: true`.

### Authentication

| Method | Path | Access | Body | Purpose |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | `username`, `email`, `password` | Create an unverified account and send a verification email |
| `POST` | `/api/auth/login` | Public | `email`, `password`, `deviceId` | Validate credentials, upsert a device session, and set the JWT cookie |
| `GET` | `/api/auth/get-me` | Authenticated | — | Return the current user |
| `POST` | `/api/auth/verify-email` | Public | `token` | Consume a valid one-time verification token |
| `POST` | `/api/auth/resend-verification` | Public | `email` | Replace and resend a verification token |
| `POST` | `/api/auth/logout` | Authenticated | — | Delete the current device session and clear the cookie |

Authentication routes are limited to 10 requests per IP per 15 minutes.

### Chats

| Method | Path | Access | Body | Purpose |
| --- | --- | --- | --- | --- |
| `POST` | `/api/chats/` | Authenticated | — | List the current user's chats |
| `POST` | `/api/chats/message` | Authenticated | `message`, optional `chatId`, optional `socketId` | Save a user message and start AI generation |
| `GET` | `/api/chats/:chatId/messeges` | Authenticated | — | Fetch messages owned by the current user |
| `DELETE` | `/api/chats/:chatId/delete` | Authenticated | — | Delete a chat and its messages |

`messeges` is the existing misspelled route and is part of the current client/server contract. Rename it only as a coordinated frontend and backend change.

Chat requests are limited to 100 per authenticated user per 15 minutes.

### Socket.IO events

Client to server:

| Event | Payload | Behavior |
| --- | --- | --- |
| `join_chat` | `chatId` | Verifies ownership and joins the room |

Server to client:

| Event | Payload shape | Meaning |
| --- | --- | --- |
| `stream_event` | `{ type: "token", content, chatId }` | Append an assistant text delta |
| `stream_event` | `{ type: "tool_call", name, chatId }` | The agent requested a tool such as web search |
| `stream_event` | `{ type: "done", content, chatId }` | Generation completed |
| `stream_event` | `{ type: "error", message, chatId }` | Generation failed after HTTP acknowledgement |

## Data model

- `User`: username, email, bcrypt password hash, verification state, and verification-token metadata.
- `Device`: user reference, `pc`/`mobile` type, persistent browser-generated device ID, user agent, IP, and login time. `(userId, deviceType)` is unique.
- `Chat`: owner and generated title.
- `Message`: chat reference, `user` or `assistant` role, content, and timestamps.

See [Architecture](./docs/ARCHITECTURE.md) for ownership rules and lifecycle details.

## Validation and checks

Frontend:

```bash
cd FRONTEND
npm run lint
npm run build
```

Backend:

```bash
cd BACKEND
npm start
```

The backend currently has no automated test suite; its `npm test` script is a placeholder. The frontend lint and production build are the primary repository checks.

## Deployment

The backend can run as a Node web service with `npm start`. The frontend can be deployed as a Vite static site.

For production:

- Use HTTPS for both origins.
- Set `FRONTEND_URL` to the exact frontend origin, including scheme and without an accidental trailing-path mismatch.
- Set `VITE_API_BASE_URL` to the public backend origin.
- Keep `credentials: true` enabled in CORS and Axios/Socket.IO clients.
- Use a strong, private `JWT_SECRET`.
- Configure MongoDB network access and Brevo's verified sender.

The cookie is currently `httpOnly`, `secure`, and `sameSite: "none"`, so a plain HTTP cross-origin deployment will not authenticate successfully.

## Repository map

```text
SnapSeek/
├── BACKEND/
│   ├── config/       MongoDB connection
│   ├── controller/   Authentication and chat request handlers
│   ├── middleware/   JWT/device authentication and rate limiting
│   ├── model/       User, device, chat, and message schemas
│   ├── routes/      REST route declarations
│   ├── services/    AI, email, device, and web-search integrations
│   ├── socket/      Socket.IO setup and room authorization
│   └── server.js    HTTP + Socket.IO entry point
├── FRONTEND/
│   └── src/
│       ├── app/              Router, Redux store, and global styles
│       ├── features/auth/    Authentication state, pages, API, and guard
│       ├── features/chat/    Chat state, API, socket, hooks, and UI
│       └── utils/             Axios client and device ID helper
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FEATURE-FLOWS.md
│   └── FAQ.md
└── Roadmap.md
```

## Known limitations and maintenance notes

- There are no automated tests yet.
- AI generation cannot be cancelled, retried, or regenerated from the UI.
- A `tool_call` toast exists, but there is no dedicated web-search progress component.
- The backend stores the completed assistant response only after generation finishes; an interrupted stream may leave the UI ahead of persistence.
- Socket handshake failures are logged as unauthenticated sockets and enforced when joining a room.
- There is legacy commented-out mail code and a few naming inconsistencies.
