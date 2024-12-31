interface Rarity {
  rarity: number;
  type: string;
}

interface Package {
  img: string;
  name: string;
}

interface Attack {
  costs: string[];
  damage: string;
}

interface Attacks {
  [key: string]: Attack;
}

interface Card {
  id: string;
  href: string;
  set: string;
  img: string;
  name: string;
  hp?: string;
  type: string;
  rarity: Rarity;
  package: Package[];
  ability: Record<string, unknown>;
  attacks: Attacks;
  weaknesses: string[];
  retreatCost: string[];
  createdAt: string;
}
