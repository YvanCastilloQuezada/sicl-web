/**
 * Tipos del servidor MCP versionado.
 *
 * Implementa JSON-RPC 2.0 directamente (sin @modelcontextprotocol/sdk).
 * Referencia: Model Context Protocol (Anthropic), 2024-11-05.
 */

/** JSON-RPC 2.0 request. */
export type JsonRpcRequest = {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: unknown;
};

/** JSON-RPC 2.0 success response. */
export type JsonRpcSuccess = {
  jsonrpc: "2.0";
  id: string | number;
  result: unknown;
};

/** JSON-RPC 2.0 error response. */
export type JsonRpcError = {
  jsonrpc: "2.0";
  id: string | number | null;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

/** MCP Tool definition. */
export type McpTool = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (args: Record<string, unknown>) => Promise<unknown>;
};

/** MCP Initialize result. */
export type McpInitializeResult = {
  protocolVersion: "2024-11-05";
  capabilities: {
    tools: Record<string, never>;
  };
  serverInfo: {
    name: "arki-mcp";
    version: "1.0.0";
  };
};

/** Error codes JSON-RPC 2.0. */
export const ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;
