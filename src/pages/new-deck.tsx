import Loading from "@/components/loading";
import Paginator from "@/components/paginator";
import { PokeCard } from "@/components/poke-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authContext } from "@/contexts/auth-context";
import { useCardsContext } from "@/contexts/cards-context";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewDeck() {
  const [deck, setDeck] = useState<CardProps[]>([]);

  const { cards, getCards } = useCardsContext();
  const {user} = authContext();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const pageLimit = 20;

  const navigate = useNavigate();
  const { toast } = useToast();

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

  const addToDeck = (card: CardProps) => {
    const cardCount = deck.filter((c) => c.name === card.name).length;
    if (deck.length < 20 && cardCount < 2) {
      setDeck((prevDeck) => [...prevDeck, card]);
    } else if (cardCount === 2) {
      toast({ description: "Você só pode adicionar 2 cartas iguais ao deck" });
    } else if (deck.length === 20) {
      toast({ description: "Deck cheio" });
    }
  };

  const removeFromDeck = (card: CardProps) => {
    setDeck((prevDeck) => {
      const index = prevDeck.findIndex((c) => c.id === card.id);
      if (index !== -1) {
        const newDeck = [...prevDeck];
        newDeck.splice(index, 1);
        return newDeck;
      }
      return prevDeck;
    });
  };

  async function createDeck() {
    const res = await addDoc(collection(db, "decks"), {
      user_id: user!.uid,
      cards: deck.map((card) => card.id),
      created_at: serverTimestamp(),
      upvote: 0
    });
    toast({title: "Deck criado com sucesso", description: "Redirecionando para a página do deck"});
    setTimeout(() => {
      navigate(`/decks/${res.id}`);
    }, 1500)
    console.log(res.id)
  }

  if (loading) {
    return <Loading />;
  }

  if (!loading && !user) {
    return <div className="text-secondary">Faça login criar um deck</div>;
  }

  if (!loading && !cards) {
    return <div className="text-secondary">Nenhuma carta encontrada</div>;
  }

  return (
    <div>
      <h2>Novo Deck</h2>
      <div className="mb-8">
        <div className="grid grid-cols-5 gap-2 md:grid-cols-10 mb-4">
          {Array(20)
            .fill(null)
            .map((_, index) => (
              <div key={index}>
                {deck[index] ? (
                  <img
                    src={deck[index].img}
                    alt={deck[index].name}
                    className="cursor-pointer"
                    onClick={() => removeFromDeck(deck[index])}
                  />
                ) : (
                  <img src="/flip.png" alt="Placeholder" />
                )}
              </div>
            ))}
        </div>
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <Button className="bg-secondary text-primary" disabled={deck.length !== 20} onClick={createDeck}>
            Criar
          </Button>
          <p>{deck.length}/20</p>
        </div>
      </div>
      <Input
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 text-secondary"
      />
      <div className="flex flex-col items-center justify-center">
        <div className="cardsContainer">
          {actualCards!.map((card) => (
            <PokeCard key={card.id} poke={card} onClick={() => addToDeck(card)} />
          ))}
        </div>
        {search.length < 2 && <Paginator page={page} setPage={setPage} cards={cards} pageLimit={pageLimit} />}
      </div>
    </div>
  );
}
