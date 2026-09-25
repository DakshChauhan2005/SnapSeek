import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { setCurrentChatId } from '../chat.slice'
import Sidebar from '../components/Sidebar'
import ConversationPanel from '../components/ConversationPanel'

const Dashboard = () => {
  const { initSocket, handleSendMessage, handleGetChats, handleGetMessages } = useChat()
  const [draft, setDraft] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
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

  const startNewChat = () => {
    dispatch(setCurrentChatId(null))
    setDraft('')
  }

  const onSendMessage = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    handleSendMessage({ message: text, chatId: currentChatId })
    setDraft('')
  }

  const displayName = user?.username || 'there'

  return (
    <main className="min-h-screen w-full bg-[#f5f4ef] text-[#20211f] lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen w-full flex-col lg:h-full lg:flex-row">
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          collapsed={sidebarCollapsed}
          displayName={displayName}
          onSelectChat={(chatId) => dispatch(setCurrentChatId(chatId))}
          onStartNewChat={startNewChat}
          onToggleCollapse={() => setSidebarCollapsed((isCollapsed) => !isCollapsed)}
        />
        <ConversationPanel
          activeChat={activeChat}
          displayName={displayName}
          draft={draft}
          onDraftChange={setDraft}
          onSendMessage={onSendMessage}
        />
      </div>
    </main>
  )
}

export default Dashboard
