import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect } from "react";
import { initSocket } from "../features/chat/chat.socket";

function App() {
  const auth = useAuth();
  useEffect(() => {
    auth.handleGetMe();
    initSocket();
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
