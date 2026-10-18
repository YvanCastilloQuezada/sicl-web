import { activateRecalibratedGameRules } from "../pilot";

async function main() {
  const actorUserId = Number(process.env.PILOT_ACTOR_USER_ID ?? "1");
  if (!Number.isInteger(actorUserId) || actorUserId < 1) throw new Error("PILOT_ACTOR_USER_ID debe ser un entero positivo.");
  const result = await activateRecalibratedGameRules(actorUserId);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
