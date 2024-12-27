import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { createBrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar";
import AuthLayout from "./pages/auth/layout";
import Login from "./pages/auth/login";
import Tracker from "./pages/tracker";

export const router = createBrowserRouter([
  {
    element: <Navbar />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tracker",
        element: <Tracker />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
