import StackedBarChart from "@/components/stacked-bar-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthContext } from "@/contexts/auth-context";
import { useCardsContext } from "@/contexts/cards-context";
import { useSetsContext } from "@/contexts/sets-context";
import { CardProps, SetProps } from "@/interfaces";
import { useEffect, useMemo, useState } from "react";

export default function Tracker() {
  const { user } = useAuthContext();
  const { sets, getSets } = useSetsContext();
  const { cards, getCards, myCards, getMyCards } = useCardsContext();

  const [setId, setSetId] = useState<string>();
  const [set, setSet] = useState<SetProps | undefined>();

  useEffect(() => {
    if (!user) return;
    getCards();
    getSets();
  }, [user]);

  useEffect(() => {
    getMyCards(user);
  }, [user]);

  useMemo(() => {
    if (!setId || !sets) return;
    const thisSet = sets.find((set) => set.id === setId);
    setSet(thisSet);
  }, [setId]);

  const setCards = useMemo(() => {
    if (!cards || !myCards || !setId) return [];
    return cards.filter((card) => card.set === setId);
  }, [cards, myCards, setId]);

  const groupedByPackage = useMemo(() => {
    return setCards.reduce(
      (acc, card) => {
        card.package.forEach((pkg) => {
          const { name } = pkg;
          if (!acc[name]) {
            acc[name] = [];
          }
          acc[name].push(card);
        });
        return acc;
      },
      {} as { [key: string]: CardProps[] }
    );
  }, [setCards]);

  const ownedCards = useMemo(() => {
    if (!set || !groupedByPackage) return [];
    return set.packs.map((p) => {
      return groupedByPackage[p.name]?.filter((card) => myCards.includes(card.id)).length;
    });
  }, [set, groupedByPackage]);

  const missingCards = useMemo(() => {
    if (!set || !groupedByPackage) return [];
    return set.packs.map((p) => {
      return groupedByPackage[p.name]?.filter((card) => !myCards.includes(card.id)).length;
    });
  }, [set, groupedByPackage]);

  if (!user) {
    return <p className="text-secondary">Faça login para ver suas estatísticas</p>;
  }

  if (!sets) {
    return <p className="text-secondary">Nenhum set encontrado</p>;
  }

  return (
    <div className="md:w-full">
      <div className="mb-8 text-secondary">
        <h1 className="text-3xl">Rastreio</h1>
        <p>Veja a quantidade obtida e faltando para cada set</p>
      </div>
      <Select onValueChange={(e) => setSetId(e)} value={setId}>
        <SelectTrigger className="text-secondary w-full mb-8">
          <SelectValue placeholder="Set" />
        </SelectTrigger>
        <SelectContent>
          {sets.map((s) => (
            <SelectItem value={s.id} key={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!set && <p className="text-secondary">Selecione um set</p>}
      {set && (
        <>
          <StackedBarChart
            labels={set.packs.map((p) => p.name)}
            datasets={[
              {
                label: "Adquiridas",
                data: ownedCards,
                backgroundColor: "white",
              },
              {
                label: "Faltando",
                data: missingCards,
                backgroundColor: "gray",
              },
            ]}
          />
          {/* <div className="cardsContainer">
            {setCards.map((card) => (
              <PokeCard key={card.id} poke={card} owned={myCards.includes(card.id)} onClick={() => {}} />
            ))}
          </div> */}
        </>
      )}
    </div>
  );
}
