export default function About() {
  const titleClass = "text-3xl font-semibold";

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className={titleClass}>Disclaimer</h2>
        <p>
          Todas as imagens, nomes, personagens e marcas relacionadas de Pokémon são marcas registradas e direitos
          autorais da The Pokémon Company, Nintendo, Game Freak ou Creatures Inc. (“Pokémon Rights Holders”). TCGP Hub é
          um site de fãs não oficial e não é endossado ou afiliado aos Pokémon Rights Holders.
        </p>
      </div>
      <div>
        <h2 className={titleClass}>Roadmap</h2>
        <ul>
          <li>✅ Cartas sempre Atualizadas</li>
          <li>⌛️ Detalhes da Carta</li>
          <li>✅ Progresso de Coleção</li>
          <li>⌛️ Decks da Comunidade</li>
          <li>⌛️ Página de Perfil</li>
          <li>⌛️ Iniciativa de Trocas</li>
          <li>⌛️ Report de Bugs</li>
        </ul>
      </div>
      <div>
        <h2 className={titleClass}>Desenvolvimento</h2>
        <p>
          A plataforma ainda está em construção, mesmo que o roadmap mostre como ✅ as funcionalidades ainda serão
          melhoradas e terão bugs corrigidos.
        </p>
        <p>
          É um projeto open-source e caso queira contribuir é só acessar o link{" "}
          <a href="https://github.com/lugonpedro/tcgp-hub" target="_blank" className="underline">
            do repositório
          </a>
          .
        </p>
      </div>
      <div>
        <h2 className={titleClass}>Caso encontre bugs/erros</h2>
        <p>
          Tente limpar o cache do navegador ou acessar a plataforma em modo anônimo. Caso o erro persista, por favor
          entre em contato com o e-mail{" "}
          <a href="mailto:pedrolugonm@gmail.com?subject=Erro na plataforma TCGPHub" className="underline">
            pedrolugonm@gmail.com
          </a>
          .
        </p>
      </div>
      <div>
        <h2 className={titleClass}>Copyright</h2>
        <p>
          Feito com ❤️ por{" "}
          <a target="_blank" href="https://lugon.dev" className="underline">
            Pedro Lugon
          </a>
        </p>
        <p>Versão 17/01/2025 - v0.0.5</p>
      </div>
    </div>
  );
}
