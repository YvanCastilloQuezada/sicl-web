import { buildDefaultLiveSchedule, simulateLiveDay } from "../shared/liveChannel";

const report = simulateLiveDay(buildDefaultLiveSchedule());
console.log(JSON.stringify(report, null, 2));
