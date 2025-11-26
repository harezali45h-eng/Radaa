export const emitMatatuUpdate = (app, payload = {}) => {
  try {
    if (!app || typeof app.get !== "function") {
      return;
    }

    const io = app.get("io");
    if (!io) {
      return;
    }

    const realtime = io.of("/realtime");
    realtime.emit("matatus:live_update", payload || {});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[devEmitHelpers] emitMatatuUpdate error", error);
  }
};

export const emitRideAssigned = (app, payload = {}) => {
  try {
    if (!app || typeof app.get !== "function") {
      return;
    }

    const io = app.get("io");
    if (!io) {
      return;
    }

    const realtime = io.of("/realtime");
    realtime.emit("ride:assigned", payload || {});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[devEmitHelpers] emitRideAssigned error", error);
  }
};
