import { useEffect, useState } from "react";
import { getJSON } from "./utils/get-json";

function App() {
  const [pokes, setPokes] = useState<any[]>([]);

  useEffect(() => {
    getJSON(
      "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v1.json",
      function (err, data) {
        if (err) {
          console.error(err)
          return
        }

        setPokes(data)
      }
    );
  }, []);

  return (
    <>
      <h1 className="text-3xl">TCGP Hub by Pedro Lugon</h1>
      {pokes.map((poke) => (
        <p>{poke.name}</p>
      ))}
    </>
  );
}

export default App;
