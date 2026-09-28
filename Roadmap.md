# SnapSeek — Roadmap

## 1. Missing basics (do these before new features)

These aren't "nice to have" — they're normal parts of an auth flow that are currently just absent.

- [x] **Logout — frontend and backend, neither exists yet**
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

- [x] `Login` import in `app.routes.jsx` is lowercase (`"../features/auth/pages/login"`) — breaks on case-sensitive filesystems (any Linux deploy target).
- [x] `import.meta.env.API_BASE_URL` in `utils/axios.api.js` is missing the required `VITE_` prefix — always falls back to `localhost:3000`.
- [x] `deleteChat` in `chat.api.js` calls `/api/chat/...` (singular) — actual mount is `/api/chats` (plural). 404s once wired up.
- [x] `upsertDeviceSession` called from `verifyEmail` passes `ip` but the function expects `lastIp` — silently saves `lastIp: undefined` for that login path.
- [x] Leftover typo `io.to(...).emit('steam_event', ...)` in `chat.controller.js` — dead code, delete it (the correctly-spelled `'stream_event'` "done" emit from `ai.service.js` already covers this).
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
- [x] **Rate limiting per user** — protects shared free-tier API keys from one user's burst exhausting quota for everyone. `express-rate-limit` scoped to `req.user.id`.
- [ ] **"Searching the web..." UI indicator** — `tool_call` events are already emitted over the socket and currently ignored on the frontend (see the TODO comment in `useChat.js`). Small win given the plumbing already exists.
- [x] **Wire up delete chat in the UI** — backend route + API function both exist, just not called anywhere yet (fix the path bug above first).
- [x] **Auto-scroll to bottom while streaming** — small but very noticeable UX gap in a streaming chat if missing.

## 4. AI agent tools

The agent currently has one tool (`WebSearch`, via Tavily). Each tool below follows the same pattern already used in `ai.service.js`: `tool(fn, { name, description, schema })` with a Zod schema, added to the `tools` array in `createAgent`.

### 4a. Improve the existing `WebSearch` tool first

- [ ] **Trim search results before returning them** — return only `title`, `url` and a short `content` snippet per result instead of the whole Tavily response object. Groq's free tier is 8,000 tokens/min, and large tool results eat that budget fast.
- [ ] **Use `topic: "news"` for current-events queries** — Tavily returns noticeably better results for things like "what happened last night at X". Could be a second optional argument on the tool schema.
- [ ] **Add a timeout to the Tavily call** — a hanging external call looks exactly like the "stream never arrives" symptom. Wrap in `Promise.race` or use `AbortSignal.timeout()`.

### 4b. Quick wins (no or trivial setup)

- [ ] **Current date/time tool** — the model doesn't know today's date, so it guesses inside search queries ("27 September 2026" was invented in a failed generation). No API needed, just return `new Date().toUTCString()`. Description should tell the model to call it before any time-relative search ("today", "yesterday", "latest").
- [ ] **Calculator tool (`mathjs`)** — LLMs are unreliable at arithmetic. `npm i mathjs`, wrap `evaluate(expression)` in try/catch, tell the model to use it for any calculation instead of computing it itself.
- [ ] **Page reader / URL extract (Tavily `extract`)** — search returns short snippets only. This lets the model open the 1–2 most relevant URLs and read the full article. Needs a timeout and a character cap on the returned text.
- [ ] **Wikipedia lookup** — free, stable, better than web search for plain "who/what is X" questions.
- [ ] **Weather (Open-Meteo)** — free, no API key required.

### 4c. Bigger features

- [ ] **Memory tool** — model can save and recall user preferences (e.g. "reply in Hindi") from a Mongo collection. **The user id must come from the server (closure / agent config), never as a model-supplied argument**, or one user could read another's memories.
- [ ] **Search past chats** — Mongo text index over the user's own messages, so "what did we discuss about X last week" works. Scope every query to `req.user.id`.
- [ ] **Currency / stocks / crypto** — simple wrappers over free APIs. Live data is where web search snippets are weakest.
- [ ] **Document Q&A (RAG)** — user uploads a PDF, model answers from it. Largest build on this list. Full plan in section 4e below. Pairs naturally with the image-input item in section 3.
- [ ] **Code execution sandbox** — deliberately last. Needs real isolation (E2B, Judge0 or similar); running model-written code on the Render instance itself is a serious security risk.

