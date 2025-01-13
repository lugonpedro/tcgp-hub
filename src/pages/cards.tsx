import Loading from "@/components/loading";
import Paginator from "@/components/paginator";
import { PokeCard } from "@/components/poke-card";
import Table from "@/components/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

  const [list, setList] = useState<boolean>(false);

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
  }, [search, page, cards, myCards]);

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
    return <div className="text-secondary">Nenhuma carta encontrada</div>;
  }

  return (
    <div>
      <div className="mb-8 text-secondary">
        <h1 className="text-3xl">Minhas cartas</h1>
        <p>Gerencie sua coleção</p>
        <div>
          <Switch checked={list} onCheckedChange={() => setList(!list)} />
          <span>Lista</span>
        </div>
      </div>
      <Input
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 text-secondary"
      />
      <div className="cardsContainer">
        {!list &&
          actualCards!.map((card) => (
            <PokeCard
              key={card.id}
              poke={card}
              owned={myCards.includes(card.id)}
              onClick={() => onClick(card)}
              disabled={loadingCard}
            />
          ))}
        {list && <Table />}
      </div>
      {search.length < 2 && <Paginator page={page} setPage={setPage} cards={cards} pageLimit={pageLimit} />}
    </div>
  );
}
