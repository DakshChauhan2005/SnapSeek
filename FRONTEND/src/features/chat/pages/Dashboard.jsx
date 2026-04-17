import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../useChat';
const Dashboard = () => {
const chat = useChat();
    const user = useSelector((state) => state.auth.user)
    console.log(user);
    useEffect(() => {
        chat.initializeSocketConnection();
    }, []);
  return (
    <div>
      Dashbopard
    </div>
  )
}

export default Dashboard
