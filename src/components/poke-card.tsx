import { authContext } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { CircleCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function PokeCard(poke: Card) {
  const { toast } = useToast();
  const [hover, setHover] = useState(false);
  const [checked, setChecked] = useState(false);

  const { user } = authContext();

  async function onClick() {
    if (!user) {
      toast({ description: "Você precisa estar logado para adicionar cartas a sua coleção" });
      return;
    }

    setChecked(!checked);
    console.log(poke);
  }

  return (
    <motion.div
      className="rounded-xl"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.5 },
      }}
    >
      {checked && <CircleCheck className="absolute z-40 text-green-500 bg-white rounded-full" />}
      <img src={poke.img} className="h-64" />
      <AnimatePresence>
        {hover && (
          <motion.div
            className="bg-background z-50 text-black bottom-0 p-2 rounded absolute"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 0, opacity: 0 }}
          >
            <p>{poke.id.toUpperCase()}</p>
            <p>
              {poke.package.map((pack, index) => (
                <span key={pack.name}>
                  {pack.name}
                  {index < poke.package.length - 1 && ", "}
                </span>
              ))}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
