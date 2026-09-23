import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect } from "react";
import { initializeSocketConnection } from "../features/chat/services/chat.socket";

function App() {
  const auth = useAuth();
  useEffect(() => {
    auth.handleGetMe();
    initializeSocketConnection();
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
