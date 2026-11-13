/**
 * Servidor MCP versionado (JSON-RPC 2.0 puro).
 *
 * Sin dependencias externas. Sin latencia de red.
 * Uso: const response = await handleRequest({ jsonrpc: "2.0", id: 1, method: "tools/list" });
 */

import type { JsonRpcRequest, JsonRpcResponse, McpInitializeResult } from "./types";
import { ERROR_CODES } from "./types";
import { TOOLS } from "./tools";

/** Maneja una request JSON-RPC 2.0 y retorna una response. */
export async function handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
  const { id, method, params } = request;

  try {
    switch (method) {
      case "initialize": {
        const result: McpInitializeResult = {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "arki-mcp", version: "1.0.0" },
        };
        return { jsonrpc: "2.0", id, result };
      }

      case "tools/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: TOOLS.map((t) => ({
              name: t.name,
              description: t.description,
              inputSchema: t.inputSchema,
            })),
          },
        };
      }

      case "tools/call": {
        const p = params as { name?: string; arguments?: Record<string, unknown> } | undefined;
        if (!p?.name) {
          return {
            jsonrpc: "2.0",
            id,
            error: { code: ERROR_CODES.INVALID_PARAMS, message: "tools/call requiere 'name'" },
          };
        }
        const tool = TOOLS.find((t) => t.name === p.name);
        if (!tool) {
          return {
            jsonrpc: "2.0",
            id,
            error: { code: ERROR_CODES.METHOD_NOT_FOUND, message: `Tool '${p.name}' no encontrado` },
          };
        }
        const result = await tool.handler(p.arguments ?? {});
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(result) }],
          },
        };
      }

      case "ping": {
        return { jsonrpc: "2.0", id, result: {} };
      }

      case "shutdown": {
        return { jsonrpc: "2.0", id, result: {} };
      }

      default: {
        return {
          jsonrpc: "2.0",
          id,
          error: { code: ERROR_CODES.METHOD_NOT_FOUND, message: `Method '${method}' no encontrado` },
        };
      }
    }
  } catch (err) {
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: err instanceof Error ? err.message : "Error interno",
      },
    };
  }
}
