import Loading from "@/components/loading";
import Paginator from "@/components/paginator";
import { PokeCard } from "@/components/poke-card";
import { Input } from "@/components/ui/input";
import { useCardsContext } from "@/contexts/cards-contex";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const { cards, getCards } = useCardsContext();
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

  const actualCards = useMemo(() => {
    if (search.length > 2) {
      return cards.filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));
    } else {
      return cards.slice((page - 1) * pageLimit, page * pageLimit);
    }
  }, [search, page, cards]);

  if (loading) {
    return <Loading />;
  }

  if (!loading && !cards) {
    return <div className="text-secondary">Nenhuma carta encontrada</div>;
  }

  return (
    <div>
      <div className="mb-8 text-secondary">
        <h1 className="text-3xl">TCGP Hub</h1>
        <p>Veja seu progresso de coleção, compartilhe com os amigos, monte decks compartilhaveis e mais!</p>
      </div>
      <Input
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 text-secondary"
      />
      <div className="cardsContainer">
        {actualCards!.map((card) => (
          <PokeCard key={card.id} poke={card} onClick={() => navigate("/cards/" + card.id)} />
        ))}
      </div>
      {search.length < 2 && <Paginator page={page} setPage={setPage} cards={cards} pageLimit={pageLimit} />}
    </div>
  );
}

export default Home;
