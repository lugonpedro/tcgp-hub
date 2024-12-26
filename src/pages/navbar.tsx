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
import { Menu, SquareLibrary, User as UserIcon, WalletCards, X } from "lucide-react";
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
      <NavbarItem icon={<SquareLibrary size={14} />} title="Cartas" link="/cards" />
      <NavbarItem icon={<WalletCards size={14} />} title="Decks" link="/decks" />
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
        <DropdownMenuContent side="right" className="p-2 bg-secondary text-primary hidden md:block">
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
          <p className="text-xl text-primary font-semibold">TCGP Hub</p>
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
          <p className="text-xl font-semibold text-primary">TCGPH</p>
        </div>
      </div>
      {opened ? (
        <X onClick={() => setOpened(false)} className="stroke-primary" />
      ) : (
        <Menu onClick={() => setOpened(true)} className="stroke-primary" />
      )}
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
}

function NavbarItem(props: NavbarItemProps) {
  const [actualPage, setActualPage] = useState<string>("");

  useEffect(() => {
    let origin = window.location.pathname.split("/");
    setActualPage(`/${origin[1]}${origin[2] ? `/${origin[2]}` : ""}`);
  }, []);

  return (
    <>
      {props.link && (
        <Link
          to={props.link}
          className={`flex w-full items-center px-3 py-2 text-primary duration-300 hover:bg-mainBlue/30 ${
            actualPage === props.link || actualPage === props.link ? "bg-mainBlue/30 hover:bg-mainBlue/30" : ""
          }`}
        >
          {props.icon}
          <p className={`text-sm text-primary ${props.icon ? "ml-2" : ""}`}>{props.title}</p>
        </Link>
      )}
      {!props.link && (
        <div
          className="flex w-full cursor-pointer items-center px-3 py-2 text-primary duration-300 hover:bg-mainBlue/30"
          onClick={props.onClick}
        >
          {props.icon}
          <p className={`text-sm text-primary ${props.icon ? "ml-2" : ""}`}>{props.title}</p>
        </div>
      )}
    </>
  );
}

// interface NavbarDropdownItemProps {
//   icon: ReactNode;
//   title: string;
//   subItems: {
//     title: string;
//     link?: string;
//     onClick?: () => void;
//   }[];
// }

// function NavbarDropdownItem(props: NavbarDropdownItemProps) {
//   const [opened, setOpened] = useState<boolean>(false);
//   const [actualPage, setActualPage] = useState<string>("");

//   useEffect(() => {
//     let origin = window.location.pathname.split("/");
//     setActualPage(`/${origin[1]}${origin[2] ? `/${origin[2]}` : ""}`);
//   }, []);

//   useEffect(() => {
//     let origin = window.location.pathname.split("/");

//     let formattedPath = `/${origin[1]}/${origin[2]}`;

//     function hasFormattedPath(subItem: {
//       title: string;
//       link?: string;
//       icon?: ReactNode;
//       onClick?: () => void;
//     }) {
//       if (subItem.link) {
//         let splittedLink = subItem.link?.split("/");
//         const formattedLink = `/${splittedLink![1]}/${splittedLink![2]}`;
//         return formattedLink === formattedPath;
//       }
//     }

//     if (props.subItems.find(hasFormattedPath)) {
//       setOpened(true);
//     }
//   }, [props.subItems]);

//   const menuAnimation = {
//     hidden: {
//       opacity: 0,
//       height: 0,
//       padding: 0,
//       transition: { duration: 0.3, when: "afterChildren" },
//     },
//     show: {
//       opacity: 1,
//       height: "auto",
//       transition: {
//         duration: 0.3,
//         when: "beforeChildren",
//       },
//     },
//   };
//   const menuItemAnimation = {
//     hidden: (i: number) => ({
//       padding: 0,
//       x: "-1000%",
//       transition: {
//         duration: (i + 1) * 0.1,
//       },
//     }),
//     show: (i: number) => ({
//       x: 0,
//       transition: {
//         duration: (i + 1) * 0.1,
//       },
//     }),
//   };

//   return (
//     <>
//       <button
//         onClick={() => setOpened(!opened)}
//         className="flex w-full flex-row items-center justify-between gap-2 px-3 py-2 text-primary duration-300 hover:bg-mainBlue/30"
//       >
//         <div className="flex items-center gap-2">
//           {props.icon}
//           <p className="text-sm">{props.title}</p>
//         </div>
//         <motion.div
//           animate={{
//             rotate: opened ? 0 : -90,
//           }}
//           initial={{
//             rotate: -90,
//           }}
//         >
//           <ChevronDown size={16} />
//         </motion.div>
//       </button>
//       <AnimatePresence>
//         {opened && (
//           <motion.div
//             variants={menuAnimation}
//             initial="hidden"
//             animate="show"
//             exit="hidden"
//             className="flex w-full flex-col"
//           >
//             {props.subItems.map((subItem, i) => (
//               <motion.div variants={menuItemAnimation} key={i} custom={i}>
//                 {subItem.link && (
//                   <Link
//                     to={subItem.link}
//                     className={`flex w-full items-center px-8 py-2 text-primary duration-300 hover:bg-mainBlue/30 ${
//                       actualPage === subItem.link || actualPage === subItem.link
//                         ? "bg-mainBlue/30 hover:bg-mainBlue/30"
//                         : ""
//                     }`}
//                   >
//                     <p className="text-sm text-primary">{subItem.title}</p>
//                   </Link>
//                 )}
//                 {!subItem.link && (
//                   <div
//                     className="flex w-full px-4 py-2 text-primary duration-300 hover:bg-mainBlue/30"
//                     onClick={subItem.onClick}
//                   >
//                     {subItem.title}
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
