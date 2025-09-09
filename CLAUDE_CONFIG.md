# Claude Desktop Configuration

Add the Pokemon MCP Server to your Claude Desktop by adding this configuration.

## Configuration Location

The configuration file is located at:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## Configuration JSON

Add this to your `claude_desktop_config.json`:

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

## Alternative Configurations

### If you installed globally with npm:

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "pokemon-mcp-server"
    }
  }
}
```

### If you want to use a specific version:

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "npx",
      "args": ["pokemon-mcp-server@1.0.0"]
    }
  }
}
```

### If you have multiple MCP servers:

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "npx",
      "args": ["pokemon-mcp-server"]
    },
    "other-server": {
      "command": "npx",
      "args": ["other-mcp-server"]
    }
  }
}
```

## After Adding Configuration

1. Save the configuration file
2. Restart Claude Desktop completely (quit and reopen)
3. You should see "pokemon" in the MCP tools menu
4. Test by asking Claude: "Use the Pokemon MCP tool to fetch Pikachu"

## Troubleshooting

If the server doesn't appear:
1. Make sure the package is installed: `npm list -g pokemon-mcp-server`
2. Check the Claude Desktop logs for any errors
3. Ensure the configuration JSON is valid (no trailing commas, proper quotes)
4. Try using the full path to npx: `/usr/local/bin/npx` or `which npx` to find it

## Available Commands in Claude

Once configured, you can use these commands:
- "Fetch Pokemon #25"
- "Fetch Pokemon pikachu"
- "Get Pokemon charizard and show me its types"
- "What Pokemon is currently loaded?"
