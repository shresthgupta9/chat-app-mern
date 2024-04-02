import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/",
    element: <Login />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/chat",
    element: <Chat />,
    errorElement: <div>404 Not Found</div>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
