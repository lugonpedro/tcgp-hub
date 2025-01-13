import { CardProps, DeckProps } from "@/interfaces";
import { db } from "@/services/firebase";
import { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardWithOwned = CardProps & { owned?: boolean };

type State = {
  loading: boolean;
  cards: CardWithOwned[];
  myCards: string[];
  deck: DeckProps | null;
};

type Actions = {
  getCards: () => Promise<void>;
  getMyCards: (user: User | null) => Promise<void>;
  addToMyCards: (user: User | null, card: CardWithOwned) => Promise<void>;
  removeFromMyCards: (user: User | null, card: CardWithOwned) => Promise<void>;
  getDeck: (id: string) => Promise<void>;
};

export const useCardsContext = create(
  persist<State & Actions>(
    (set, get) => ({
      loading: false,
      cards: [],
      getCards: async () => {
        set({ loading: true });
        const q = query(collection(db, "cards"), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);

        const cardsArr: CardWithOwned[] = [];
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            cardsArr.push({ ...doc.data(), owned: get().myCards.includes(doc.data().id) } as CardWithOwned);
          })
        );

        set({ cards: cardsArr, loading: false });
      },
      myCards: [],
      getMyCards: async (user) => {
        if (!user) return;
        set({ loading: true });
        const q = query(collection(db, "collections"), where("user_id", "==", user!.uid));
        const querySnapshot = await getDocs(q);

        const cardsArr: string[] = [];
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            cardsArr.push(doc.data().card_id);
          })
        );

        set({ myCards: cardsArr, loading: false });
      },
      addToMyCards: async (user, card) => {
        await addDoc(collection(db, "collections"), {
          card_id: card.id,
          user_id: user!.uid,
        });
        set({ cards: get().cards.map((c) => (c.id === card.id ? { ...c, owned: true } : c)) });
        set({ myCards: [...get().myCards, card.id] });
      },
      removeFromMyCards: async (user, card) => {
        const q = query(
          collection(db, "collections"),
          where("user_id", "==", user!.uid),
          where("card_id", "==", card.id)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (document) => {
            await deleteDoc(doc(db, "collections", document.id));
          });

          set({ cards: get().cards.map((c) => (c.id === card.id ? { ...c, owned: false } : c)) });
          set({ myCards: get().myCards.filter((c) => c !== card.id) });
        }
      },
      deck: null,
      getDeck: async (id) => {
        set({ deck: null, loading: true });
        const deckRef = doc(db, "decks", id);
        const deckSnap = await getDoc(deckRef);

        if (!deckSnap.exists()) {
          set({ loading: false });
          return;
        }

        let user_id;
        let deck = {};

        const deckData = deckSnap.data();
        const completeDeck = deckData.cards.map((card_id: string) => {
          return get().cards.find((card) => card.id === card_id);
        });
        user_id = deckData.user_id;
        deck = {
          ...deck,
          cards: completeDeck,
          upvote: deckData.upvote,
          created_at: deckData.created_at,
        };

        const userRef = doc(db, "profiles", user_id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          set({ loading: false });
          return;
        }

        const userData = userSnap.data();
        deck = {
          ...deck,
          user: {
            id: userData.id,
            name: userData.name,
            nick: userData.nick,
          },
        };

        set({ deck: deck as DeckProps, loading: false });
      },
    }),
    {
      name: "cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
