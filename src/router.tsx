import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { createBrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar";
import About from "./pages/about";
import AuthLayout from "./pages/auth/layout";
import Login from "./pages/auth/login";
import AllCards from "./pages/cards/all-cards";
import CardDetail from "./pages/cards/card-detail";
import AllDecks from "./pages/decks/all-decks";
import DeckDetail from "./pages/decks/deck-detail";
import NewDeck from "./pages/decks/new-deck";
import Profile from "./pages/profile/profile";
import ProfileDetail from "./pages/profile/profile-detail";
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
        element: <AllCards />,
      },
      {
        path: "/cards/:id",
        element: <CardDetail />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/:id",
        element: <ProfileDetail />,
      },
      {
        path: "/tracker",
        element: <Tracker />,
      },
      {
        path: "/decks",
        element: <AllDecks />,
      },
      {
        path: "/decks/new",
        element: <NewDeck />,
      },
      {
        path: "/decks/:id",
        element: <DeckDetail />,
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
