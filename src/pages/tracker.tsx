import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authContext } from "@/contexts/auth-context";
import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function Tracker() {
  const { user } = authContext();
  const [data, setData] = useState<CardProps[]>([]);
  const [userCards, setUserCards] = useState<string[]>([]);

  const [set, setSet] = useState<string>();

  useEffect(() => {
    async function getUserCards() {
      const q = query(collection(db, "collections"), where("user_id", "==", user!.uid));
      const querySnapshot = await getDocs(q);

      const cards: string[] = [];
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          cards.push(doc.data().card_id);
        })
      );

      setUserCards(cards);
    }

    if (!user) return;
    getUserCards();
  }, [user]);

  useEffect(() => {
    async function getSetData() {
      const q = query(collection(db, "cards"), where("set", "==", set));
      const querySnapshot = await getDocs(q);

      const cards: CardProps[] = [];
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          cards.push(doc.data() as CardProps);
        })
      );

      setData(cards);
    }

    if (!set) return;
    getSetData();
  }, [set]);

  const actualUserCards = useMemo(() => {
    if (!data || !userCards) return [];
    const cards = data.filter((card) => userCards.includes(card.id));
    return cards;
  }, [userCards, data]);

  const packages = useMemo(() => {
    if (!actualUserCards) return [];

    const uniquePackages: PackProps[] = [];
    const packageSet = new Set();

    for (const card of actualUserCards) {
      for (const pack of card.package) {
        if (!packageSet.has(pack.name)) {
          packageSet.add(pack.name);
          uniquePackages.push(pack);
        }
      }
    }

    return uniquePackages;
  }, [actualUserCards]);

  const userCardsPerPackage = useMemo(() => {
    if (!actualUserCards || !packages) return [];

    const cardsPerPackage: Record<string, number> = {};
    for (const card of actualUserCards) {
      for (const pack of card.package) {
        if (cardsPerPackage[pack.name]) {
          cardsPerPackage[pack.name]++;
        } else {
          cardsPerPackage[pack.name] = 1;
        }
      }
    }
    console.log(cardsPerPackage);
    return cardsPerPackage;
  }, [actualUserCards, packages]);

  if (!user) {
    return <p className="text-background">Faça login para ver suas estatísticas</p>;
  }

  return (
    <>
      <Select onValueChange={(e) => setSet(e)} value={set}>
        <SelectTrigger className="text-background w-full">
          <SelectValue placeholder="Set" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a1">Genetic Apex</SelectItem>
          <SelectItem value="a1a">Mythical Island</SelectItem>
        </SelectContent>
      </Select>
      {actualUserCards.length > 0 && (
        <div className="text-background mt-4 w-full">
          <div className="flex flex-col gap-4">
            {packages.map((pack, index) => (
              <div key={index} className="flex items-center">
                <img src={pack.img} alt={pack.name} className="h-12" />
                <p>{(userCardsPerPackage as Record<string, number>)[pack.name]}</p>
              </div>
            ))}
            <p>
              Total: {actualUserCards.length}/{data.length}
            </p>
          </div>
        </div>
      )}
      {userCards.length > 0 &&
        actualUserCards.map((card) => {
          return <p>{card.name}</p>;
        })}

      {JSON.stringify(userCardsPerPackage)}
    </>
  );
}
