import { db } from "@/services/firebase";
import { User } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";
import { create } from "zustand";

type State = {
  sets: SetProps[];
};

type Actions = {
  getSets: (user: User | null) => void;
};

export const useSetsContext = create<State & Actions>(
  (set) => ({
    sets: [],
    getSets: async (user) => {
      if (!user) return;
      const q = query(collection(db, "sets"));
      const querySnapshot = await getDocs(q);

      const setsArr: SetProps[] = [];
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          setsArr.push(doc.data() as SetProps);
        })
      );

      set({ sets: setsArr });
    },
  })
);
