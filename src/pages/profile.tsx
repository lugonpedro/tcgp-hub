import { Input } from "@/components/ui/input";
import { authContext } from "@/contexts/auth-context";

export default function Profile() {
  const { user } = authContext();

  if (!user) {
    return <div className="text-background">Faça login para ver e editar seu perfil</div>;
  }

  return (
    <div>
      <p>Avatar</p>
      <p>Email disabled</p>
      <p>Id</p>
      <Input className="text-background" />
    </div>
  );
}
