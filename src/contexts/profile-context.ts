import { ProfileProps } from "@/interfaces";
import { db } from "@/services/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { create } from "zustand";

type ProfileContextProps = {
  loading: boolean,
  profile: ProfileProps | null;
  getProfile: (user_id: string) => Promise<void>;
};

export const useProfileContext = create<ProfileContextProps>((set) => ({
  loading: false,
  profile: null,
  getProfile: async (user_id) => {
    set({ profile: null, loading: true })
    const q = query(collection(db, "profiles"), where("id", "==", user_id), limit(1));
    const querySnapshot = await getDocs(q);
    const firstEl = querySnapshot.docs[0];

    if (!firstEl) {
      set({ loading: false })
      return
    }

    set({ profile: firstEl.data() as ProfileProps, loading: false })
  },
}));
