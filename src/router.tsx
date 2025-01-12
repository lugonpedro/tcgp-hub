import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { createBrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar";
import About from "./pages/about";
import AuthLayout from "./pages/auth/layout";
import Login from "./pages/auth/login";
import Card from "./pages/card";
import Cards from "./pages/cards";
import Profile from "./pages/profile";
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
        path: "/about",
        element: <About />,
      },
      {
        path: "/cards",
        element: <Cards />,
      },
      {
        path: "/cards/:id",
        element: <Card />,
      },
      {
        path: "/profile",
        element: <Profile />,
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
