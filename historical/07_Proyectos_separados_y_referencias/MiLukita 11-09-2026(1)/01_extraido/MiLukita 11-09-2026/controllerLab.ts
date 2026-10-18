export const CONTROLLER_ROLES = ["USER", "PRESENTER", "OPERATOR"] as const;
export type ControllerRole = (typeof CONTROLLER_ROLES)[number];

export const CONTROLLER_MODES = ["REMOTE", "GAMEPAD", "TRACKPAD", "KEYBOARD"] as const;
export type ControllerMode = (typeof CONTROLLER_MODES)[number];

export const CONTROLLER_COMMANDS = ["NAVIGATE", "SELECT", "BACK", "HOME", "EXIT", "TEXT", "PLAYBACK", "QR_VISIBILITY"] as const;
export type ControllerCommandType = (typeof CONTROLLER_COMMANDS)[number];

const USER_COMMANDS: readonly ControllerCommandType[] = ["NAVIGATE", "SELECT", "BACK", "HOME", "EXIT", "TEXT"];
const PRESENTATION_COMMANDS: readonly ControllerCommandType[] = [...USER_COMMANDS, "PLAYBACK", "QR_VISIBILITY"];

export function canSendControllerCommand(role: ControllerRole, command: ControllerCommandType) {
  return (role === "USER" ? USER_COMMANDS : PRESENTATION_COMMANDS).includes(command);
}

export function canCreateControllerSession(role: ControllerRole) {
  return role === "PRESENTER" || role === "OPERATOR";
}

export function isControllerRole(value: string): value is ControllerRole {
  return CONTROLLER_ROLES.includes(value as ControllerRole);
}

export const CONTROLLER_CORE_BOUNDARY = [
  "RNG",
  "RESULTS",
  "RULES",
  "WALLET",
  "LEDGER",
  "SETTLEMENT",
  "CREDITS",
  "MJP_TV_MANIFEST",
] as const;
