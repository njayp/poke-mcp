import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HttpServer } from './server.js';
import { fetchPokemon } from './api.js';
import { formatTypes } from './formatters.js';
import { openBrowser } from './utils.js';

export function registerTools(mcpServer: McpServer, httpServer: HttpServer) {
  // Register Pokemon fetch tool
  mcpServer.tool(
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
      
      // Update the HTTP server with new Pokemon data
      httpServer.updatePokemon(pokemonData);
      
      // Open browser to display the Pokemon
      const url = httpServer.getUrl();
      if (url) {
        openBrowser(url);
      }
      
      const types = formatTypes(pokemonData.types);
      const responseText = [
        `Successfully fetched Pokemon #${pokemonData.id}: ${pokemonData.name}`,
        `Type(s): ${types}`,
        `Height: ${pokemonData.height / 10}m`,
        `Weight: ${pokemonData.weight / 10}kg`,
        "",
        url ? `Browser opening to ${url}` : "HTTP server starting...",
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
  mcpServer.tool(
    "get-current-pokemon",
    "Get the currently displayed Pokemon information",
    {},
    async () => {
      const currentPokemon = httpServer.getCurrentPokemon();
      
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
      const url = httpServer.getUrl();
      const responseText = [
        `Current Pokemon: #${currentPokemon.id} ${currentPokemon.name}`,
        `Type(s): ${types}`,
        `Height: ${currentPokemon.height / 10}m`,
        `Weight: ${currentPokemon.weight / 10}kg`,
        url ? `View at: ${url}` : "HTTP server starting...",
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
}