### 4d. Rules for adding tools

- **Keep the tool count small (about 4–5).** Every tool's schema is sent with every request, which costs tokens, and more tools means more chances of the malformed tool-call JSON that already caused a failed generation (`Failed to parse tool call arguments as JSON`).
- **Write distinct, specific descriptions.** Overlapping descriptions make the model pick the wrong tool.
- **Put a timeout on every tool that calls an external API.**
- **Keep tool return values short.** Trim or truncate before returning.
- **Never let the model choose identity or scope.** User ids, chat ids and similar values come from the server, not from tool arguments.
- **Suggested order:** date/time → page reader → calculator → memory → the rest.

### 4e. User-provided documents (PDF) the LLM can use

Goal: the user attaches a PDF to a chat, and the agent can search it and answer from it, with page references. Built as one more agent tool (`SearchDocuments`), so it fits the existing `createAgent` flow.

**Why not just paste the PDF text into the prompt:** the Groq free tier is 8,000 tokens/min, so anything beyond a few pages blows the budget. The document has to be chunked and only the relevant chunks sent per question.

**Phase 1 — upload and extract**
- [ ] **Upload endpoint** — `POST /api/documents` (multipart, behind `authUser` + the existing rate limiter), separate from the chat socket flow. Use `multer` with **memory storage** (Render's disk is ephemeral, so don't save files to disk). Enforce: PDF mime type only, max file size (e.g. 10 MB), max pages, max documents per user.
- [ ] **Text extraction** — `pdf-parse` or LangChain's `PDFLoader`. Keep the page number with each piece of text so answers can cite pages.
- [ ] **Chunking** — `RecursiveCharacterTextSplitter` (about 800–1000 characters, some overlap). Store each chunk with `{ document, user, chat, page, text }`.
- [ ] **Mongo models** — `Document` (`user`, `chat`, `filename`, `pageCount`, `status: processing | ready | failed`) and `DocumentChunk`. Add an index on `{ user, document }`.
- [ ] **Reject scanned/image-only PDFs clearly** — if extraction returns almost no text, mark the document `failed` with a message like "no readable text found" instead of silently creating an empty document. OCR is a later item (see Phase 3).

**Phase 2 — retrieval tool**
- [ ] **`SearchDocuments` tool** — takes `{ query }`, returns the top 3–5 chunks as `{ filename, page, text }`, capped in total size. Tool description should tell the model to use it whenever the user refers to "the document", "the PDF", "my file" or similar.
- [ ] **Version 1: keyword search** — Mongo `$text` index on chunk text. No embeddings, no extra API, good enough to ship and test the whole flow.
- [ ] **Version 2: semantic search** — embeddings (Gemini embeddings, you already have `GEMINI_API_KEY`) plus MongoDB Atlas Vector Search if the cluster is Atlas. Much better for questions that don't reuse the document's exact words.
- [ ] **Scope every query on the server** — filter by `user` (and `chat`) taken from the authenticated request, never from tool arguments (see 4d).
- [ ] **Make the agent per-request** — right now `agent` in `ai.service.js` is a module-level singleton. The document tool needs the current user/chat id, so build the tool via a factory (`makeSearchDocumentsTool({ userId, chatId })`) and create the agent per request, or pass the ids through the agent's config.
- [ ] **Prompt-injection guard** — document text is untrusted input. Add a system instruction that retrieved document content is data to quote from, not instructions to follow.

**Phase 3 — frontend and polish**
- [ ] **Attach button in `ConversationPanel.jsx`** — file picker, upload progress, then a file chip above the input showing filename and status (`processing` / `ready` / `failed`).
- [ ] **Block sending while a document is still `processing`**, or clearly tell the user it isn't searchable yet.
- [ ] **Show page references in answers** — have the tool return page numbers and ask the model to cite them ("see page 4").
- [ ] **List and delete documents** — small panel per chat; deleting removes the `Document` and all its `DocumentChunk` rows.
- [ ] **Cascade on chat delete** — extend `deleteChat` in `chat.controller.js` to also delete that chat's documents and chunks, otherwise orphaned data piles up.
- [ ] **Per-user limits** — total documents, total chunks or storage per user, so one user can't fill the database.
- [ ] **OCR for scanned PDFs** — later. Options: send the PDF directly to a Gemini model (it accepts PDFs natively) or run an OCR step before chunking.