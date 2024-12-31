import { authContext } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { CircleCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastAction } from "./ui/toast";

export function PokeCard(poke: Card & { owned: boolean }) {
  const { toast } = useToast();
  const [isOwned, setIsOwned] = useState<boolean>(poke.owned || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = authContext();

  const navigate = useNavigate();

  async function onClick(poke: Card) {
    if (!user) {
      toast({
        description: "Você precisa estar logado para adicionar cartas a sua coleção",
        action: (
          <ToastAction altText="Fazer Login" onClick={() => navigate("/login")}>
            Fazer Login
          </ToastAction>
        ),
      });
      return;
    }

    setIsLoading(true);

    if (!isOwned) {
      await addCardToCollection(poke);
    } else {
      await removeCardFromCollection(poke);
    }
  }

  async function addCardToCollection(poke: Card) {
    await addDoc(collection(db, "collections"), {
      card_id: poke.id,
      user_id: user!.uid,
    });
    setIsOwned(true);
    setIsLoading(false);
  }

  async function removeCardFromCollection(poke: Card) {
    const q = query(collection(db, "collections"), where("user_id", "==", user!.uid), where("card_id", "==", poke.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "collections", document.id));
      });
      setIsOwned(false);
    } else {
      toast({ description: "Algo deu errado, tente novamente", variant: "destructive" });
    }

    setIsLoading(false);
  }

  return (
    <motion.button
      className="rounded-xl disabled:opacity-10"
      onClick={() => onClick(poke)}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.5 },
      }}
      disabled={isLoading}
    >
      {isOwned && <CircleCheck className="h-16 w-16 absolute z-40 text-green-500 bg-white rounded-full" />}
      <img src={poke.img} className="h-64" />
    </motion.button>
  );
}
