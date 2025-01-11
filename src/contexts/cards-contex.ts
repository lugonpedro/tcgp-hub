import { db } from "@/services/firebase";
import { User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  cards: string[];
};

type Actions = {
  getUserCards: (user: User | null) => void;
  add: (card: Card) => void;
  remove: (card: Card) => void;
};

export const useCardsContext = create(
  persist<State & Actions>(
    (set, get) => ({
      cards: [],
      getUserCards: async (user) => {
        if (!user) return;
        const q = query(collection(db, "collections"), where("user_id", "==", user!.uid));
        const querySnapshot = await getDocs(q);
  
        const cardsArr: string[] = [];
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            cardsArr.push(doc.data().card_id);
          })
        );

        set({ cards: cardsArr });
      },
      add: async (card) => {
        set({ cards: [...get().cards, card.id] });
      },
      remove: async (card) => {
        set({ cards: get().cards.filter((c) => c !== card.id) });
      },
    }),
    {
      name: "cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
