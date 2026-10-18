import { readFile, writeFile } from "node:fs/promises";

const source = "/home/ubuntu/webdev-static-assets/lukita-ar-stage-candidate-blockout.glb";
const target = "/home/ubuntu/webdev-static-assets/lukita-ar-stage-candidate-blockout-fixed.glb";
const buffer = await readFile(source);
const jsonLength = buffer.readUInt32LE(12);
const jsonText = buffer.subarray(20, 20 + jsonLength).toString("utf8").replace(/\0/g, " ").trim();
const json = JSON.parse(jsonText);
const normalized = Buffer.from(JSON.stringify(json));
if (normalized.length > jsonLength) throw new Error("El JSON normalizado excede el chunk existente");
const jsonChunk = Buffer.alloc(jsonLength, 0x20);
normalized.copy(jsonChunk);
const output = Buffer.from(buffer);
jsonChunk.copy(output, 20);
await writeFile(target, output);
console.log(JSON.stringify({ target, bytes: output.length, jsonBytes: normalized.length, jsonChunkBytes: jsonLength, asset: json.asset, meshes: json.meshes?.length, buffers: json.buffers?.length }, null, 2));
