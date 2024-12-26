import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/ui/toaster.tsx";
import { router } from "./router.tsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <Toaster />
  </>
);
