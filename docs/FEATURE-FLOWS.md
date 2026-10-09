# SnapSeek feature flows

## Registration and email verification

1. The registration page validates and posts username, email, and password.
2. Express Validator enforces username length/characters, email format, and a six-character minimum password.
3. The controller rejects duplicate email or username.
4. A random token is generated; only its SHA-256 hash and one-hour expiry are stored.
5. Brevo receives a verification email containing the raw token in the frontend URL.
6. If delivery fails, the newly created user is removed and registration reports failure.
7. The verification page posts the raw token.
8. The backend hashes it, finds a matching unexpired record, marks the user verified, and clears the token.
9. Verification does not create a session; the user must log in with their password.

Resend replaces the old token, applies a one-minute cooldown, and returns a generic response for missing/verified accounts to avoid exposing account existence.

## Login, restoration, and logout

1. The browser creates one UUID device ID and keeps it in `localStorage`.
2. Login sends that ID with credentials.
3. The backend classifies the user agent as PC or mobile and upserts that device slot.
4. The JWT is set as a secure HTTP-only cookie.
5. On a protected page load, `App` calls `/api/auth/get-me`; the route guard waits for this result.
6. If the device record was replaced elsewhere, REST authentication returns a device mismatch and the Axios interceptor redirects to login.
7. Logout deletes the matching device record, clears the cookie, and disconnects the client socket.

## Opening the dashboard

1. `Dashboard` initializes the singleton Socket.IO client.
2. It loads the user's chats with `POST /api/chats/`.
3. Redux stores chats by ID.
4. Selecting a chat sets `currentChatId`.
5. If messages are not loaded, the hook joins the room and fetches `/:chatId/messeges`.
6. The sidebar sorts chats by creation time and exposes new-chat and deletion actions.

## Sending a message

### New chat

The client sends no `chatId`. The backend asks the model for a short title, creates the chat, saves the user message, and returns the created chat and message history.

### Existing chat

The backend validates the ObjectId, looks up the chat with both ID and authenticated owner, and saves the new user message. It then loads the conversation in chronological order for the agent.

### Streaming

The HTTP response is an acknowledgement, not the AI answer. The backend uses the provided socket ID to join the socket to the chat room, then emits token/tool/done/error events. The frontend creates an empty assistant row immediately and fills it as token events arrive. If generation fails after the `202`, the backend emits an error event because it cannot send a second HTTP response.

## Web search

The LangChain agent may call the Tavily tool when current or web-grounded information is useful. Tavily returns up to five basic-depth results to the agent. The frontend currently displays a toast for the tool-call event rather than a detailed source/progress panel. The final model response is still saved as one assistant message.

## Selecting and deleting chats

Selecting a chat loads its messages once and renders them in chronological order. Deleting a chat checks ownership, deletes all related messages, deletes the chat, refreshes the sidebar, and clears the active selection if necessary.

## Errors and limits

- Invalid auth or a replaced device session returns `401`.
- Unknown or non-owned chats return `404`.
- Invalid IDs return `400` when explicitly validated by the controller.
- Auth endpoints allow 10 requests per IP per 15 minutes.
- Chat endpoints allow 100 requests per user per 15 minutes.
- Streaming failures use a Socket.IO `error` event because the HTTP acknowledgement has already been sent.
