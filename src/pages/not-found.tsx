import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-primary text-secondary flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p>Não encontrado</p>
      <Link to="/" className="mt-4 text-2xl underline">
        Voltar
      </Link>
    </div>
  );
}
