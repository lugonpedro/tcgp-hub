import Loading from "@/components/loading";
import { PokeCard } from "@/components/poke-card";
import { useCardsContext } from "@/contexts/cards-context";
import { useDecksContext } from "@/contexts/decks-context";
import { formatToDate } from "@/utils/format-to-date";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function DeckDetail() {
  const { id } = useParams();

  const { dbCards, getDbCards } = useCardsContext();
  const { loading, deck, getDeck } = useDecksContext();

  useEffect(() => {
    getDbCards();
  }, []);

  useEffect(() => {
    if (!id) return;
    getDeck(id, dbCards);
  }, [id]);

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
      <div className="cardsContainer">{deck?.completeDeck.map((card, index) => <PokeCard key={index} poke={card} />)}</div>
    </div>
  );
}
