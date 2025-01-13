export default function About() {
  return (
    <div className="flex flex-col gap-2">
      <p>
        Todas as imagens, nomes, personagens e marcas relacionadas de Pokémon são marcas registradas e direitos autorais
        da The Pokémon Company, Nintendo, Game Freak ou Creatures Inc. (“Pokémon Rights Holders”). TCGP Hub é um site de
        fãs não oficial e não é endossado ou afiliado aos Pokémon Rights Holders.
      </p>
      <p>
        O site ainda está em construção, tanto as funcionalidades quanto o design e é um projeto open-source, caso queira
        contribuir{" "}
        <a href="https://github.com/lugonpedro/tcgp-hub" target="_blank" className="underline">
          esse é o repositório
        </a>
        .
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
