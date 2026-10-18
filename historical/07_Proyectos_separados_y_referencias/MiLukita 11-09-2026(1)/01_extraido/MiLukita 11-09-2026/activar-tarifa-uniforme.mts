import { activateUniformCreditRules } from "../server/pilot";

const result = await activateUniformCreditRules(1);
console.log(JSON.stringify(result, null, 2));
