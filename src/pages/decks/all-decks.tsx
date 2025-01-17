import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/auth-context";
import { useCardsContext } from "@/contexts/cards-context";
import { useDecksContext } from "@/contexts/decks-context";
import { formatToDate } from "@/utils/format-to-date";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllDecks() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { dbCards, getDbCards } = useCardsContext();
  const { loading, lastDecks, getLastDecks } = useDecksContext();

  useEffect(() => {
    getDbCards();
    getLastDecks(dbCards);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <h2 className="text-2xl">Decks da Comunidade</h2>
        {user && (
          <Button className="bg-secondary text-primary" onClick={() => navigate("/decks/new")}>
            Criar Deck
          </Button>
        )}
      </div>
      <div>
        {lastDecks.map((d, index1) => (
          <a href={`/decks/${d.internal_id}`} key={index1} className="bg-red-200 hover:bg-green-200">
            <p>
              Votos: {d.upvote} - {formatToDate(d.created_at, "date")}
            </p>
            <div className="grid grid-cols-5 gap-0.5 md:grid-cols-10">
              {d?.completeDeck.slice(0, 10).map((card, index2) => {
                return <img key={`${index1}${index2}`} src={card.img} />;
              })}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
