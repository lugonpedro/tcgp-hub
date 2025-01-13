import Loading from "@/components/loading";
import Paginator from "@/components/paginator";
import { PokeCard } from "@/components/poke-card";
import Table from "@/components/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToastAction } from "@/components/ui/toast";
import { authContext } from "@/contexts/auth-context";
import { CardWithOwned, useCardsContext } from "@/contexts/cards-context";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
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

  const [list, setList] = useState<boolean>(true);

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

  async function onClick(poke: CardWithOwned) {
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
      await removeFromMyCards(user, poke);
    } else {
      await addToMyCards(user, poke);
    }

    setLoadingCard(false);
  }

  const columns: ColumnDef<CardWithOwned>[] = [
    {
      accessorKey: "owned",
      header: "",
      cell: (el) => (
        <Checkbox
          checked={el.row.original.owned}
          className="bg-secondary data-[state=checked]:bg-green-500 data-[state=checked]:text-primary"
          onClick={() => onClick(el.row.original)}
          disabled={loadingCard}
        />
      ),
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "img",
      header: "Img",
      cell: (el) => (
        <>
          <img src={el.row.original.img} className="h-12" />
        </>
      ),
    },
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "rarity",
      header: "Raridade",
      cell: (el) => {
        const rarityCount = el.row.original.rarity.rarity;
        return (
          <div className="flex flex-row gap-0.5">
            {Array.from({ length: rarityCount }).map((_, index) => (
              <img key={index} src={`/${el.row.original.rarity.type}.png`} className="w-4 h-4" />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "set",
      header: "Set",
    },
  ];

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
        <div className="flex items-center gap-1">
          <Switch
            checked={list}
            onCheckedChange={() => setList(!list)}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
          />
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
            <PokeCard key={card.id} poke={card} onClick={() => onClick(card)} disabled={loadingCard} showOwned />
          ))}
        {list && <Table data={actualCards} columns={columns} />}
      </div>
      {search.length < 2 && <Paginator page={page} setPage={setPage} cards={cards} pageLimit={pageLimit} />}
    </div>
  );
}
