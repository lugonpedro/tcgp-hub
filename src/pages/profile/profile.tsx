import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { PatternFormat } from "react-number-format";

export default function Profile() {
  const { user } = useAuthContext();
  const { toast } = useToast();

  const [name, setName] = useState<string>(user?.displayName ?? "");
  const [nick, setNick] = useState<string>("");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function loadProfile() {
      const docRef = doc(db, "profiles", user!.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setName(docSnap.data()!.name);
        setNick(docSnap.data()!.nick);
        setId(docSnap.data()!.id);
      }
    }

    if (!user) return;
    loadProfile();
  }, [user]);

  async function saveProfile() {
    try {
      const q = query(collection(db, "profiles"), where("id", "==", id.replace(/-/g, "")));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        toast({ description: "Já existe um usuário com esse id 🥲", variant: "destructive" });
        return;
      }
    } catch (ex: unknown) {
      toast({ description: "Algo deu errado, tente novamente", variant: "destructive" });
    }

    try {
      await setDoc(doc(db, "profiles", user!.uid), {
        name: name,
        nick: nick,
        id: id.replace(/-/g, ""),
      });
      toast({ description: "Perfil salvo com sucesso" });
    } catch (ex: unknown) {
      toast({ description: "Algo deu errado, tente novamente", variant: "destructive" });
    }
  }

  function copyId() {
    const profileLink = `${window.location.href}/${id}`;
    navigator.clipboard.writeText(profileLink);
    toast({ description: "Link do perfil para a área de transferência" });
  }

  if (!user) {
    return <div className="text-secondary">Faça login para ver e editar seu perfil</div>;
  }

  return (
    <div>
      <Card className="md:min-w-[500px]">
        <CardHeader>
          <CardTitle className="text-start text-2xl font-semibold">Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Avatar>
            <AvatarImage src={user.photoURL ?? "/flip.png"} />
            <AvatarFallback>{user.displayName ? user.displayName[0].toUpperCase() : "A"}</AvatarFallback>
          </Avatar>
          <div>
            <Label>E-mail</Label>
            <Input value={user.email ?? ""} disabled placeholder="E-mail" />
          </div>
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
          </div>
          <div>
            <Label>Nick</Label>
            <Input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="Nick" />
          </div>
          <div>
            <Label>ID</Label>
            <div className="flex flex-row gap-2">
              <PatternFormat
                customInput={Input}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="ID"
                format="####-####-####-####"
              />
              {/\d+$/.test(id) && (
                <Button onClick={copyId}>
                  <Copy />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveProfile}>Salvar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
