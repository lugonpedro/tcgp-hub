import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/auth-context";
import { useCardsContext } from "@/contexts/cards-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllDecks() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { loading, getCards } = useCardsContext();

  useEffect(() => {
    getCards();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {user && (
        <Button className="bg-secondary text-primary" onClick={() => navigate("/decks/new")}>
          Criar Deck
        </Button>
      )}
      <div>
        <p>Decks da Comunidade</p>
      </div>
    </div>
  );
}
