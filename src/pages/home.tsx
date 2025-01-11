import Loading from "@/components/loading";
import { PokeCard } from "@/components/poke-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authContext } from "@/contexts/auth-context";
import { useCardsContext } from "@/contexts/cards-contex";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = authContext();
  const { cards, getCards, myCards, getMyCards } = useCardsContext();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const pageLimit = 20;

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getCards();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    getMyCards(user);
    setLoading(false);
  }, [user]);

  const actualCards = useMemo(() => {
    if (search.length > 2) {
      return cards.filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));
    } else {
      return cards.slice((page - 1) * pageLimit, page * pageLimit);
    }
  }, [search, page]);

  if (loading) {
    return <Loading />;
  }

  if (!loading && !cards) {
    return <div className="text-background">Nenhuma carta encontrada</div>;
  }

  return (
    <div>
      <div className="mb-8 text-background">
        <h1 className="text-3xl">TCGP Hub</h1>
        <p>Veja seu progresso de coleção, compartilhe com os amigos, monte decks compartilhaveis e mais!</p>
      </div>
      <Input
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 text-background"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-[780px] mb-8">
        {actualCards!.map((card) => (
          <PokeCard
            key={card.id}
            poke={card}
            owned={myCards.includes(card.id)}
            onClick={() => navigate("/cards/" + card.id)}
          />
        ))}
      </div>
      {search.length < 2 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            className="bg-background text-black hover:bg-background/80"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>

          <span className="text-background">
            Página {page} de {Math.floor(cards.length / pageLimit) + 1}
          </span>

          <Button
            className="bg-background text-black hover:bg-background/80"
            disabled={page === Math.floor(cards.length / pageLimit) + 1}
            onClick={() => setPage(page + 1)}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}

export default Home;
