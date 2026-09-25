import React, { useState } from 'react'
import { useNavigate } from 'react-router'

const Sidebar = ({ chats, currentChatId, collapsed, displayName, onSelectChat, onStartNewChat, onToggleCollapse }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const orderedChats = Object.values(chats).sort(
    (firstChat, secondChat) => new Date(secondChat.createdAt || 0) - new Date(firstChat.createdAt || 0)
  )

  return (
    <aside className={`flex w-full flex-col border-b border-[#deded6] bg-[#e9ebe5] transition-[width] duration-300 lg:h-full lg:shrink-0 lg:border-b-0 lg:border-r ${collapsed ? 'lg:w-[76px]' : 'lg:w-[310px]'}`}>
      <div className={`flex items-center px-5 pb-5 pt-6 ${collapsed ? 'justify-center lg:px-3' : 'justify-between'}`}>
        <div className={collapsed ? 'lg:hidden' : ''}>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">SnapSeek</p>
          <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Your conversations</h1>
        </div>
        <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#cdd1c8] text-lg text-[#596057] transition hover:bg-[#dfe2db]">
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <div className={`px-4 ${collapsed ? 'lg:px-3' : ''}`}>
        <button onClick={onStartNewChat} title="New chat" className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#20211f] px-4 py-3 text-sm font-semibold text-[#f5f4ef] transition hover:bg-[#3b3d38] ${collapsed ? 'lg:px-0' : ''}`}>
          <span className="text-lg leading-none">+</span>
          <span className={collapsed ? 'lg:hidden' : ''}>New chat</span>
        </button>
      </div>

      <nav className="mt-7 flex-1 overflow-y-auto px-3 pb-4" aria-label="Previous chats">
        {collapsed ? (
          <div className="flex h-full items-center justify-center" aria-label="SnapSeek">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>SnapSeek</span>
          </div>
        ) : (
          <>
            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#858b81]">Recent</p>
            <div className="space-y-1">
              {orderedChats.map((chatItem) => (
                <button key={chatItem._id} onClick={() => onSelectChat(chatItem._id)} className={`w-full rounded-xl px-3 py-3 text-left transition ${currentChatId === chatItem._id ? 'bg-[#f7f7f2] shadow-[0_2px_8px_rgba(32,33,31,0.05)]' : 'hover:bg-[#dfe2db]'}`}>
                  <p className="truncate text-sm font-medium">{chatItem.title}</p>
                  <p className="mt-1 truncate text-xs text-[#7d837a]">{chatItem.messages?.at(-1)?.content || 'Start something new...'}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </nav>

      <div className="relative border-t border-[#d4d7cf] p-4">
        {profileMenuOpen && (
          <div className={`absolute bottom-full z-10 mb-2 rounded-2xl border border-[#d4d7cf] bg-[#f8f8f4] p-2 shadow-[0_10px_24px_rgba(32,33,31,0.12)] ${collapsed ? 'left-2 w-44' : 'left-4 right-4'}`}>
            <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#899087]">Account</p>
            <button type="button" onClick={() => { setProfileMenuOpen(false); navigate('/logout') }} className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#41453f] transition hover:bg-[#e9ebe5] hover:text-[#20211f]">
              Logout
              <span aria-hidden="true" className="text-[#899087] transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        )}
        <button type="button" onClick={() => setProfileMenuOpen((isOpen) => !isOpen)} aria-expanded={profileMenuOpen} aria-haspopup="menu" className={`group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-[#dfe2db] ${profileMenuOpen ? 'bg-[#dfe2db]' : ''} ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c7d6c1] text-sm font-bold text-[#385039]">{displayName.charAt(0).toUpperCase()}</div>
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-[#7d837a]">Personal workspace</p>
          </div>
          <span aria-hidden="true" className={`ml-auto h-2 w-2 border-b border-r border-[#727970] transition-transform duration-200 ${profileMenuOpen ? '-rotate-[135deg] translate-y-0.5' : 'rotate-45 -translate-y-0.5'} ${collapsed ? 'lg:hidden' : ''}`} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar