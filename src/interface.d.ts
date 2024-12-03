type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Rare EX' | 'Full Art' | 'Full Art EX/Support' | 'Immersive' | 'Gold Crown' | 'Promo'

type Pack = 'Any' | 'Mewtwo' | 'Charizard' | 'Pikachu' | 'Promo'

type ColorType = 'Colorless' | 'Supporter' | 'Fire' | 'Psychic' | 'Grass' | 'Water' | 'Lightning' | 'Fighting' | 'Darkness' | 'Metal'

type Stage = 'Basic' | 'Stage 1' | 'Stage 2'

interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  pack: Pack;
  type: ColorType;
  health: number;
  stage: Stage;
  craftingCost: number;
  image: string;
}