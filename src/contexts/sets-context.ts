import { db } from "@/services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { create } from "zustand";

type State = {
  sets: SetProps[];
};

type Actions = {
  getSets: () => void;
};

export const useSetsContext = create<State & Actions>(
  (set) => ({
    sets: [],
    getSets: async () => {
      const q = query(collection(db, "sets"), orderBy("createdAt", "asc"));
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
