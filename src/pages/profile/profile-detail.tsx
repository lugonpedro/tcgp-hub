import Loading from "@/components/loading";
import { useProfilesContext } from "@/contexts/profiles-context";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProfileDetail() {
  const { id } = useParams();

  const { loading, profile, getProfile } = useProfilesContext();

  useEffect(() => {
    if (!id) return;
    getProfile(id);
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!loading && !profile) {
    return <div className="text-secondary">Perfil não encontrado</div>;
  }

  return (
    <div className="text-secondary">
      <p>Perfil de {profile?.nick}</p>
      <p>{profile?.name}</p>
      <p>ID: {profile?.id}</p>
    </div>
  );
}
