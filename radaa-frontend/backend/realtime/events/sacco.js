export const emitSaccoStatsUpdate = (app, payload = {}) => {
  try {
    if (!app || typeof app.get !== "function") {
      return;
    }

    const io = app.get("io");
    if (!io) {
      return;
    }

    const realtime = io.of("/realtime");
    realtime.emit("sacco:update", payload || {});
  } catch (error) {
    console.error("[realtime/events/sacco] emitSaccoStatsUpdate error", error);
  }
};
