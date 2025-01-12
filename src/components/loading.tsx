import { motion } from "motion/react";

export default function Loading() {
  return (
    <motion.img
      src="./flip.png"
      className="h-16 w-16 md:h-32 md:w-32"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 2,
      }}
    />
  );
}
