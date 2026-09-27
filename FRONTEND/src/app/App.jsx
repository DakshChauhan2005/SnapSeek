import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect, useRef } from "react";
import { initSocket } from "../features/chat/chat.socket";

function App() {
  const auth = useAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const publicPaths = ["/login", "/register", "/verify-email"];
    if (publicPaths.includes(window.location.pathname)) return;

    auth.handleGetMe();
    initSocket();
  }, [auth]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
