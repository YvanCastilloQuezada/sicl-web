import type { MediaMaster } from "../media/types";

export type DistributionTarget =
  | "PREVIEW"|"WEB"|"OTT_HLS"|"OTT_DASH"|"FAST"|"IPTV"|"CABLE"
  | "SATELLITE"|"TERRESTRIAL_TV"|"SOCIAL_LIVE";

export interface DistributionRequest {
  requestId:string;
  master:MediaMaster;
  targets:DistributionTarget[];
  territories:string[];
  scheduledAt?:string;
  rightsReferenceIds:string[];
  requestedBy:string;
}
export interface DistributionDecision {
  requestId:string;
  allowedTargets:DistributionTarget[];
  blockedTargets:{target:DistributionTarget;reasons:string[]}[];
  requiresHumanApproval:true;
  published:false;
}
