import React from 'react';
import { PokemonData } from '../types.js';

interface PokemonDisplayProps {
  pokemon: PokemonData | null;
}

const typeColors: { [key: string]: string } = {
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  rock: '#B8A038',
  bug: '#A8B820',
  ghost: '#705898',
  steel: '#B8B8D0',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
};

export const PokemonDisplay: React.FC<PokemonDisplayProps> = ({ pokemon }) => {
  if (!pokemon) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Pokemon MCP Server</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>No Pokemon loaded yet.</p>
        <p style={{ fontSize: '1rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Use the MCP tool to fetch a Pokemon!
        </p>
      </div>
    );
  }

  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '1.5rem',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '100%',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          <h1 style={{
            fontSize: '2rem',
            color: '#333',
            marginBottom: '0.5rem',
            textTransform: 'capitalize',
          }}>
            {pokemon.name}
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            fontWeight: 'bold',
          }}>
            #{String(pokemon.id).padStart(3, '0')}
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <img
            src={spriteUrl}
            alt={pokemon.name}
            style={{
              width: '200px',
              height: '200px',
              imageRendering: 'crisp-edges',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          {pokemon.types.sort((a, b) => a.slot - b.slot).map((type) => (
            <span
              key={type.slot}
              style={{
                background: typeColors[type.type.name] || '#888',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          padding: '1rem',
          background: '#f9f9f9',
          borderRadius: '0.75rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#888',
              marginBottom: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Height
            </p>
            <p style={{
              fontSize: '1.25rem',
              color: '#333',
              fontWeight: 'bold',
            }}>
              {(pokemon.height / 10).toFixed(1)}m
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#888',
              marginBottom: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Weight
            </p>
            <p style={{
              fontSize: '1.25rem',
              color: '#333',
              fontWeight: 'bold',
            }}>
              {(pokemon.weight / 10).toFixed(1)}kg
            </p>
          </div>
        </div>
      </div>

      <p style={{
        marginTop: '2rem',
        fontSize: '0.875rem',
        opacity: 0.7,
      }}>
        Powered by Pokemon MCP Server
      </p>
    </div>
  );
};
