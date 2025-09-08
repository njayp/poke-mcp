import { createServer, Server } from 'http';
import { PokemonData } from './types.js';
import { formatTypes } from './formatters.js';
import { CONFIG } from './config.js';

export class HttpServer {
  private server: Server;
  private currentPokemon: PokemonData | null = null;
  private actualPort: number | null = null;

  constructor() {
    this.server = this.createServer();
    this.startServer();
  }

  private createServer(): Server {
    return createServer((req, res) => {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      
      if (!this.currentPokemon) {
        res.statusCode = 200;
        res.end("No Pokemon data available. Use the MCP tool to fetch a Pokemon first!");
        return;
      }
      
      const typeText = formatTypes(this.currentPokemon.types);
      const response = `Pokemon: ${this.currentPokemon.name} (#${this.currentPokemon.id})\nType(s): ${typeText}`;
      
      res.statusCode = 200;
      res.end(response);
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
