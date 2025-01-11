import Loading from "@/components/loading";
import { PokeCard } from "@/components/poke-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authContext } from "@/contexts/auth-context";
import { useCardsContext } from "@/contexts/cards-contex";
import { db, getNumPages, getPaginatedData } from "@/services/firebase";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { collection, DocumentSnapshot, getDocs, limit, query, where } from "firebase/firestore";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = authContext();
  const [data, setData] = useState<CardProps[]>([]);
  const { cards, getUserCards } = useCardsContext();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const numPerPage = 20;
  const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
  const [pages, setPages] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);

  useEffect(() => {
    getNumPages("cards", numPerPage).then((pages) => setPages(pages));
  }, []);

  useEffect(() => {
    const startAfterDoc = direction === "next" ? lastDoc : undefined;
    const endBeforeDoc = direction === "prev" ? firstDoc : undefined;

    async function getData() {
      setLoading(true);
      const data = await getPaginatedData("cards", "createdAt", direction, startAfterDoc, endBeforeDoc, numPerPage);
      setData(data.result);
      setFirstDoc(data.firstDoc);
      setLastDoc(data.lastDoc);
      setLoading(false);
    }

    getData();
  }, [page]);

  useEffect(() => {
    getUserCards(user);
  }, [user]);

  async function searchFilter(search: string) {
    const q = query(collection(db, "cards"), where("name", ">=", search), limit(20));
    const querySnapshot = await getDocs(q);

    const cards: CardProps[] = [];
    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        cards.push(doc.data() as CardProps);
      })
    );

    setFiltered(cards);
    setLoading(false);
  }

  const debounceSearch = useCallback(
    debounce(async (search: string) => await searchFilter(capitalizeFirstLetter(search)), 1000),
    []
  );

  useEffect(() => {
    if (search.length > 2) {
      setLoading(true);
      setFiltered([]);
      debounceSearch(search);
    }
  }, [search]);

  const handlePreviousClick = () => {
    if (page === 1) return;
    setDirection("prev");
    setPage((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (page === pages) return;
    setDirection("next");
    setPage((prev) => prev + 1);
  };

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
        {loading && <Loading />}
        {!loading &&
          search.length < 2 &&
          data.map((card) => (
            <PokeCard
              key={card.id}
              poke={card}
              owned={cards.includes(card.id)}
              onClick={() => navigate("/cards/" + card.id)}
            />
          ))}
        {!loading &&
          search.length > 2 &&
          filtered.map((card) => (
            <PokeCard
              key={card.id}
              poke={card}
              owned={cards.includes(card.id)}
              onClick={() => navigate("/cards/" + card.id)}
            />
          ))}
      </div>
      {search.length < 2 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            className="bg-background text-black hover:bg-background/80"
            disabled={page === 1}
            onClick={handlePreviousClick}
          >
            Anterior
          </Button>

          <span className="text-background">
            Página {page} de {pages}
          </span>

          <Button
            className="bg-background text-black hover:bg-background/80"
            disabled={page === pages}
            onClick={handleNextClick}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}

export default Home;
