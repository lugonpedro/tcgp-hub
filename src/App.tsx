import { useEffect, useMemo, useState } from "react";
import { getJSON } from "./utils/get-json";
import { Card } from "./components/Card";
import { Input } from "./components/ui/input";
import { useToast } from "./hooks/use-toast";

function App() {
  const [pokes, setPokes] = useState<Card[]>([]);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return pokes.filter((poke) => {
      return poke.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  useEffect(() => {
    getJSON(
      "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v1.json",
      function (err, data) {
        if (err) {
          toast({ description: "Failed to load data", variant: "destructive" });
          console.error(err);
          return;
        }

        setPokes(data);
      }
    );
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-8">TCGP Hub</h1>
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 max-w-72"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-[780px]">
        {filtered ? filtered.map((poke) => (
          <Card key={poke.id} {...poke} />
        )) : pokes.map((poke) => (
          <Card key={poke.id} {...poke} />
        ))}
        {filtered.length === 0 && <p className="text-2xl">No results</p>}
      </div>
    </div>
  );
}

export default App;
