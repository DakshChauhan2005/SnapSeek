# SnapSeek FAQ and design decisions

## Why use Socket.IO if the browser already supports realtime features?

“Browser realtime” is not one single technology. The browser provides several primitives, but each solves a different problem:

- **WebSocket** is a low-level, two-way persistent connection. The application must design reconnection, event names, room membership, and message handling itself.
- **Server-Sent Events (SSE)** is a one-way server-to-browser stream. It is a good fit for a single long-running response, but client-to-server commands still need HTTP and reconnection/event conventions still need to be designed.
- **WebRTC data channels** are peer-to-peer and optimized for media/data between browsers. They are unnecessary for a browser-to-Node AI stream and introduce signaling, NAT traversal, and peer lifecycle complexity.
- **BroadcastChannel** only communicates between pages/contexts on the same browser origin; it cannot deliver events from the backend.
- **WebTransport** is newer and not the current transport used by this project.

SnapSeek uses Socket.IO because it provides a practical application-level layer over WebSocket with fallback transport, automatic reconnection, event names, acknowledgements, rooms, and a mature React/Node ecosystem. Rooms let the backend emit a generation only to sockets authorized for one chat. This is more useful here than using a raw browser API.

Socket.IO is not used for every request. HTTP remains the better fit for commands that need a clear status code and durable response: register, login, fetch history, delete, and submit-message acknowledgement. Socket.IO is used for the high-frequency, server-initiated token stream.

## Why not stream the AI response in the HTTP response?

It is possible to use a streamed `fetch` response or SSE. The current split makes the HTTP request short and explicit: it acknowledges persistence and generation start, while the socket carries progress independently. This lets the UI subscribe before the model finishes, supports room targeting, and gives the backend a separate error event after the HTTP headers have already been sent.

The trade-off is that the client needs both a REST call and a socket connection, and the final assistant message is not durably saved until generation finishes.

## Why is the JWT in a cookie instead of localStorage?

An HTTP-only cookie prevents normal JavaScript code from reading the token, reducing exposure from common token-theft paths such as accidental storage access. The trade-off is that cross-origin requests must opt into credentials and production must use HTTPS with the current `secure` and `SameSite=None` cookie settings.

## Why is there a device ID in localStorage?

The device ID is a stable, non-secret identifier used to recognize the browser/device slot across logins. It is included in the JWT and compared with MongoDB on every protected REST and socket operation. It allows one PC and one mobile session per account without storing the JWT in localStorage.

## Why can a new login invalidate another session?

The `Device` collection has a unique `(userId, deviceType)` index. Logging in again on the same type upserts that record with a new device ID. The old JWT then fails the device comparison. This is an intentional simple session-replacement policy, not a bug in JWT signature validation.

## Why does the message endpoint return `202`?

The request has accepted the message and started asynchronous AI work, but the assistant response is not ready. `202 Accepted` communicates that distinction. The final answer arrives through `stream_event` socket messages and is later persisted.

## Why are rooms checked against chat ownership?

Socket connections are long-lived and do not automatically inherit REST route authorization. On `join_chat`, the server verifies both the socket's authenticated device session and that the requested chat belongs to that user. Without the ownership query, a client could attempt to subscribe to another user's stream by guessing a chat ID.

## Why send the socket ID in the HTTP body?

The backend needs to associate the HTTP message request with the exact Socket.IO connection that should receive the stream. Joining that socket synchronously before model generation removes a timing race where the first tokens could be emitted before the frontend's separate `join_chat` event is processed.

## Why does the frontend create a temporary assistant message?

Token events are deltas, not complete database messages. Redux needs a visible target to append into while the model streams. The placeholder is marked `streaming: true` and becomes final when `done` arrives. On a fresh page load, MongoDB history remains authoritative.

## Why use an agent and Tavily instead of always searching?

Not every prompt needs current web information. The LangChain agent can decide when the tool description matches the question, avoiding an unnecessary external request for ordinary writing or reasoning tasks. Tavily is an optional external dependency and requires `TAVILY_API_KEY`.

## Why hash verification tokens?

The raw token is only sent in the email link. MongoDB stores its SHA-256 hash, so a database read does not directly reveal a usable verification link. Tokens expire after one hour, are cleared after use, and are replaced when resent.

## Where should a future feature be implemented?

- New REST behavior: route declaration in `BACKEND/routes/`, request logic in a controller, and ownership/auth middleware where needed.
- New persisted data: a Mongoose schema in `BACKEND/model/` plus controller/service usage.
- AI behavior: `BACKEND/services/ai.service.js` and its tool/service boundary.
- New stream event: backend `stream_event` producer, frontend `useChat` event handler, Redux reducer if state is needed, and UI feedback.
- New UI state: the appropriate Redux slice and feature hook rather than unrelated component-local state.

## What are the most important current limitations?

There is no automated test suite. Generation has no cancel/retry/regenerate UI. Stream interruption can leave a temporary client message that is ahead of persisted MongoDB state. Tool calls currently show a toast rather than citations or progress details. These are product/operational follow-ups, not alternate transport requirements.
