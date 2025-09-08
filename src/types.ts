export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonData {
  id: number;
  name: string;
  types: PokemonType[];
  height: number;
  weight: number;
}
