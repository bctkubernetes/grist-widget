/**
 * Copyright 2026 Bluecircle Technologies Pvt Limited. All rights reserved.
 */

import assert from "node:assert/strict";
import test from "node:test";

let fc;
try {
  fc = (await import("fast-check")).default;
} catch {
  const mod = await import(
    "/Users/rajattyagi/Applications/knet/platform-ui/node_modules/fast-check/lib/esm/fast-check.js"
  );
  fc = mod.default || mod;
}

import { COPILOT_MESSAGE_TYPE, emitCopilotState } from "../copilot.js";

test("Requirement: Real-Time Widget Screen Awareness", async (t) => {
  await t.test("Protocol: type is strictly 'knet:copilot-state'", () => {
    assert.equal(COPILOT_MESSAGE_TYPE, "knet:copilot-state");
  });

  await t.test("Scenario: Active widget record updates", () => {
    const messages = [];
    const mockWindow = {
      postMessage: (msg, origin) => {
        messages.push({ msg, origin });
      },
    };

    const payload = {
      id: 42,
      widget: "notepad",
    };

    emitCopilotState("activeWidgetRecord", payload, mockWindow);

    assert.equal(messages.length, 1);
    assert.deepEqual(messages[0].msg, {
      type: "knet:copilot-state",
      name: "activeWidgetRecord",
      value: payload,
    });
    assert.equal(messages[0].origin, "*");
  });

  await t.test("Scenario: Active widget record unmounts or resets (null payload)", () => {
    const messages = [];
    const mockWindow = {
      postMessage: (msg, origin) => {
        messages.push({ msg, origin });
      },
    };

    emitCopilotState("activeWidgetRecord", null, mockWindow);

    assert.equal(messages.length, 1);
    assert.deepEqual(messages[0].msg, {
      type: "knet:copilot-state",
      name: "activeWidgetRecord",
      value: null,
    });
  });

  await t.test("Property: emitCopilotState delivers exact payload across arbitrary inputs", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.oneof(
          fc.constant(null),
          fc.record({
            id: fc.integer(),
            widget: fc.string(),
          })
        ),
        (name, value) => {
          const sent = [];
          const fakeWin = {
            postMessage: (msg) => sent.push(msg),
          };

          emitCopilotState(name, value, fakeWin);

          assert.equal(sent.length, 1);
          assert.equal(sent[0].type, "knet:copilot-state");
          assert.equal(sent[0].name, name);
          assert.deepEqual(sent[0].value, value);
        }
      )
    );
  });
});
