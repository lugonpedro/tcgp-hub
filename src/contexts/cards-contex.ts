import { db } from "@/services/firebase";
import { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardWithOwned = CardProps & { owned?: boolean };

type State = {
  cards: CardWithOwned[];
  myCards: string[];
};

type Actions = {
  getCards: () => void;
  getMyCards: (user: User | null) => void;
  addToMyCards: (user: User | null, card: CardWithOwned) => Promise<void>;
  removeFromMyCards: (user: User | null, card: CardWithOwned) => Promise<void>;
};

export const useCardsContext = create(
  persist<State & Actions>(
    (set, get) => ({
      cards: [],
      getCards: async () => {
        const q = query(collection(db, "cards"), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);

        const cardsArr: CardWithOwned[] = [];
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            cardsArr.push({ ...doc.data(), owned: get().myCards.includes(doc.data().id) } as CardWithOwned);
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
      addToMyCards: async (user, card) => {
        await addDoc(collection(db, "collections"), {
          card_id: card.id,
          user_id: user!.uid,
        });
        set({ cards: get().cards.map((c) => c.id === card.id ? { ...c, owned: true } : c) });
        set({ myCards: [...get().myCards, card.id] });
      },
      removeFromMyCards: async (user, card) => {
        const q = query(collection(db, "collections"), where("user_id", "==", user!.uid), where("card_id", "==", card.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (document) => {
            await deleteDoc(doc(db, "collections", document.id));
          });

          set({ cards: get().cards.map((c) => c.id === card.id ? { ...c, owned: false } : c) });
          set({ myCards: get().myCards.filter((c) => c !== card.id) });
        }
      },
    }),
    {
      name: "cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
