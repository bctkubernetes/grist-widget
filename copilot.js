/**
 * Copyright 2026 Bluecircle Technologies Pvt Limited. All rights reserved.
 *
 * Real-time awareness sync for Grist Widgets to parent Kue agent.
 */

export const COPILOT_MESSAGE_TYPE = "knet:copilot-state";

/**
 * Emit state directly to the parent frame (Kue chat agent shell).
 */
export function emitCopilotState(name, value, targetWindow) {
  const win = targetWindow || (typeof window !== "undefined" ? window.parent : undefined);
  if (!win || typeof win.postMessage !== "function") return;

  win.postMessage(
    {
      type: COPILOT_MESSAGE_TYPE,
      name,
      value,
    },
    "*"
  );
}
