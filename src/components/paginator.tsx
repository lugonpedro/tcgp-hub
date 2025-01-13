import { CardProps } from "@/interfaces";
import { Button } from "./ui/button";

interface PaginatorProps {
  page: number;
  setPage: (page: number) => void;
  cards: CardProps[];
  pageLimit: number;
}

export default function Paginator({ page, setPage, cards, pageLimit }: PaginatorProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        className="bg-secondary text-black hover:bg-secondary/80"
        disabled={page === 1}
        onClick={() => setPage(1)}
      >
        &#60;&#60;
      </Button>
      <Button
        className="bg-secondary text-black hover:bg-secondary/80"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        &#60;
      </Button>

      <span className="text-secondary">
        Página {page} de {Math.floor(cards.length / pageLimit) + 1}
      </span>

      <Button
        className="bg-secondary text-black hover:bg-secondary/80"
        disabled={page === Math.floor(cards.length / pageLimit) + 1}
        onClick={() => setPage(page + 1)}
      >
        &#62;
      </Button>
      <Button
        className="bg-secondary text-black hover:bg-secondary/80"
        disabled={page === Math.floor(cards.length / pageLimit) + 1}
        onClick={() => setPage(Math.floor(cards.length / pageLimit) + 1)}
      >
        &#62;&#62;
      </Button>
    </div>
  );
}
