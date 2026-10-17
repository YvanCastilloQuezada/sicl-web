/** ARKI MO-16: opt-in service; not an HTTP route or production activation. */
import {randomUUID, createHash} from 'node:crypto';
const deny = () => { throw new Error('STORAGE_ACCESS_DENIED'); };
const isId = v => Number.isSafeInteger(v) && v > 0;
const isProject = v => typeof v === 'string' && /^[A-Za-z0-9_.-]{1,128}$/.test(v);
const isMime = v => typeof v === 'string' && v.length <= 200 && /^[\w.+-]+\/[\w.+-]+$/.test(v);
const hash = b => createHash('sha256').update(b).digest('hex');
export function createAuthorizedStorage({ledger, files}) {
  if (!ledger || !files || !['insertPending','transitionReady','revoke','get','isProjectOwner'].every(k => typeof ledger[k] === 'function') || !['putExact','readExact','deleteExact'].every(k => typeof files[k] === 'function')) throw new Error('Invalid storage dependencies');
  return {
    async put({ownerId, projectId, data, contentType}) {
      if (!isId(ownerId) || !isProject(projectId) || !isMime(contentType)) deny();
      if (!(Buffer.isBuffer(data) || data instanceof Uint8Array || typeof data === 'string')) deny();
      const body = Buffer.from(data);
      if (body.length > 25 * 1024 * 1024) deny();
      const objectId = randomUUID();
      const key = `objects/${objectId}`;
      const sha256 = hash(body);
      await ledger.insertPending({objectId,ownerId,projectId,key,sha256,sizeBytes:body.length,contentType});
      try {
        await files.putExact(key,body);
        await ledger.transitionReady(objectId,ownerId,projectId);
      } catch (err) {
        // Fail closed. Preserve error; revoke ledger and attempt file compensation.
        try { await ledger.revoke(objectId,ownerId,projectId); } catch {}
        try { await files.deleteExact(key); } catch {}
        throw err;
      }
      return {objectId,key,url:`/arki-storage/${objectId}`,sha256,sizeBytes:body.length,contentType};
    },
    async read({ownerId,projectId,objectId}) {
      if (!isId(ownerId) || !isProject(projectId) || typeof objectId !== 'string' || !/^[0-9a-f-]{36}$/i.test(objectId)) deny();
      // Double check project ownership on every read; get() alone is not ACL.
      if (!await ledger.isProjectOwner(ownerId,projectId)) deny();
      const record = await ledger.get(objectId);
      if (!record || record.status !== 'READY' || record.ownerId !== ownerId || record.projectId !== projectId || record.key !== `objects/${objectId}`) deny();
      const body = await files.readExact(record.key);
      if (!Buffer.isBuffer(body) || body.length !== record.sizeBytes || hash(body) !== record.sha256) throw new Error('STORAGE_INTEGRITY_FAILURE');
      return {body,contentType:record.contentType};
    },
    async revoke({ownerId,projectId,objectId}) {
      if (!isId(ownerId) || !isProject(projectId)) deny();
      await ledger.revoke(objectId,ownerId,projectId);
      // No physical deletion: retain for reconciliation and audit.
    }
  };
}
