import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ConversationPanel = ({ activeChat, displayName, draft, onDraftChange, onSendMessage, isLoading, onOpenMobileSidebar }) => {
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const shouldFollowStreamRef = useRef(true)
  const previousAcknowledgedMessageIdRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const latestAcknowledgedMessage = [...activeChat.messages].reverse().find((message) => message._id || message.id)
  const latestAcknowledgedMessageId = latestAcknowledgedMessage?._id || latestAcknowledgedMessage?.id || null

  useEffect(() => {
    const acknowledgedMessageChanged = latestAcknowledgedMessageId !== previousAcknowledgedMessageIdRef.current
    previousAcknowledgedMessageIdRef.current = latestAcknowledgedMessageId

    if (acknowledgedMessageChanged) {
      shouldFollowStreamRef.current = true
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else if (shouldFollowStreamRef.current) {
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'auto',
      })
    }
  }, [activeChat.messages, latestAcknowledgedMessageId])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [draft])

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 24
    shouldFollowStreamRef.current = isAtBottom
    setShowScrollButton(!isAtBottom)
  }

  const scrollToLatest = () => {
    shouldFollowStreamRef.current = true
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-[#f8f8f4]">
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#e4e4dc] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8 sm:pb-4 sm:pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onOpenMobileSidebar} aria-label="Open conversations" title="Open conversations" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#cdd1c8] text-lg text-[#596057] transition hover:bg-[#ecece6] lg:hidden">
          ☰
        </button>
        <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#899087]">Conversation</p>
        <h2 className="mt-1 truncate text-base font-semibold">{activeChat.title}</h2>
        </div>
      </div>
      <button aria-label="More conversation options" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-[#727970] transition hover:bg-[#ecece6]">•••</button>
    </header>

    <div ref={scrollContainerRef} onScroll={handleScroll} className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-6 sm:px-10 sm:py-8 lg:px-[clamp(2rem,9vw,9rem)]">
      {activeChat.messages.length === 0 ? (
        <div className="m-auto max-w-lg text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dce8d8] text-2xl text-[#436448]">✦</div>
          <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] sm:text-2xl">What is on your mind, {displayName}?</h3>
          <p className="mt-2 text-sm leading-6 text-[#7d837a]">Start a conversation and let&apos;s make your next idea easier to find.</p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-3xl space-y-7">
          {activeChat.messages.map((message, index) => (
            <div key={message._id || message.id || index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#dce8d8] text-sm text-[#436448]">✦</div>}
              <div className={`min-w-0 max-w-[88%] [overflow-wrap:anywhere] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[min(680px,85%)] ${message.role === 'user' ? 'whitespace-pre-wrap rounded-br-sm bg-[#20211f] text-[#f8f8f4]' : 'markdown-content rounded-bl-sm bg-white text-[#41453f] shadow-[0_2px_8px_rgba(32,33,31,0.04)]'}`}>
                {message.role === 'assistant' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || message.text || ''}</ReactMarkdown> : message.content || message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>
      )}
      {showScrollButton && (
        <button
          type="button"
          onClick={scrollToLatest}
          aria-label="Scroll to latest message"
          title="Scroll to latest message"
          className="sticky bottom-2 ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d8dbd4] bg-white text-lg text-[#4a5e49] shadow-[0_4px_14px_rgba(32,33,31,0.12)] transition hover:bg-[#edf2eb]"
        >
          ↓
        </button>
      )}
    </div>

    <div className="shrink-0 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-8 sm:pb-[max(2rem,env(safe-area-inset-bottom))] lg:px-[clamp(2rem,9vw,9rem)]">
      <form onSubmit={onSendMessage} className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-[#deded6] bg-white p-2 pl-4 shadow-[0_8px_25px_rgba(32,33,31,0.06)] focus-within:border-[#a9bca5]">
        <label htmlFor="message" className="sr-only">Write a message</label>
        <textarea id="message" ref={textareaRef} enterKeyHint="send" value={draft} onChange={(event) => onDraftChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); if (!isLoading) onSendMessage(event) } }} rows="1" placeholder="Message SnapSeek..." className="max-h-40 min-h-10 min-w-0 flex-1 resize-none bg-transparent py-2 text-base outline-none sm:text-sm placeholder:text-[#a0a49d]" />
        <button type="submit" aria-label="Send message" disabled={!draft.trim() || isLoading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#20211f] text-lg text-white transition hover:bg-[#4a5e49] disabled:cursor-not-allowed disabled:bg-[#d8dbd4]">↑</button>
      </form>
      <p className="mt-2 text-center text-[10px] text-[#a0a49d] sm:mt-3">SnapSeek can make mistakes. Check important information.</p>
    </div>
    </section>
  )
}

export default ConversationPanel