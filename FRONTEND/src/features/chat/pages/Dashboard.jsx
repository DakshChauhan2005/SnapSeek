import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { setCurrentChatId } from '../chat.slice'
import Sidebar from '../components/Sidebar'
import ConversationPanel from '../components/ConversationPanel'

const Dashboard = () => {
  const { initSocket, handleSendMessage, handleGetChats, handleGetMessages, handleDeleteChat } = useChat()
  const [draft, setDraft] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const activeChat = chats[currentChatId] || { title: 'New conversation', messages: [] }

  useEffect(() => {
    initSocket()
    handleGetChats()
  }, [initSocket, handleGetChats])

  useEffect(() => {
    if (currentChatId && !chats[currentChatId]?.messages?.length) {
      handleGetMessages(currentChatId)
    }
  }, [currentChatId, handleGetMessages, chats])

  useEffect(() => {
    if (!mobileSidebarOpen) return
    const onKeyDown = (event) => { if (event.key === 'Escape') setMobileSidebarOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileSidebarOpen])

  const startNewChat = () => {
    dispatch(setCurrentChatId(null))
    setDraft('')
  }

  const onSendMessage = (event) => {
    event.preventDefault()
    if (isLoading) return
    const text = draft.trim()
    if (!text) return

    handleSendMessage({ message: text, chatId: currentChatId })
    setDraft('')
  }
  const displayName = user?.username || 'there'

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#f5f4ef] text-[#20211f]">
      <div className="flex h-full w-full">
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          displayName={displayName}
          userAvatar={user?.avatar}
          onSelectChat={(chatId) => {
            dispatch(setCurrentChatId(chatId))
            setMobileSidebarOpen(false)
          }}
          onStartNewChat={() => {
            startNewChat()
            setMobileSidebarOpen(false)
          }}
          onToggleCollapse={() => setSidebarCollapsed((isCollapsed) => !isCollapsed)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onDeleteChat={handleDeleteChat}
        />
        <ConversationPanel
          activeChat={activeChat}
          displayName={displayName}
          draft={draft}
          onDraftChange={setDraft}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          userAvatar={user?.avatar}
        />
      </div>
    </main>
  )
}

export default Dashboard