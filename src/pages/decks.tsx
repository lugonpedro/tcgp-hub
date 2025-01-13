import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { authContext } from "@/contexts/auth-context";
import { useCardsContext } from "@/contexts/cards-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Decks() {
  const { user } = authContext();
  const navigate = useNavigate();

  const { getCards } = useCardsContext();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getCards();
    setLoading(false);
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
