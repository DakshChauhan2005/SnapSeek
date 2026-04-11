import { RouterProvider } from "react-router"
import { router } from "./app.routes"


function App() {
  return (
    <>
      <RouterProvider router={router} />
      <h1 className="text-3xl font-bold underline text-pink-500">
        Hello, Vite + React!
      </h1>
    </>
  )
}

export default App
