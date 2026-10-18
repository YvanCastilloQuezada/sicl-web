import fs from "node:fs";
const path = "/home/ubuntu/ruleta-peru-online/client/src/pages/TerritorialTrustPage.tsx";
const lines = fs.readFileSync(path, "utf8").split("\n");
const index = lines.findIndex((line) => line.includes("{(fieldIsMapper || !fieldMode) ? <section className=\"mt-5 border border-white/10 bg-white/[.03] p-4\">") && line.includes("Historial de sincronización y decisiones"));
if (index < 0) throw new Error("network JSX line not found");
lines[index] = "  {(fieldIsMapper || !fieldMode) ? <NetworkStatusPanel isOnline={isOnline} offlineQueue={offlineQueue} syncingOffline={syncingOffline} onSync={manualSync} onOpenQueue={() => setShowSyncDrawer(true)} syncNotifications={syncNotifications} syncHistory={syncHistory} /> : null}";
fs.writeFileSync(path, lines.join("\n"));
