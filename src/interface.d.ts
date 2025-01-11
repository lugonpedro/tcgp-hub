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
  rarity: Rarity;
  package: Pack[];
  ability: Record<string, unknown>;
  attacks: Attacks;
  weaknesses: string[];
  retreatCost: string[];
  createdAt: string;
}

interface PackProps {
  name: string;
  img: string;
}

interface SetProps {
  id: string;
  name: string;
  img: string;
  packs: Pack[];
}