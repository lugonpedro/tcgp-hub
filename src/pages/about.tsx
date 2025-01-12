export default function About() {
  return (
    <div className="flex flex-col gap-2">
      <p>
        Todas as imagens, nomes, personagens e marcas relacionadas de Pokémon são marcas registradas e direitos autorais
        da The Pokémon Company, Nintendo, Game Freak ou Creatures Inc. (“Pokémon Rights Holders”). TCGP Hub é um site de
        fãs não oficial e não é endossado ou afiliado aos Pokémon Rights Holders.
      </p>
      <p>
        Feito com ❤️ por{" "}
        <a target="_blank" href="https://lugon.dev" className="underline">
          Pedro Lugon
        </a>
      </p>
    </div>
  );
}
