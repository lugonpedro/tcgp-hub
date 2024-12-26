import NotFound from "@/pages/not-found";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import AuthLayout from "./pages/auth/layout";
import Login from "./pages/auth/login";
import Navbar from "./pages/navbar";

export const router = createBrowserRouter([
  {
    element: <Navbar />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      }
    ],
  },
]);