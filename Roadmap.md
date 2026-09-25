# SnapSeek — Roadmap

## 1. Missing basics (do these before new features)

These aren't "nice to have" — they're normal parts of an auth flow that are currently just absent.

- [ ] **Logout — frontend and backend, neither exists yet**
  There's no `logout` function in `auth.api.js`, no handler in `useAuth.js`, and no `/api/auth/logout` route on the backend. The profile section in `Dashboard.jsx`'s sidebar has no click handler at all.
  Needed pieces:
  - Backend: `POST /api/auth/logout` — clears the `token` cookie (`res.clearCookie("token")`). Optionally also delete the matching `Device` row for `{userId, deviceType}` so the slot is freed immediately instead of waiting for another device to overwrite it.
  - Frontend: `logout()` in `auth.api.js`, `handleLogout()` in `useAuth.js` (dispatch `setUser(null)`, redirect to `/login`), wire it to the sidebar profile section click.

- [ ] **No "resend verification email" option**
  If the first verification email doesn't arrive (spam filter, typo'd address caught after the fact, link expired), there's currently no way to get a new one without registering again. Needs a `POST /api/auth/resend-verification` route plus a link on `VerifyMail.jsx`.

- [ ] **No forgot-password / reset-password flow**
  Standard omission at this stage, but worth flagging explicitly since it blocks real users from ever recovering an account. Same shape as email verification: generate a short-lived token, email a link, a page to set a new password.

- [ ] **No post-register onboarding or profile setup**
  Right now `Register.jsx` collects `username`, `email`, `password` and that's it — after verifying, the user lands straight in `Dashboard.jsx` with nothing else asked. Worth deciding intentionally whether you want any of:
  - Avatar / profile picture upload
  - Display name distinct from username
  - A one-time "what do you want to use this for" step (optional, affects nothing functionally, but some products use it to tailor the empty-state copy)
  If the answer is "nothing, keep it minimal" — that's a fine choice too, just make it a decision rather than an accident.

- [ ] **No account/session management page**
  Given the whole point of the device-auth work was "one PC + one phone," there's currently no UI where a user can *see* which device is currently holding each slot, or manually revoke one (e.g. "log out my old laptop"). Right now the only way to free a slot is to log in from the new device and force it out — a dedicated "Active sessions" view under account settings would close this loop properly.

- [ ] **No global 401 → redirect coverage confirmed outside of `Device mismatch`**
  The axios interceptor in `utils/axios.api.js` currently only redirects on the specific `"Device mismatch"` error. A plain expired/invalid token (`"Invalid Token"` from `auth.middleware.js`'s catch block) doesn't trigger the same redirect — worth deciding if that should also force a redirect to `/login`, or if you want different handling (e.g. silent retry) for that case.

## 2. Known bugs to fix (carried over from review)

- [ ] `Login` import in `app.routes.jsx` is lowercase (`"../features/auth/pages/login"`) — breaks on case-sensitive filesystems (any Linux deploy target).
- [ ] `import.meta.env.API_BASE_URL` in `utils/axios.api.js` is missing the required `VITE_` prefix — always falls back to `localhost:3000`.
- [ ] `deleteChat` in `chat.api.js` calls `/api/chat/...` (singular) — actual mount is `/api/chats` (plural). 404s once wired up.
- [ ] `upsertDeviceSession` called from `verifyEmail` passes `ip` but the function expects `lastIp` — silently saves `lastIp: undefined` for that login path.
- [ ] Leftover typo `io.to(...).emit('steam_event', ...)` in `chat.controller.js` — dead code, delete it (the correctly-spelled `'stream_event'` "done" emit from `ai.service.js` already covers this).
- [ ] Commented-out old code in `chat.controller.js`, `chat.api.js`, `auth.api.js` — clean up once confident the new paths are stable.

## 3. Feature roadmap

Carried over and expanded from the original notes, roughly ordered by effort vs. value:

- [x] ~~Single device login~~ — done (device-auth via JWT + `Device` collection)
- [ ] **Token usage tracking per user** — Groq/Gemini/Mistral responses include usage metadata; store per-message, sum per user. Groundwork for rate limits or a usage dashboard.
- [ ] **Google OAuth login** — you already have `GOOGLE_CLIENT_ID`/`SECRET` in `.env` for email sending; add a second OAuth flow for login via `passport-google-oauth20` or a manual flow.
- [ ] **Streamed markdown rendering fixes** — partial markdown (unclosed code fences, `**bold` mid-word) can render oddly while a message is still streaming in.
- [ ] **Image input** — Gemini and Groq vision models accept image content blocks; add file upload in the chat input, base64-encode, pass through as an image block in the `HumanMessage`.
- [ ] **Stop/cancel generation mid-stream** — `AbortController` on the backend's `agent.stream()` call, triggered by a `stop_generation` socket event from the frontend.
- [ ] **Retry / regenerate last response** — cheap to add given message history already exists.
- [ ] **Edit a sent message** and resend without retyping.
- [ ] **Rate limiting per user** — protects shared free-tier API keys from one user's burst exhausting quota for everyone. `express-rate-limit` scoped to `req.user.id`.
- [ ] **"Searching the web..." UI indicator** — `tool_call` events are already emitted over the socket and currently ignored on the frontend (see the TODO comment in `useChat.js`). Small win given the plumbing already exists.
- [ ] **Wire up delete chat in the UI** — backend route + API function both exist, just not called anywhere yet (fix the path bug above first).
- [ ] **Auto-scroll to bottom while streaming** — small but very noticeable UX gap in a streaming chat if missing.