import { CardProps, DeckProps } from "@/interfaces";
import { db } from "@/services/firebase";
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { create } from "zustand";

type State = {
  loading: boolean;
  deck: DeckProps | null;
  lastDecks: DeckProps[];
};

type Actions = {
  getDeck: (id: string, dbCards: CardProps[]) => Promise<void>;
  getLastDecks: (dbCards: CardProps[]) => Promise<void>;
};

export const useDecksContext = create<State & Actions>(
    (set, _) => ({
      loading: false,
      deck: null,
      getDeck: async (id, dbCards) => {
        set({ deck: null, loading: true });
        const ref = doc(db, "decks", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          set({ loading: false });
          return;
        }

        let user_id;
        let deck = {};

        const deckData = snap.data();
        const completeDeck = deckData.cards.map((card_id: string) => {
          return dbCards.find((card) => card.id === card_id);
        });
        user_id = deckData.user_id;
        deck = {
          ...deck,
          completeDeck,
          cards: deckData.cards,
          upvote: deckData.upvote,
          created_at: deckData.created_at,
        };

        const ref2 = doc(db, "profiles", user_id);
        const snap2 = await getDoc(ref2);

        if (!snap2.exists()) {
          set({ loading: false });
          return;
        }

        const userData = snap2.data();
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
      lastDecks: [],
      getLastDecks: async (dbCards) => {
        set({ loading: true });
        const q = query(collection(db, "decks"), orderBy("created_at", "desc"), limit(5));
        const snapshot = await getDocs(q);

        const arr: DeckProps[] = [];
        await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data()
            const completeDeck = data.cards.map((card_id: string) => {
              return dbCards.find((card) => card.id === card_id);
            });
            arr.push({...data, internal_id: doc.id, completeDeck} as DeckProps);
          })
        );

        set({ lastDecks: arr, loading: false });
      }
    }),
);
