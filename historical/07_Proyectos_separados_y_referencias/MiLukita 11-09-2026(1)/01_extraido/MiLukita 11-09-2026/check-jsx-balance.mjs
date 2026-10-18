import fs from 'node:fs';
const line = fs.readFileSync('/home/ubuntu/ruleta-peru-online/client/src/components/LukaDevControlPanel.tsx','utf8').split('\n')[92];
const tags = [...line.matchAll(/<\/?([A-Za-z][A-Za-z0-9]*)\b[^>]*?>/g)].map((m)=>m[0]);
const stack=[];
for (const tag of tags) {
  if (/^<\//.test(tag)) { const name=tag.match(/^<\/([A-Za-z][A-Za-z0-9]*)/)[1]; const top=stack.pop(); if (top!==name) console.log('mismatch', {tag, top, at: tags.indexOf(tag)}); }
  else if (!/\/>$/.test(tag) && !/^<input\b/.test(tag) && !/^<img\b/.test(tag)) stack.push(tag.match(/^<([A-Za-z][A-Za-z0-9]*)/)[1]);
}
console.log({tagCount:tags.length, unclosed:stack});
console.log(line.slice(-140));
