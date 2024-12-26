import { create } from "zustand";
import { User } from 'firebase/auth'

type AuthContextProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const authContext = create<AuthContextProps>((set) => ({
  user: null,
  setUser: (user: User | null) => set(() => ({ user: user })),
}));