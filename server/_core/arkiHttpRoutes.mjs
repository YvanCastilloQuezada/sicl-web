/** MO-17 candidate: authenticated Express routes; not registered by default.
 * Caller MUST supply getAuthenticatedUser backed by the application's verified session.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PROJECT = /^[A-Za-z0-9_.-]{1,128}$/;
const MAX_B64 = Math.ceil(25*1024*1024/3)*4+4;
export function registerArkiStorageRoutes(app, {storage, getAuthenticatedUser, enabled=false}) {
  if (!enabled) throw new Error('MO17_NOT_AUTHORIZED_FOR_ACTIVATION');
  if (!app?.post || !app?.get || !app?.delete || !storage?.put || !storage?.read || !storage?.revoke || typeof getAuthenticatedUser !== 'function') throw new Error('Invalid MO17 dependencies');
  const authenticate = async (req,res) => {
    const user = await getAuthenticatedUser(req,res);
    if (!Number.isSafeInteger(user?.id) || user.id <= 0) throw new Error('UNAUTHENTICATED');
    return user.id;
  };
  const failure=(res,e)=>res.status(e?.message==='UNAUTHENTICATED'?401:403).set('Cache-Control','no-store').json({error:'STORAGE_ACCESS_DENIED'});
  app.post('/api/arki-storage/projects/:projectId/objects', async (req,res)=>{
    try {
      const ownerId=await authenticate(req,res);
      const projectId=req.params.projectId;
      const {contentType,base64}=req.body ?? {};
      if (!PROJECT.test(projectId) || typeof base64!=='string' || base64.length>MAX_B64 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) throw Error('INVALID_INPUT');
      const body=Buffer.from(base64,'base64');
      if (body.length>25*1024*1024 || body.toString('base64')!==base64) throw Error('INVALID_INPUT');
      const stored=await storage.put({ownerId,projectId,data:body,contentType});
      res.status(201).set('Cache-Control','no-store').json({objectId:stored.objectId,sha256:stored.sha256,sizeBytes:stored.sizeBytes});
    } catch(e) {failure(res,e)}
  });
  app.get('/api/arki-storage/projects/:projectId/objects/:objectId',async(req,res)=>{
    try {
      const ownerId=await authenticate(req,res);
      if (!PROJECT.test(req.params.projectId) || !UUID.test(req.params.objectId)) throw Error('INVALID_INPUT');
      const {body,contentType}=await storage.read({ownerId,projectId:req.params.projectId,objectId:req.params.objectId});
      res.status(200).set({'Content-Type':contentType,'Content-Disposition':'attachment','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}).send(body);
    } catch(e) {failure(res,e)}
  });
  app.delete('/api/arki-storage/projects/:projectId/objects/:objectId',async(req,res)=>{
    try {
      const ownerId=await authenticate(req,res);
      if (!PROJECT.test(req.params.projectId) || !UUID.test(req.params.objectId)) throw Error('INVALID_INPUT');
      await storage.revoke({ownerId,projectId:req.params.projectId,objectId:req.params.objectId});
      res.status(204).set('Cache-Control','no-store').end();
    } catch(e) {failure(res,e)}
  });
}
