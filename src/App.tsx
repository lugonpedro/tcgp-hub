import { useEffect, useState } from "react";
import { getJSON } from "./utils/get-json";
import { Card } from "./components/Card";

function App() {
  const [pokes, setPokes] = useState<Card[]>([]);

  useEffect(() => {
    getJSON(
      "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v1.json",
      function (err, data) {
        if (err) {
          console.error(err);
          return;
        }

        console.log(data);
        setPokes(data);
      }
    );
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-8">TCGP Hub by Pedro Lugon</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-[780px]">
        {pokes.map((poke) => (
          <Card key={poke.id} {...poke} />
        ))}
      </div>
    </div>
  );
}

export default App;
