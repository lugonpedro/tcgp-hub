import { CardProps } from "@/interfaces";
import { db } from "@/services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardWithOwned = CardProps & { owned?: boolean };

type State = {
  loading: boolean;
  dbCards: CardProps[];
  cards: CardWithOwned[];
};

type Actions = {
  getDbCards: () => Promise<void>;
  updateCards: (myCollection: string[]) => void;
};

export const useCardsContext = create(
  persist<State & Actions>(
    (set, get) => ({
      loading: false,
      dbCards: [],
      getDbCards: async () => {
        if (parseInt(import.meta.env.VITE_POKEMON_CARDS_LENGTH) === get().dbCards.length) return;
        set({ loading: true });
        const q = query(collection(db, "cards"), orderBy("created_at", "asc"));
        const snapshot = await getDocs(q);

        const cardsArr: CardProps[] = [];
        await Promise.all(
          snapshot.docs.map(async (doc) => {
            cardsArr.push(doc.data() as CardProps);
          })
        );

        set({ dbCards: cardsArr, loading: false });
      },
      cards: [],
      updateCards: async (myCollection) => {
        if (get().dbCards.length === 0) return;
        set({ loading: true });
        const cards = get().dbCards.map((card) => {
          return {
            ...card,
            owned: myCollection.includes(card.id),
          };
        });
        set({ cards: cards, loading: false });
      },
    }),
    {
      name: "cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
