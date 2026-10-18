import type { DistributionTarget } from "./types";
export interface ChannelPlan {
  name:string;
  target:DistributionTarget;
  transport:"FILE"|"HLS"|"DASH"|"SRT"|"RIST"|"RTMP"|"SDI"|"NDI"|"PROVIDER_SPECIFIC";
  redundancy:"NONE"|"ACTIVE_PASSIVE"|"ACTIVE_ACTIVE";
  region?:string;
}
export function validateChannelPlan(p:ChannelPlan):string[] {
  const e:string[]=[];
  if ((p.target==="TERRESTRIAL_TV"||p.target==="CABLE"||p.target==="SATELLITE") && p.transport==="HLS")
    e.push("BROADCAST_DISTRIBUTION_REQUIRES_OPERATOR_SPECIFIC_CONTRIBUTION_PROFILE");
  return e;
}
