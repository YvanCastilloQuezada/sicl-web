import type { DistributionDecision, DistributionRequest } from "./types";

export function reviewDistribution(req:DistributionRequest):DistributionDecision {
  const blocked:DistributionDecision["blockedTargets"]=[];
  const allowed:DistributionDecision["allowedTargets"]=[];
  for (const target of req.targets) {
    const reasons:string[]=[];
    if (!req.master.humanApprovedForDistribution) reasons.push("HUMAN_DISTRIBUTION_APPROVAL_REQUIRED");
    if (target!=="PREVIEW" && req.rightsReferenceIds.length===0) reasons.push("RIGHTS_EVIDENCE_REQUIRED");
    if (req.territories.length===0) reasons.push("TERRITORY_REQUIRED");
    if (reasons.length) blocked.push({target,reasons}); else allowed.push(target);
  }
  return {requestId:req.requestId,allowedTargets:allowed,blockedTargets:blocked,requiresHumanApproval:true,published:false};
}
