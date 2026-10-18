import { activateLoteriaRecalibration } from "../pilot";

const actorUserId = Number(process.env.PILOT_ACTOR_USER_ID ?? 1);

if (!Number.isInteger(actorUserId) || actorUserId < 1) throw new Error("PILOT_ACTOR_USER_ID debe ser un identificador de usuario válido.");

async function main() {
  const activation = await activateLoteriaRecalibration(actorUserId);
  console.log(JSON.stringify({ action: "loteria-v1.0.1-activated", actorUserId, activation }, null, 2));
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
