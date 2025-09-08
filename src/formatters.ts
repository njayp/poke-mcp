import { PokemonType } from './types.js';

export function formatTypes(types: PokemonType[]): string {
  return types
    .sort((a, b) => a.slot - b.slot)
    .map(t => t.type.name)
    .join(", ");
}
