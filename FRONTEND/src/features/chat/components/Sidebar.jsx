import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const Sidebar = ({ chats, currentChatId, collapsed, mobileOpen, displayName, onSelectChat, onStartNewChat, onToggleCollapse, onCloseMobile, onDeleteChat, userAvatar }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false)
  const navigate = useNavigate()
  const orderedChats = Object.values(chats).sort(
    (firstChat, secondChat) => new Date(secondChat.createdAt || 0) - new Date(firstChat.createdAt || 0)
  )

  useEffect(() => {
    setAvatarLoadFailed(false)
  }, [userAvatar])

  return (
    <>
    <div onClick={onCloseMobile} aria-hidden="true" className={`fixed inset-0 z-30 bg-[#20211f]/40 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
    <aside className={`fixed inset-y-0 left-0 z-40 flex h-dvh w-[85vw] max-w-[340px] flex-col border-r border-[#deded6] bg-[#e9ebe5] transition-[width,transform,visibility] duration-300 lg:static lg:z-auto lg:h-full lg:max-w-none lg:shrink-0 ${mobileOpen ? 'visible translate-x-0' : 'max-lg:invisible max-lg:-translate-x-full'} ${collapsed ? 'lg:w-[76px]' : 'lg:w-[310px]'}`}>
      <div className={`flex items-center px-5 pb-5 pt-[max(1.5rem,env(safe-area-inset-top))] ${collapsed ? 'justify-center lg:px-3' : 'justify-between'}`}>
        <div className={collapsed ? 'lg:hidden' : ''}>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">SnapSeek</p>
          <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Your conversations</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCloseMobile} aria-label="Close conversations" title="Close conversations" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#cdd1c8] text-lg text-[#596057] transition hover:bg-[#dfe2db] lg:hidden">
            ×
          </button>
          <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="hidden h-9 w-9 shrink-0 items-center justify-center lg:flex rounded-full border border-[#cdd1c8] text-lg text-[#596057] transition hover:bg-[#dfe2db]">
            {collapsed ? '›' : '‹'}
          </button>
        </div>
      </div>

      <div className={`px-4 ${collapsed ? 'lg:px-3' : ''}`}>
        <button onClick={onStartNewChat} title="New chat" className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#20211f] px-4 py-3 text-sm font-semibold text-[#f5f4ef] transition hover:bg-[#3b3d38] ${collapsed ? 'lg:px-0' : ''}`}>
          <span className="text-lg leading-none">+</span>
          <span className={collapsed ? 'lg:hidden' : ''}>New chat</span>
        </button>
      </div>

      <nav className="mt-7 min-h-0 flex-1 overflow-y-auto px-3 pb-4" aria-label="Previous chats">
        {collapsed ? (
          <div className="flex h-full items-center justify-center" aria-label="SnapSeek">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>SnapSeek</span>
          </div>
        ) : (
          <>
            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#858b81]">Recent</p>
            <div className="space-y-1">
              {orderedChats.map((chatItem) => (
                <div key={chatItem._id} className={`group flex w-full items-center rounded-xl transition ${currentChatId === chatItem._id ? 'bg-[#f7f7f2] shadow-[0_2px_8px_rgba(32,33,31,0.05)]' : 'hover:bg-[#dfe2db]'}`}>
                  <button type="button" onClick={() => onSelectChat(chatItem._id)} className="min-w-0 flex-1 px-3 py-3 text-left">
                    <p className="truncate text-sm font-medium">{chatItem.title}</p>
                    <p className="mt-1 truncate text-xs text-[#7d837a]">{chatItem.messages?.at(-1)?.content || 'Start something new...'}</p>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${chatItem.title}`}
                    title="Delete chat"
                    onClick={(event) => { event.stopPropagation(); onDeleteChat(chatItem._id) }}
                    className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#899087] opacity-0 transition [@media(hover:none)]:opacity-100 sm:h-8 sm:w-8 hover:bg-[#d4dcd0] hover:text-[#385039] group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </nav>

      <div className="relative border-t border-[#d4d7cf] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {profileMenuOpen && (
          <div className={`absolute bottom-full z-10 mb-2 rounded-2xl border border-[#d4d7cf] bg-[#f8f8f4] p-2 shadow-[0_10px_24px_rgba(32,33,31,0.12)] ${collapsed ? 'left-2 w-44' : 'left-4 right-4'}`}>
            <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#899087]">Account</p>
            <button type="button" onClick={() => { setProfileMenuOpen(false); navigate('/home') }} className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#41453f] transition hover:bg-[#e9ebe5] hover:text-[#20211f]">
              Homepage
              <span aria-hidden="true" className="text-[#899087] transition-transform group-hover:translate-x-0.5">→</span>
            </button>
            <button type="button" onClick={() => { setProfileMenuOpen(false); navigate('/logout') }} className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#41453f] transition hover:bg-[#e9ebe5] hover:text-[#20211f]">
              Logout
              <span aria-hidden="true" className="text-[#899087] transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        )}
        <button type="button" onClick={() => setProfileMenuOpen((isOpen) => !isOpen)} aria-expanded={profileMenuOpen} aria-haspopup="menu" className={`group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-[#dfe2db] ${profileMenuOpen ? 'bg-[#dfe2db]' : ''} ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c7d6c1] text-sm font-bold text-[#385039]">
            {userAvatar && !avatarLoadFailed ? (
              <img
                src={userAvatar}
                alt={`${displayName}'s avatar`}
                referrerPolicy="no-referrer"
                onError={() => setAvatarLoadFailed(true)}
                className="h-full w-full rounded-full object-cover"
              />
            ) : displayName.charAt(0).toUpperCase()}
          </div>
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-[#7d837a]">Personal workspace</p>
          </div>
          <span aria-hidden="true" className={`ml-auto h-2 w-2 border-b border-r border-[#727970] transition-transform duration-200 ${profileMenuOpen ? '-rotate-[135deg] translate-y-0.5' : 'rotate-45 -translate-y-0.5'} ${collapsed ? 'lg:hidden' : ''}`} />
        </button>
      </div>
    </aside>
    </>
  )
}

export default Sidebar