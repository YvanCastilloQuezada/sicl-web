import fs from "node:fs";
const positions = [
  -0.45,-0.65,0.45, 0.45,-0.65,0.45, 0.45,0.65,0.45, -0.45,0.65,0.45,
  -0.45,-0.65,-0.45, -0.45,0.65,-0.45, 0.45,0.65,-0.45, 0.45,-0.65,-0.45,
];
const normals = [
  0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
];
const indices = [0,1,2,0,2,3,4,5,6,4,6,7,0,4,7,0,7,1,3,2,6,3,6,5,1,7,6,1,6,2,0,3,5,0,5,4];
const bytes = Buffer.concat([Buffer.from(new Float32Array(positions).buffer), Buffer.from(new Float32Array(normals).buffer), Buffer.from(new Uint16Array(indices).buffer)]);
const pad4 = (buffer) => Buffer.concat([buffer, Buffer.alloc((4 - buffer.length % 4) % 4)]);
const json = JSON.stringify({asset:{version:"2.0",generator:"MiLukita AR Stage demo blockout"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0,name:"Lukita Candidate Blockout"}],meshes:[{name:"CandidateBlockout",primitives:[{attributes:{POSITION:0,NORMAL:1},indices:2,material:0}]}],materials:[{name:"PearlCandidate",pbrMetallicRoughness:{baseColorFactor:[0.72,0.96,0.9,1],metallicFactor:0.05,roughnessFactor:0.65}}],buffers:[{byteLength:bytes.length}],bufferViews:[{buffer:0,byteOffset:0,byteLength:positions.length*4,target:34962},{buffer:0,byteOffset:positions.length*4,byteLength:normals.length*4,target:34962},{buffer:0,byteOffset:(positions.length+normals.length)*4,byteLength:indices.length*2,target:34963}],accessors:[{bufferView:0,componentType:5126,count:8,type:"VEC3",min:[-0.45,-0.65,-0.45],max:[0.45,0.65,0.45]},{bufferView:1,componentType:5126,count:8,type:"VEC3"},{bufferView:2,componentType:5123,count:indices.length,type:"SCALAR"}]});
const jsonChunk = pad4(Buffer.from(json));
const binChunk = pad4(bytes);
const header = Buffer.alloc(12); header.write("glTF",0); header.writeUInt32LE(2,4); header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length,8);
const chunk = (type,data) => { const h=Buffer.alloc(8); h.writeUInt32LE(data.length,0); h.writeUInt32LE(type,4); return Buffer.concat([h,data]); };
fs.mkdirSync("/home/ubuntu/webdev-static-assets", {recursive:true});
fs.writeFileSync("/home/ubuntu/webdev-static-assets/lukita-ar-stage-candidate-blockout.glb", Buffer.concat([header,chunk(0x4e4f534a,jsonChunk),chunk(0x004e4942,binChunk)]));
