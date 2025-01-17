import { CardProps } from "@/interfaces";
import { db } from "@/services/firebase";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardWithOwned = CardProps & { owned?: boolean };

type State = {
  loading: boolean;
  myCollection: string[];
};

type Actions = {
  getMyCollection: (user: User | null) => Promise<void>;
  addToMyCollection: (user: User | null, card: CardWithOwned) => Promise<void>;
  removeFromMyCollection: (user: User | null, card: CardWithOwned) => Promise<void>;
};

export const useCollectionsContext = create(
  persist<State & Actions>(
    (set, get) => ({
      loading: false,
      myCollection: [],
      getMyCollection: async (user) => {
        if (!user) return;
        set({ loading: true });

        const ref = doc(db, "collections", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          set({ loading: false });
          return;
        }

        set({ myCollection: snap.data().cards as string[], loading: false });
      },
      addToMyCollection: async (user, card) => {
        const actualCollection = get().myCollection;
        if (actualCollection.includes(card.id)) return;
        set({ loading: true });

        actualCollection.push(card.id);

        try {
          await setDoc(doc(db, "collections", user!.uid), {
            cards: actualCollection,
          });
        } catch (ex: unknown) {
          throw new Error(ex as string);
        }

        set({ myCollection: actualCollection, loading: false });
      },
      removeFromMyCollection: async (user, card) => {
        const actualCollection = get().myCollection;
        if (!actualCollection.includes(card.id)) return;
        set({ loading: true });

        const newCollection = actualCollection.filter((c) => c !== card.id);

        try {
          await setDoc(doc(db, "collections", user!.uid), {
            cards: newCollection,
          });
        } catch (ex: unknown) {
          throw new Error(ex as string);
        }
        
        set({ myCollection: newCollection, loading: false });
      },
    }),
    {
      name: "my-collection",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
