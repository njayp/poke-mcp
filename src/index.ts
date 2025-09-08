import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createServer } from "http";
import { exec } from "child_process";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

// Store the current Pokemon data and server info
let currentPokemon: PokemonData | null = null;
let actualPort: number | null = null;

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonData {
  id: number;
  name: string;
  types: PokemonType[];
  height: number;
  weight: number;
}

// Helper function for making PokeAPI requests
async function fetchPokemon(idOrName: string | number): Promise<PokemonData | null> {
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon/${idOrName}`);
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

// Format Pokemon types as a readable string
function formatTypes(types: PokemonType[]): string {
  return types
    .sort((a, b) => a.slot - b.slot)
    .map(t => t.type.name)
    .join(", ");
}

// Open URL in the default browser
function openBrowser(url: string) {
  const platform = process.platform;
  let command: string;
  
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error('Failed to open browser:', error);
    } else {
      console.error(`Browser opened to ${url}`);
    }
  });
}

// Create HTTP server to display Pokemon data
const httpServer = createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  if (!currentPokemon) {
    res.statusCode = 200;
    res.end("No Pokemon data available. Use the MCP tool to fetch a Pokemon first!");
    return;
  }
  
  const typeText = formatTypes(currentPokemon.types);
  const response = `Pokemon: ${currentPokemon.name} (#${currentPokemon.id})\nType(s): ${typeText}`;
  
  res.statusCode = 200;
  res.end(response);
});

// Start the HTTP server on a random available port
httpServer.listen(0, '127.0.0.1', () => {
  const address = httpServer.address();
  if (address && typeof address !== 'string') {
    actualPort = address.port;
    console.error(`Local server running at http://localhost:${actualPort}`);
  }
});

httpServer.on('error', (err: any) => {
  console.error('HTTP server error:', err);
});

// Create MCP server instance
const server = new McpServer({
  name: "pokemon-mcp",
  version: "1.0.0",
});

// Register Pokemon fetch tool
server.tool(
  "fetch-pokemon",
  "Fetch a Pokemon by number or name and display its type on localhost",
  {
    pokemon: z.union([
      z.string().describe("Pokemon name (e.g., 'pikachu', 'charizard')"),
      z.number().int().positive().describe("Pokemon number (e.g., 25 for Pikachu)")
    ]).describe("The Pokemon to fetch by name or number"),
  },
  async ({ pokemon }) => {
    const pokemonData = await fetchPokemon(pokemon);
    
    if (!pokemonData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch Pokemon: ${pokemon}. Please check if the Pokemon name or number is valid.`,
          },
        ],
      };
    }
    
    // Update the current Pokemon for the HTTP server
    currentPokemon = pokemonData;
    
    // Open browser to display the Pokemon
    if (actualPort) {
      const url = `http://localhost:${actualPort}`;
      openBrowser(url);
    }
    
    const types = formatTypes(pokemonData.types);
    const responseText = [
      `Successfully fetched Pokemon #${pokemonData.id}: ${pokemonData.name}`,
      `Type(s): ${types}`,
      `Height: ${pokemonData.height / 10}m`,
      `Weight: ${pokemonData.weight / 10}kg`,
      "",
      actualPort ? `Browser opening to http://localhost:${actualPort}` : "HTTP server starting...",
    ].join("\n");
    
    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  },
);

// Register a tool to get the current Pokemon
server.tool(
  "get-current-pokemon",
  "Get the currently displayed Pokemon information",
  {},
  async () => {
    if (!currentPokemon) {
      return {
        content: [
          {
            type: "text",
            text: "No Pokemon is currently loaded. Use fetch-pokemon to load a Pokemon first.",
          },
        ],
      };
    }
    
    const types = formatTypes(currentPokemon.types);
    const responseText = [
      `Current Pokemon: #${currentPokemon.id} ${currentPokemon.name}`,
      `Type(s): ${types}`,
      `Height: ${currentPokemon.height / 10}m`,
      `Weight: ${currentPokemon.weight / 10}kg`,
      actualPort ? `View at: http://localhost:${actualPort}` : "HTTP server starting...",
    ].join("\n");
    
    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  },
);

// Start the MCP server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Pokemon MCP Server running on stdio");
  
  // Handle graceful shutdown
  const shutdown = () => {
    console.error('Shutting down...');
    httpServer.close(() => {
      process.exit(0);
    });
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', () => {
    httpServer.close();
  });
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
