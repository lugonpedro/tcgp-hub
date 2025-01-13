import Loading from "@/components/loading";
import { PokeCard } from "@/components/poke-card";
import { useCardsContext } from "@/contexts/cards-context";
import { formatToDate } from "@/utils/format-to-date";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Deck() {
  const { id } = useParams();

  const { loading, deck, getCards, getDeck } = useCardsContext();

  useEffect(() => {
    getCards();
    getDeck(id!);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!loading && !deck) {
    return <div className="text-secondary">Deck não encontrado</div>;
  }

  return (
    <div>
      <div className="mb-8 text-secondary">
        {deck?.user?.id && (
          <p>
            Deck do usuário{" "}
            <a href={`/profile/${deck.user.id}`} className="underline">
              {deck.user.nick ?? deck.user.name ?? deck.user.id}
            </a>
          </p>
        )}
        <p>Criado em: {formatToDate(deck!.created_at)}</p>
      </div>
      <div className="cardsContainer">{deck?.cards.map((card, index) => <PokeCard key={index} poke={card} />)}</div>
    </div>
  );
}
