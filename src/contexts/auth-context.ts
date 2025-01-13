import { User } from "firebase/auth";
import { create } from "zustand";

type AuthContextProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthContext = create<AuthContextProps>((set) => ({
  user: null,
  setUser: (user: User | null) => set(() => ({ user: user })),
}));
