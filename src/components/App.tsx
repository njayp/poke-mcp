import React, { useState, useEffect } from 'react';
import { PokemonDisplay } from './PokemonDisplay.js';
import { PokemonData } from '../types.js';

export const App: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Poll for Pokemon data
    const fetchPokemonData = async () => {
      try {
        const response = await fetch('/api/pokemon');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setPokemon(data);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Pokemon data:', err);
        setError('Failed to connect to server');
      }
    };

    // Initial fetch
    fetchPokemonData();

    // Poll every 2 seconds for updates
    const interval = setInterval(fetchPokemonData, 2000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return <PokemonDisplay pokemon={pokemon} />;
};
