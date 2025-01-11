import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { authContext } from "@/contexts/auth-context";
import { auth } from "@/services/firebase";
import { User } from "firebase/auth";
import { ChartSpline, Handshake, Home, Menu, SquareLibrary, User as UserIcon, WalletCards, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = authContext();

  useEffect(() => {
    const subscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        authContext.setState({
          user: user,
        });

        return;
      }
    });

    return () => subscribe();
  }, []);

  return (
    <>
      <div className="xl:hidden">
        <NavbarMobile user={user} />
      </div>
      <div className="hidden xl:block">
        <NavbarDesktop user={user} />
      </div>
      <div className="bg-primary min-h-screen">
        <main className="p-4 flex flex-col items-center xl:ml-56">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function NavbarLinks() {
  return (
    <>
      <NavbarItem icon={<Home size={14} />} title="Início" link="/" />
      <NavbarItem icon={<SquareLibrary size={14} />} title="Cartas" link="/cards" />
      <NavbarItem icon={<ChartSpline size={14} />} title="Rastreio" link="/tracker" soon />
      <NavbarItem icon={<WalletCards size={14} />} title="Decks" link="/decks" soon />
      <NavbarItem icon={<Handshake size={14} />} title="Trocas" link="/trades" soon />
    </>
  );
}

function ProfileButton({ user }: { user: User | null }) {
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <NavbarItem icon={<UserIcon size={14} />} title={user.email!} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="p-2 hidden md:block">
          <Link to="/profile">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => auth.signOut()} className="cursor-pointer">
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <NavbarItem icon={<UserIcon size={14} />} title="Entrar" link="/login" />;
}

function NavbarDesktop({ user }: { user: User | null }) {
  return (
    <nav className="fixed z-50 flex h-screen w-56 flex-col justify-between bg-secondary py-5 border-r">
      <div>
        <div className="leading-none text-center mb-4">
          <p className="text-xl font-semibold">TCGP Hub</p>
        </div>
        <NavbarLinks />
      </div>
      <ProfileButton user={user} />
    </nav>
  );
}

function NavbarMobile({ user }: { user: User | null }) {
  const [opened, setOpened] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <header className="bg-secondary absolute top-0 left-0 w-full h-16 flex items-center justify-between px-4 z-50 border-b shrink-0">
      <div className="flex flex-row items-center">
        <div className="leading-none">
          <p className="text-xl font-semibold">TCGPH</p>
        </div>
      </div>
      {opened ? <X onClick={() => setOpened(false)} /> : <Menu onClick={() => setOpened(true)} />}
      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-secondary absolute py-4 px-6 flex flex-col items-start gap-4 left-0 top-14 rounded-b-lg z-50 w-full ${
              opened ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <NavbarLinks />
            <Separator />
            <NavbarItem
              title={user ? "Sair" : "Entrar"}
              onClick={() => {
                if (user) auth.signOut();

                navigate("/login");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

interface NavbarItemProps {
  icon?: ReactNode;
  title: string;
  link?: string;
  onClick?: () => void;
  soon?: boolean;
}

function NavbarItem(props: NavbarItemProps) {
  const [actualPage, setActualPage] = useState<string>("");

  useEffect(() => {
    let origin = window.location.pathname.split("/");
    setActualPage(`/${origin[1]}${origin[2] ? `/${origin[2]}` : ""}`);
  }, []);

  if (props.link) {
    return (
      <Link
        to={props.link}
        className={`flex w-full items-center px-3 py-2 duration-300 hover:bg-mainBlue/30 ${
          actualPage === props.link || actualPage === props.link ? "bg-mainBlue/30 hover:bg-mainBlue/30" : ""
        }`}
      >
        {props.icon}
        <p className={`text-sm ${props.icon ? "ml-2" : ""}`}>{props.title}</p>
        {props.soon && <p className="text-[10px] rounded-sm ml-2 bg-primary/20 p-1 text-white">em breve</p>}
      </Link>
    );
  }

  if (!props.link) {
    return (
      <div
        className="flex w-full cursor-pointer items-center px-3 py-2 duration-300 hover:bg-mainBlue/30"
        onClick={props.onClick}
      >
        {props.icon}
        <p className={`text-sm ${props.icon ? "ml-2" : ""}`}>{props.title}</p>
        {props.soon && <p className="text-[10px] rounded-sm ml-2 bg-primary/20 p-1 text-white">em breve</p>}
      </div>
    );
  }
}
