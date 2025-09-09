# Pokemon MCP Server

An MCP (Model Context Protocol) server that fetches Pokemon data from PokeAPI and displays it in a beautiful React-based web interface.

## Features

- 🎮 **MCP Tool Integration**: AI assistants can fetch Pokemon data via MCP tools
- 🌐 **React Web Interface**: Beautiful, auto-updating Pokemon display
- 🎨 **Rich Visuals**: Official Pokemon artwork, type-specific colors, and stats
- 🔄 **Auto-refresh**: Web interface polls for updates every 2 seconds
- 🚀 **Auto-launch**: Browser opens automatically when fetching Pokemon
- 🎯 **Zero-conflict**: Each instance uses a random available port

## Installation

```bash
npm install -g pokemon-mcp-server
```

Or install locally:

```bash
npm install pokemon-mcp-server
```

## Usage

### As an MCP Server

1. Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "npx",
      "args": ["pokemon-mcp-server"]
    }
  }
}
```

2. Restart Claude Desktop

3. Use the tools in Claude:
   - "Fetch Pokemon #25" - to get Pikachu
   - "Fetch Pokemon charizard" - to get Charizard
   - "What Pokemon is currently loaded?" - to check the current Pokemon

### As a Standalone Server

```bash
npx pokemon-mcp-server
```

Then use any MCP client to connect to the server via stdio.

## Available MCP Tools

### `fetch-pokemon`
Fetches a Pokemon by name or number and displays it in the browser.

**Parameters:**
- `pokemon`: string (name) or number (ID)

**Example responses:**
```
Successfully fetched Pokemon #25: pikachu
Type(s): electric
Height: 0.4m
Weight: 6.0kg

Browser opening to http://localhost:54321
```

### `get-current-pokemon`
Returns information about the currently loaded Pokemon.

## Web Interface

The server automatically:
1. Starts a web server on a random available port
2. Opens your default browser when you fetch a Pokemon
3. Displays a beautiful React-based interface with:
   - Pokemon official artwork
   - Type badges with official colors
   - Height and weight statistics
   - Gradient backgrounds and modern design

## Development

### Setup

```bash
git clone https://github.com/yourusername/pokemon-mcp-server.git
cd pokemon-mcp-server
npm install
npm run build
```

### Project Structure

```
src/
├── index.ts              # Entry point
├── config.ts            # Configuration
├── types.ts             # TypeScript interfaces
├── api.ts               # PokeAPI integration
├── server.ts            # HTTP server with React app
├── tools.ts             # MCP tool definitions
├── formatters.ts        # Data formatting utilities
├── utils.ts             # Browser launcher utility
└── components/          # React components (TSX)
    ├── App.tsx
    └── PokemonDisplay.tsx
```

## API Reference

This server uses the [PokeAPI](https://pokeapi.co/) to fetch Pokemon data.

## Requirements

- Node.js 16 or higher
- npm or yarn

## License

Apache-2.0

## Author

Your Name

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/yourusername/pokemon-mcp-server/issues) page.
