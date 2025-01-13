import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();

  console.log(id);

  return <p className="text-secondary">Em construção</p>;
}
