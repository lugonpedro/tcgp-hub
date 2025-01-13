import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { createBrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar";
import About from "./pages/about";
import AuthLayout from "./pages/auth/layout";
import Login from "./pages/auth/login";
import Cards from "./pages/cards/all-cards";
import Card from "./pages/cards/card-detail";
import Decks from "./pages/decks/all-decks";
import Deck from "./pages/decks/deck-detail";
import NewDeck from "./pages/decks/new-deck";
import Profile from "./pages/profile/profile";
import UserProfile from "./pages/profile/profile-detail";
import Tracker from "./pages/tracker";
import Trades from "./pages/trades";

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
        path: "/profile/:id",
        element: <UserProfile />,
      },
      {
        path: "/tracker",
        element: <Tracker />,
      },
      {
        path: "/decks",
        element: <Decks />,
      },
      {
        path: "/decks/new",
        element: <NewDeck />,
      },
      {
        path: "/decks/:id",
        element: <Deck />,
      },
      {
        path: "/trades",
        element: <Trades />,
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
