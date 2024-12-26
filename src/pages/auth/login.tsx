import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Login() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<any>();

  // const navigate = useNavigate();

  async function login() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) {
        return;
      }

      // const token = credential.accessToken;
      // const user = result.user;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log({ errorCode, errorMessage, email, credential });
    }
  }

  return (
    <>
      <div className="bg-primary text-secondary min-h-screen">
        <div className="p-4 max-w-[800px] mx-auto flex flex-col justify-center h-screen">
          <Card>
            <CardHeader>
              <CardTitle className="text-start text-2xl font-semibold">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={login}>Login com Google</Button>
              {/* <form
                onSubmit={handleSubmit(login)}
                className="flex flex-col gap-4"
              >
                <div>
                  <Label>E-mail</Label>
                  <Input {...register("email")} placeholder="E-mail" />
                </div>
                <div>
                  <Label>Senha</Label>
                  <Input
                    {...register("password", { required: true })}
                    placeholder="Senha"
                  />
                  {errors.password && <span>This field is required</span>}
                </div>
                <Button type="submit">Entrar</Button>
              </form> */}
            </CardContent>
            {/* <CardFooter className="flex justify-end">
              <Link to="/register" className="underline">
                Criar Conta
              </Link>
            </CardFooter> */}
          </Card>
        </div>
      </div>
    </>
  );
}

export default Login;
