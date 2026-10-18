import { activateBingoRecalibration } from "../pilot";

const actorUserId = Number(process.env.SIMULATION_ACTOR_ID ?? "1");

if (!Number.isInteger(actorUserId) || actorUserId < 1) {
  throw new Error("SIMULATION_ACTOR_ID debe identificar a un operador válido.");
}

activateBingoRecalibration(actorUserId)
  .then(result => console.log(JSON.stringify(result, null, 2)))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
