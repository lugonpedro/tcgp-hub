import { PokeCard } from "@/components/poke-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNumPages, getPaginatedData } from "@/services/firebase";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function Home() {
  const [data, setData] = useState<Card[]>([]);
  const [search, setSearch] = useState("");

  const numPerPage = 20;
  const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
  const [pages, setPages] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);

  // const [lastIndex, setLastIndex] = useState<any>(null);

  // const filtered = useMemo(() => {
  //   return pokes.filter((poke) => {
  //     return poke.name.toLowerCase().includes(search.toLowerCase());
  //   });
  // }, [search]);

  useEffect(() => {
    getNumPages("cards", numPerPage).then((pages) => setPages(pages));
  }, []);

  // Fetch paginated data based on page
  useEffect(() => {
    const startAfterDoc = direction === "next" ? lastDoc : undefined;
    const endBeforeDoc = direction === "prev" ? firstDoc : undefined;

    async function getData() {
      const data = await getPaginatedData("cards", "id", direction, startAfterDoc, endBeforeDoc, numPerPage);
      setData(data.result);
      setFirstDoc(data.firstDoc);
      setLastDoc(data.lastDoc);
    }

    getData();
  }, [page]);

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
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 max-w-72"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-[780px] mb-8">
        {/* {search
          ? filtered.map((card) => <PokeCard key={card.id} {...card} />)
          : pokes.map((card) => <PokeCard key={card.id} {...card} />)} */}
        {data.map((card) => (
          <PokeCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button className="bg-background text-black hover:bg-background/80" disabled={page === 1} onClick={handlePreviousClick}>
          Anterior
        </Button>

        <span className="text-background">
          Página {page} de {pages}
        </span>

        <Button className="bg-background text-black hover:bg-background/80"  disabled={page === pages} onClick={handleNextClick}>
          Próxima
        </Button>
      </div>
    </div>
  );
}

export default Home;
