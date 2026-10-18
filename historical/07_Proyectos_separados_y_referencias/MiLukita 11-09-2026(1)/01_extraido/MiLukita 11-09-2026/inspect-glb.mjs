import { readFile } from "node:fs/promises";
const buffer = await readFile("/home/ubuntu/webdev-static-assets/lukita-ar-stage-candidate-blockout.glb");
const jsonLength = buffer.readUInt32LE(12);
const json = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString("utf8").trim());
console.log(JSON.stringify({ version: json.asset?.version, scenes: json.scenes?.length, nodes: json.nodes?.length, meshes: json.meshes?.length, buffers: json.buffers?.map(({ byteLength, uri }) => ({ byteLength, uri })) }, null, 2));
