import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function Card(poke: Card) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="rounded-xl"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.img
        src={poke.image}
        className="h-64"
        whileHover={{
          scale: 1.1,
          transition: { duration: 1 },
        }}
      />
      <AnimatePresence>
        {hover && (
          <motion.div
            className="bg-blue-500 z-50 text-white p-2 rounded absolute"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x:0, opacity: 0 }}
          >
            <p>{poke.id.toUpperCase()}</p>
            <p>{poke.craftingCost}</p>
            <p>{poke.pack} Pack</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
