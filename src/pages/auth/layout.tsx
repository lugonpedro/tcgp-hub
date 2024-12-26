import { auth } from "@/services/firebase";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const subscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => subscribe();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
