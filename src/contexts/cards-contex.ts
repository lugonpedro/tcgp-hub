import { db } from "@/services/firebase";
import { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardWithOwned = CardProps & { owned?: boolean };

type State = {
  cards: CardWithOwned[];
  myCards: string[];
  deck: CardProps[]
};

type Actions = {
  getCards: () => void;
  getMyCards: (user: User | null) => void;
  addToMyCards: (user: User | null, card: CardWithOwned) => Promise<void>;
  removeFromMyCards: (user: User | null, card: CardWithOwned) => Promise<void>;
  getDeck: (id: string) => void;
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
      deck: [],
      getDeck: async (id) => {
        set({ deck: [] });
        const docRef = doc(db, "decks", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const deckData = docSnap.data();
          const completeDeck = deckData.cards.map((card_id: string) => {
            return get().cards.find(card => card.id === card_id);
          });
          set({ deck: completeDeck });
        }
      },
    }),
    {
      name: "cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
