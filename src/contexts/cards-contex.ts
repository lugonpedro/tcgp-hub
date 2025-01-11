import { db } from "@/services/firebase";
import { User } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  cards: CardProps[];
  myCards: string[];
};

type Actions = {
  getCards: () => void;
  getMyCards: (user: User | null) => void;
  addToMyCards: (card: CardProps) => void;
  removeFromMyCards: (card: CardProps) => void;
};

export const useCardsContext = create(
  persist<State & Actions>(
    (set, get) => ({
      cards: [],
      getCards: async () => {
        const q = query(collection(db, "cards"), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
  
        const cardsArr: CardProps[] = [];
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            cardsArr.push(doc.data() as CardProps);
          })
        );

        set({ cards: cardsArr });
      },
      myCards: [],
      getMyCards: async (user) => {
        if (!user) return;
        const q = query(collection(db, "collections"), where("user_id", "==", user!.uid));
        const querySnapshot = await getDocs(q);
  
        const cardsArr: string[] = [];
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            cardsArr.push(doc.data().card_id);
          })
        );

        set({ myCards: cardsArr });
      },
      addToMyCards: async (card) => {
        set({ myCards: [...get().myCards, card.id] });
      },
      removeFromMyCards: async (card) => {
        set({ myCards: get().myCards.filter((c) => c !== card.id) });
      },
    }),
    {
      name: "cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
