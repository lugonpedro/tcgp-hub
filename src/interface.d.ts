interface RarityProps {
  rarity: number;
  type: string;
}

interface AttackProps {
  costs: string[];
  damage: string;
}

interface AttacksProps {
  [key: string]: AttackProps;
}

interface CardProps {
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
  created_at: string;
}

interface PackProps {
  name: string;
  img: string;
}

interface SetProps {
  id: string;
  name: string;
  img: string;
  packs: PackProps[];
}

interface DeckProps {
  user: {
    id: string;
    name: string;
    nick: string;
  }
  cards: CardProps[]
  upvote: number
  created_at: string
}