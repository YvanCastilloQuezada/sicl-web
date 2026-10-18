import {readFileSync} from 'node:fs';import type {Registry} from './types.js';import {validateRegistry} from './engine.js';
export function loadRegistry(path:string):Registry{const data=JSON.parse(readFileSync(path,'utf8')) as Registry;validateRegistry(data);return data;}
