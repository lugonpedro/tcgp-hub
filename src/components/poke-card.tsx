import { CircleCheck } from "lucide-react";
import { motion } from "motion/react";
import { ButtonHTMLAttributes } from "react";
interface PokeCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  poke: CardProps;
  owned: boolean;
  onClick: () => void;
}

export function PokeCard({ poke, owned, ...props }: PokeCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.5 },
      }}
    >
      <button {...props} className="rounded-xl disabled:opacity-10" type="button">
        {owned && <CircleCheck className="h-16 w-16 absolute z-40 text-green-500 bg-white rounded-full" />}
        <img src={poke.img} className="h-64" />
      </button>
    </motion.div>
  );
}
