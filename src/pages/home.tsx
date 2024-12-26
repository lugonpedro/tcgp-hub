import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/poke-card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

function Home() {
  const [pokes, setPokes] = useState<Card[]>([]);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return pokes.filter((poke) => {
      return poke.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  useEffect(() => {
    getPokes()
  }, []);

  async function getPokes() {
    // const [status, data] = await getPokeJSON();
    // if (status !== 200) {
    //   toast({ description: "Failed to load data", variant: "destructive" });
    //   console.error(data);
    //   return;
    // }

    // setPokes(data);
  }

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl">TCGP Hub</h1>
        <p>
          See your collection progress, share with friends, build decks and
          more!
        </p>
      </div>
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 max-w-72"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-[780px]">
        {search
          ? filtered.map((poke) => <Card key={poke.id} {...poke} />)
          : pokes.map((poke) => <Card key={poke.id} {...poke} />)}
        {filtered.length === 0 && <p className="text-2xl">No results</p>}
      </div>
    </div>
  );
}

export default Home;
