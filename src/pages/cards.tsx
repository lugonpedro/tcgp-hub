import Loading from "@/components/loading";
import { PokeCard } from "@/components/poke-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { authContext } from "@/contexts/auth-context";
import { useCardsContext } from "@/contexts/cards-contex";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cards() {
  const { user } = authContext();
  const { cards, getCards, myCards, getMyCards, addToMyCards, removeFromMyCards } = useCardsContext();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCard, setLoadingCard] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const pageLimit = 20;

  const navigate = useNavigate();
  const { toast } = useToast();

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

  async function onClick(poke: CardProps) {
    if (!user) {
      toast({
        description: "Você precisa estar logado para adicionar cartas a sua coleção",
        action: (
          <ToastAction altText="Fazer Login" onClick={() => navigate("/login")}>
            Fazer Login
          </ToastAction>
        ),
      });
      return;
    }

    setLoadingCard(true);

    if (myCards.includes(poke.id)) {
      await remove(poke);
    } else {
      await add(poke);
    }

    setLoadingCard(false);
  }

  async function add(poke: CardProps) {
    addToMyCards(poke);
    await addDoc(collection(db, "collections"), {
      card_id: poke.id,
      user_id: user!.uid,
    });
  }

  async function remove(poke: CardProps) {
    const q = query(collection(db, "collections"), where("user_id", "==", user!.uid), where("card_id", "==", poke.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "collections", document.id));
      });
      removeFromMyCards(poke);
    } else {
      toast({ description: "Algo deu errado, tente novamente", variant: "destructive" });
    }
  }

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
          <PokeCard key={card.id} poke={card} owned={myCards.includes(card.id)} onClick={() => onClick(card)} disabled={loadingCard} />
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
