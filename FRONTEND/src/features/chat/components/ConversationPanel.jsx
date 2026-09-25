import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ConversationPanel = ({ activeChat, displayName, draft, onDraftChange, onSendMessage }) => (
  <section className="flex min-h-[calc(100vh-180px)] flex-1 flex-col bg-[#f8f8f4] lg:min-h-0">
    <header className="flex items-center justify-between border-b border-[#e4e4dc] px-5 py-4 sm:px-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#899087]">Conversation</p>
        <h2 className="mt-1 max-w-[65vw] truncate text-base font-semibold sm:max-w-none">{activeChat.title}</h2>
      </div>
      <button aria-label="More conversation options" className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#727970] transition hover:bg-[#ecece6]">•••</button>
    </header>

    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-10 lg:px-[clamp(2rem,9vw,9rem)]">
      {activeChat.messages.length === 0 ? (
        <div className="m-auto max-w-lg text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dce8d8] text-2xl text-[#436448]">✦</div>
          <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">What is on your mind, {displayName}?</h3>
          <p className="mt-2 text-sm leading-6 text-[#7d837a]">Start a conversation and let&apos;s make your next idea easier to find.</p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-3xl space-y-7">
          {activeChat.messages.map((message, index) => (
            <div key={message._id || message.id || index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#dce8d8] text-sm text-[#436448]">✦</div>}
              <div className={`max-w-[min(680px,85%)] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-sm bg-[#20211f] text-[#f8f8f4]' : 'markdown-content rounded-bl-sm bg-white text-[#41453f] shadow-[0_2px_8px_rgba(32,33,31,0.04)]'}`}>
                {message.role === 'assistant' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || message.text || ''}</ReactMarkdown> : message.content || message.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="px-5 pb-5 pt-2 sm:px-8 sm:pb-8 lg:px-[clamp(2rem,9vw,9rem)]">
      <form onSubmit={onSendMessage} className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-[#deded6] bg-white p-2 pl-4 shadow-[0_8px_25px_rgba(32,33,31,0.06)] focus-within:border-[#a9bca5]">
        <label htmlFor="message" className="sr-only">Write a message</label>
        <textarea id="message" value={draft} onChange={(event) => onDraftChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); onSendMessage(event) } }} rows="1" placeholder="Message SnapSeek..." className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-[#a0a49d]" />
        <button type="submit" aria-label="Send message" disabled={!draft.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#20211f] text-lg text-white transition hover:bg-[#4a5e49] disabled:cursor-not-allowed disabled:bg-[#d8dbd4]">↑</button>
      </form>
      <p className="mt-3 text-center text-[10px] text-[#a0a49d]">SnapSeek can make mistakes. Check important information.</p>
    </div>
  </section>
)

export default ConversationPanel