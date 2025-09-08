import { PokemonData } from './types.js';
import { CONFIG } from './config.js';

export async function fetchPokemon(idOrName: string | number): Promise<PokemonData | null> {
  try {
    const response = await fetch(`${CONFIG.API.BASE_URL}/pokemon/${idOrName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      types: data.types,
      height: data.height,
      weight: data.weight,
    };
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    return null;
  }
}
