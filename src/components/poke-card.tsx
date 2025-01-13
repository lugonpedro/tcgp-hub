import { CardWithOwned } from "@/contexts/cards-contex";
import { CircleCheck } from "lucide-react";
import { motion } from "motion/react";
import { ButtonHTMLAttributes } from "react";
interface PokeCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  poke: CardWithOwned;
  owned?: boolean;
  onClick: () => void;
}

export function PokeCard({ poke, ...props }: PokeCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.5 },
      }}
    >
      <button {...props} className="rounded-xl disabled:opacity-10" type="button">
        {poke.owned && (
          <CircleCheck className="h-8 w-8 md:h-16 md:w-16 absolute z-40 text-green-500 bg-white rounded-full" />
        )}
        <img src={poke.img} className="md:h-64" />
      </button>
    </motion.div>
  );
}
