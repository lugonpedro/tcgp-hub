import Loading from "@/components/loading";
import { PokeCard } from "@/components/poke-card";
import { useCardsContext } from "@/contexts/cards-contex";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Deck() {
  const { id } = useParams();

  const { deck, getCards, getDeck } = useCardsContext();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getCards();
    getDeck(id!);
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!loading && !deck) {
    return <div className="text-secondary">Deck não encontrado</div>;
  }

  return (
    <div>
      <div className="cardsContainer">
        {deck!.map((card) => (
          <PokeCard key={card.id} poke={card} />
        ))}
      </div>
    </div>
  );
}
