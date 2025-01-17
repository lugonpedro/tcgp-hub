import { Timestamp } from "firebase/firestore";

export interface CardProps {
  id: string;
  href: string;
  set: string;
  img: string;
  name: string;
  hp?: string;
  type: string;
  rarity: RarityProps;
  package: PackProps[];
  ability: Record<string, unknown>;
  attacks: AttacksProps;
  weaknesses: string[];
  retreat_cost: string[];
  created_at: Timestamp;
}

export interface SetProps {
  id: string;
  name: string;
  img: string;
  packs: PackProps[];
  created_at: Timestamp
}

export interface PackProps {
  name: string;
  img: string;
}

export interface RarityProps {
  rarity: number;
  type: string;
}

export interface AttackProps {
  costs: string[];
  damage: string;
}

export interface AttacksProps {
  [key: string]: AttackProps;
}

export interface DeckProps {
  user?: ProfileProps
  user_id: string
  cards: CardProps[]
  upvote: number
  created_at: Timestamp
}

export interface ProfileProps {
  id: string;
  name: string;
  nick: string;
}