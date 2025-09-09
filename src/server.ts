import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PokemonData } from './types.js';
import { CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class HttpServer {
  private server: Server;
  private currentPokemon: PokemonData | null = null;
  private actualPort: number | null = null;

  constructor() {
    this.server = this.createServer();
    this.startServer();
  }

  private async serveReactApp(res: ServerResponse): Promise<void> {
    try {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokemon MCP Server</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    const { useState, useEffect, createElement: h } = React;
    const { createRoot } = ReactDOM;

    const typeColors = {
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

    function PokemonDisplay({ pokemon }) {
      if (!pokemon) {
        return h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }
        }, [
          h('h1', { key: 'title', style: { fontSize: '2.5rem', marginBottom: '1rem' } }, 'Pokemon MCP Server'),
          h('p', { key: 'subtitle', style: { fontSize: '1.2rem', opacity: 0.9 } }, 'No Pokemon loaded yet.'),
          h('p', { key: 'hint', style: { fontSize: '1rem', opacity: 0.7, marginTop: '0.5rem' } }, 'Use the MCP tool to fetch a Pokemon!')
        ]);
      }

      const spriteUrl = \`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/\${pokemon.id}.png\`;
      
      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
        }
      }, [
        h('div', {
          key: 'card',
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxWidth: '400px',
            width: '100%',
          }
        }, [
          h('div', {
            key: 'header',
            style: {
              textAlign: 'center',
              marginBottom: '1.5rem',
            }
          }, [
            h('h1', {
              key: 'name',
              style: {
                fontSize: '2rem',
                color: '#333',
                marginBottom: '0.5rem',
                textTransform: 'capitalize',
              }
            }, pokemon.name),
            h('p', {
              key: 'id',
              style: {
                fontSize: '1.2rem',
                color: '#666',
                fontWeight: 'bold',
              }
            }, '#' + String(pokemon.id).padStart(3, '0'))
          ]),
          h('div', {
            key: 'sprite-container',
            style: {
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
            }
          }, h('img', {
            src: spriteUrl,
            alt: pokemon.name,
            style: {
              width: '200px',
              height: '200px',
              imageRendering: 'crisp-edges',
            },
            onError: (e) => {
              e.target.src = \`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/\${pokemon.id}.png\`;
            }
          })),
          h('div', {
            key: 'types',
            style: {
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }
          }, pokemon.types.sort((a, b) => a.slot - b.slot).map((type) =>
            h('span', {
              key: type.slot,
              style: {
                background: typeColors[type.type.name] || '#888',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }
            }, type.type.name)
          )),
          h('div', {
            key: 'stats',
            style: {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              padding: '1rem',
              background: '#f9f9f9',
              borderRadius: '0.75rem',
            }
          }, [
            h('div', { key: 'height', style: { textAlign: 'center' } }, [
              h('p', {
                key: 'label',
                style: {
                  fontSize: '0.875rem',
                  color: '#888',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }
              }, 'Height'),
              h('p', {
                key: 'value',
                style: {
                  fontSize: '1.25rem',
                  color: '#333',
                  fontWeight: 'bold',
                }
              }, (pokemon.height / 10).toFixed(1) + 'm')
            ]),
            h('div', { key: 'weight', style: { textAlign: 'center' } }, [
              h('p', {
                key: 'label',
                style: {
                  fontSize: '0.875rem',
                  color: '#888',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }
              }, 'Weight'),
              h('p', {
                key: 'value',
                style: {
                  fontSize: '1.25rem',
                  color: '#333',
                  fontWeight: 'bold',
                }
              }, (pokemon.weight / 10).toFixed(1) + 'kg')
            ])
          ])
        ]),
        h('p', {
          key: 'footer',
          style: {
            marginTop: '2rem',
            fontSize: '0.875rem',
            opacity: 0.7,
          }
        }, 'Powered by Pokemon MCP Server')
      ]);
    }

    function App() {
      const [pokemon, setPokemon] = useState(null);
      const [error, setError] = useState(null);

      useEffect(() => {
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
          }
        };

        fetchPokemonData();
        const interval = setInterval(fetchPokemonData, 2000);
        return () => clearInterval(interval);
      }, []);

      return h(PokemonDisplay, { pokemon });
    }

    const root = createRoot(document.getElementById('root'));
    root.render(h(App));
  </script>
</body>
</html>`;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlContent);
    } catch (error) {
      console.error('Error serving React app:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }

  private createServer(): Server {
    return createServer(async (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      
      if (req.url === '/api/pokemon' && req.method === 'GET') {
        // API endpoint for Pokemon data
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.currentPokemon));
      } else if (req.url === '/' || req.url === '/index.html') {
        // Serve React app
        await this.serveReactApp(res);
      } else {
        // 404 for other routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });
  }

  private startServer(): void {
    this.server.listen(0, CONFIG.SERVER.HOST, () => {
      const address = this.server.address();
      if (address && typeof address !== 'string') {
        this.actualPort = address.port;
        console.error(`Local server running at http://localhost:${this.actualPort}`);
      }
    });

    this.server.on('error', (err: any) => {
      console.error('HTTP server error:', err);
    });
  }

  public updatePokemon(pokemon: PokemonData): void {
    this.currentPokemon = pokemon;
  }

  public getCurrentPokemon(): PokemonData | null {
    return this.currentPokemon;
  }

  public getPort(): number | null {
    return this.actualPort;
  }

  public getUrl(): string | null {
    return this.actualPort ? `http://localhost:${this.actualPort}` : null;
  }

  public close(): void {
    this.server.close();
  }
}
