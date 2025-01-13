import Loading from "@/components/loading";
import { db } from "@/services/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Card() {
  const { id } = useParams();
  const [data, setData] = useState<CardProps>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getCard() {
      setLoading(true);
      const q = query(collection(db, "cards"), where("id", "==", id), limit(1));
      const querySnapshot = await getDocs(q);

      const card = querySnapshot.docs[0].data() as CardProps;

      setData(card);
      setLoading(false);
    }

    getCard();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!loading && !data) {
    return <div className="text-secondary">Carta não encontrada</div>;
  }

  return (
    <div className="text-secondary">
      <img src={data!.img} />
      <p>{data!.name}</p>
      <p>HP: {data!.hp}</p>
      {/* <p>{data!.ability}</p> */}
      {/* <p>{data!.attacks}</p> */}
      {/* <p>{data!.package}</p> */}
      {/* <p>{data!.rarity}</p> */}
      <p>Retreat: {data!.retreat_cost}</p>
      <p>Set: {data!.set}</p>
      <p>Type: {data!.type}</p>
      <p>Weakness: {data!.weaknesses}</p>
    </div>
  );
}
