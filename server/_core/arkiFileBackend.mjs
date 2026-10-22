/** MO-19: hardened exact-key backend. Requires a private root and no untrusted local writers. */
import { mkdir, lstat, open, realpath, unlink } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
const MAX=25*1024*1024;
const KEY=/^objects\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const nofollow=constants.O_NOFOLLOW ?? 0;
export function createFileBackend(root) {
  if(typeof root!=='string'||!root.startsWith('/')) throw Error('Unsafe root');
  const base=resolve(root);
  if(base==='/'||base==='/tmp'||base.startsWith('/tmp/')||base==='/var/tmp'||base.startsWith('/var/tmp/')) throw Error('Unsafe root');
  const objects=join(base,'objects');
  async function locate(key,write=false) {
    if(!KEY.test(key)) throw Error('Invalid object key');
    if(write) {
      await mkdir(base,{recursive:true,mode:0o700});
      try {
        await mkdir(objects,{mode:0o700});
      } catch (err) {
        if (err?.code !== 'EEXIST') throw err;
      }
    }
    for(const dir of [base,objects]) {
      const s=await lstat(dir);
      if(!s.isDirectory()||s.isSymbolicLink()||(s.mode&0o022)!==0) throw Error('Unsafe storage directory');
      if(await realpath(dir)!==dir) throw Error('Unsafe storage path');
    }
    return join(base,key);
  }
  return {
    async putExact(key,bytes) {
      if(!(bytes instanceof Uint8Array)||bytes.length>MAX) throw Error('Invalid payload');
      const path=await locate(key,true);
      const fh=await open(path,constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|nofollow,0o600);
      let written=false;
      try { await fh.writeFile(bytes); await fh.sync(); written=true; }
      finally { await fh.close(); if(!written) { try { const st=await lstat(path); if(st.isFile()&&!st.isSymbolicLink()) await unlink(path); } catch {} } }
    },
    async readExact(key) {
      const path=await locate(key);
      const fh=await open(path,constants.O_RDONLY|nofollow);
      try {
        const st=await fh.stat();
        if(!st.isFile()||st.size>MAX||(st.mode&0o022)!==0) throw Error('Unsafe object');
        const data=await fh.readFile();
        if(data.length!==st.size) throw Error('Object changed during read');
        const after=await fh.stat();
        if(after.size!==st.size||after.mtimeMs!==st.mtimeMs) throw Error('Object changed during read');
        return data;
      } finally {await fh.close();}
    },
    async deleteExact(key) {
      // Only for cleanup of private files; ledger revocation must happen first.
      const path=await locate(key);
      try {
        const fh=await open(path,constants.O_RDONLY|nofollow);
        try {
          const st=await fh.stat();
          if(!st.isFile()) throw Error('Unsafe object');
          const entry=await lstat(path);
          if(entry.dev!==st.dev||entry.ino!==st.ino||entry.isSymbolicLink()) throw Error('Object changed');
          await unlink(path);
        } finally {await fh.close();}
      } catch(e) {if(e?.code!=='ENOENT') throw e;}
    }
  };
}
