import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const starterChats = [
  {
    id: 1,
    title: 'Plan a weekend in Kyoto',
    preview: 'I found a few quiet spots...',
    messages: [
      { id: 1, role: 'assistant', text: 'What kind of weekend are you imagining: food, culture, or a little of everything?' },
      { id: 2, role: 'user', text: 'A little of everything, but I want to keep it relaxed.' },
      { id: 3, role: 'assistant', text: 'Then I would anchor the trip around Nishiki Market, a slow walk through Gion, and an early morning at Fushimi Inari.' },
    ],
  },
  { id: 2, title: 'Ideas for a reading list', preview: 'Three books to start with...', messages: [] },
  { id: 3, title: 'Simple dinner recipes', preview: 'The lemon pasta was great.', messages: [] },
  { id: 4, title: 'Make my writing clearer', preview: 'Here is a sharper version...', messages: [] },
]

const Dashboard = () => {
    const { initializeSocketConnection } = useChat()
    const user = useSelector((state) => state.auth.user)
    const [chats, setChats] = useState(starterChats)
    const [activeChatId, setActiveChatId] = useState(1)
    const [draft, setDraft] = useState('')

    useEffect(() => {
        initializeSocketConnection()
    }, [initializeSocketConnection])

    const activeChat = chats.find((item) => item.id === activeChatId) || chats[0]

    const startNewChat = () => {
        const newChat = {
            id: Date.now(),
            title: 'New conversation',
            preview: 'Start something new...',
            messages: [],
        }
        setChats((currentChats) => [newChat, ...currentChats])
        setActiveChatId(newChat.id)
        setDraft('')
    }

    const sendMessage = (event) => {
        event.preventDefault()
        const text = draft.trim()
        if (!text) return

        const userMessage = { id: Date.now(), role: 'user', text }
        const assistantMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            text: 'That is a thoughtful direction. I can help you turn it into a clear next step.',
        }
        setChats((currentChats) => currentChats.map((chatItem) => (
            chatItem.id === activeChatId
                ? { ...chatItem, title: chatItem.messages.length ? chatItem.title : text.slice(0, 30), preview: text, messages: [...chatItem.messages, userMessage, assistantMessage] }
                : chatItem
        )))
        setDraft('')
    }

    const displayName = user?.name || user?.username || 'there'

  return (
    <main className="min-h-screen w-full bg-[#f5f4ef] text-[#20211f] lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen w-full flex-col lg:h-full lg:flex-row">
        <aside className="flex w-full flex-col border-b border-[#deded6] bg-[#e9ebe5] lg:w-[310px] lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 pb-5 pt-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">SnapSeek</p>
              <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Your conversations</h1>
            </div>
            <button aria-label="Open menu" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#cdd1c8] text-lg text-[#596057] transition hover:bg-[#dfe2db]">•••</button>
          </div>

          <div className="px-4">
            <button onClick={startNewChat} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#20211f] px-4 py-3 text-sm font-semibold text-[#f5f4ef] transition hover:bg-[#3b3d38]">
              <span className="text-lg leading-none">+</span> New chat
            </button>
          </div>

          <nav className="mt-7 flex-1 overflow-y-auto px-3 pb-4" aria-label="Previous chats">
            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#858b81]">Recent</p>
            <div className="space-y-1">
              {chats.map((chatItem) => (
                <button key={chatItem.id} onClick={() => setActiveChatId(chatItem.id)} className={`w-full rounded-xl px-3 py-3 text-left transition ${activeChatId === chatItem.id ? 'bg-[#f7f7f2] shadow-[0_2px_8px_rgba(32,33,31,0.05)]' : 'hover:bg-[#dfe2db]'}`}>
                  <p className="truncate text-sm font-medium">{chatItem.title}</p>
                  <p className="mt-1 truncate text-xs text-[#7d837a]">{chatItem.preview}</p>
                </button>
              ))}
            </div>
          </nav>

          <div className="border-t border-[#d4d7cf] p-4">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c7d6c1] text-sm font-bold text-[#385039]">{displayName.charAt(0).toUpperCase()}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-[#7d837a]">Personal workspace</p>
              </div>
              <span className="ml-auto text-[#858b81]">⌄</span>
            </div>
          </div>
        </aside>

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
                {activeChat.messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#dce8d8] text-sm text-[#436448]">✦</div>}
                    <p className={`max-w-[min(680px,85%)] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-sm bg-[#20211f] text-[#f8f8f4]' : 'rounded-bl-sm bg-white text-[#41453f] shadow-[0_2px_8px_rgba(32,33,31,0.04)]'}`}>{message.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 pb-5 pt-2 sm:px-8 sm:pb-8 lg:px-[clamp(2rem,9vw,9rem)]">
            <form onSubmit={sendMessage} className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-[#deded6] bg-white p-2 pl-4 shadow-[0_8px_25px_rgba(32,33,31,0.06)] focus-within:border-[#a9bca5]">
              <label htmlFor="message" className="sr-only">Write a message</label>
              <textarea id="message" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(event) } }} rows="1" placeholder="Message SnapSeek..." className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-[#a0a49d]" />
              <button type="submit" aria-label="Send message" disabled={!draft.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#20211f] text-lg text-white transition hover:bg-[#4a5e49] disabled:cursor-not-allowed disabled:bg-[#d8dbd4]">↑</button>
            </form>
            <p className="mt-3 text-center text-[10px] text-[#a0a49d]">SnapSeek can make mistakes. Check important information.</p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
