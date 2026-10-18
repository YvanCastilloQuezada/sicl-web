/**
 * TEMPORARY / DEVELOPMENT-PRELAUNCH ONLY.
 * Product-owner access switch; do not use as a production security control.
 *
 * true  = skip the frontend sign-in gate so ARKI opens directly.
 * false = restore the normal Manus OAuth entry gate.
 *
 * This does not grant anonymous backend access: protected tRPC procedures
 * still require a real session and will continue to enforce authorization.
 */
export const TEMPORARY_DIRECT_ACCESS = true;
