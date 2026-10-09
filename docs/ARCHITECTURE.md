# SnapSeek architecture

## System shape

```text
React/Vite browser
  ├─ Axios + credentialed HTTP ───────► Express routes ─► controllers ─► Mongoose/MongoDB
  │                                      ├─ auth/device services
  │                                      ├─ Brevo email service
  │                                      └─ LangChain agent ─► Groq
  │                                                        └► Tavily tool
  └─ Socket.IO + credentialed cookie ─► Socket.IO server ─► authenticated chat rooms
```

The HTTP server and Socket.IO server share one Node `http.Server`. This allows both protocols to use the same origin, cookie, deployment, and lifecycle.

## Backend responsibilities

### Entry point and middleware

`BACKEND/server.js` loads environment variables, imports the Express app, creates an HTTP server, attaches Socket.IO, and listens. `BACKEND/src/app.js` configures CORS, cookies, JSON parsing, MongoDB initialization, logging, REST routes, and health endpoints.

### Authentication boundary

`authUser` reads the `token` cookie, verifies its JWT signature, and checks that the JWT's `deviceId` still matches the user's current device record for its device type. A deleted or replaced device session therefore invalidates the old cookie.

The login controller:

1. Checks email and bcrypt password.
2. Requires a verified email and a client-provided persistent device ID.
3. Classifies the user agent as `pc` or `mobile`.
4. Upserts the single device record for that user/type.
5. Signs a seven-day JWT containing user ID, username, device type, and device ID.
6. Sets the HTTP-only secure cookie.

Socket.IO repeats the JWT/device check from the handshake cookie. A socket may connect without being immediately rejected, but `join_chat` only succeeds for an authenticated owner of the requested chat.

### AI service

`BACKEND/services/ai.service.js` creates a LangChain agent using the streaming Groq model and a Zod-described Tavily web-search tool. Existing messages are converted into LangChain human/AI messages. As the model streams:

- tool-call chunks emit `tool_call`;
- text deltas emit `token`;
- the accumulated text emits `done`;
- the controller stores the complete result as an assistant `Message`.

The same Groq client is used synchronously to generate a concise title when a new chat is created.

### Persistence and ownership

Every chat query includes the authenticated user ID. Message reads first verify that the chat belongs to that user. Deletion explicitly removes messages before deleting the chat. MongoDB schemas are in `BACKEND/model/`.

## Frontend responsibilities

`FRONTEND/src/app/App.jsx` restores the current user on non-public routes and initializes the singleton socket. React Router maps auth pages, email verification, dashboard, and logout. Redux stores two independent slices:

- `auth`: current user, loading state, and auth error.
- `chat`: normalized-by-ID chat objects, active chat ID, loading state, and streaming errors.

`useChat` coordinates REST calls and Socket.IO events. A message submission creates an optimistic assistant placeholder. Each token mutates that last streaming message; `done` marks it complete. `ConversationPanel` renders assistant content with Markdown/GFM and manages follow-the-stream scrolling.

The browser stores only a random device ID in `localStorage`. The JWT itself is never put in JavaScript-accessible storage.

## Message lifecycle

1. User types in `ConversationPanel`.
2. `Dashboard` calls `useChat.handleSendMessage`.
3. `chat.api.js` posts the message and current Socket.IO ID.
4. The backend creates a chat if needed, generates its title, saves the user message, and returns `202`.
5. The backend places the identified socket into the room synchronously.
6. The frontend upserts the chat, selects it, joins the room, and appends the user message plus an empty assistant placeholder.
7. LangChain emits stream events to the room.
8. Redux appends token content into the placeholder.
9. The backend saves the final assistant message after generation and the frontend finalizes its placeholder on `done`.

## Reconnect behavior

Socket.IO assigns a new socket ID after reconnecting and does not retain room membership. The frontend stores the active chat ID and emits `join_chat` on every `connect`, so a reconnect can rejoin the viewed chat. This is why the message request also sends the current socket ID: the backend can join that exact socket before generation starts and avoid a race between acknowledgement and first token.

## Operational boundaries

- REST is the source of truth for authentication, chat metadata, message history, and deletion.
- Socket.IO is a delivery channel for transient generation progress.
- MongoDB is the source of truth for completed conversations.
- The frontend's streaming placeholder is deliberately temporary UI state.
- CORS and credentials must agree across frontend, REST, Socket.IO, and cookie configuration.
