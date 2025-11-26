export const emitMatatuUpdate = (app, matatu = {}) => {
  try {
    if (!app || typeof app.get !== "function") {
      return;
    }

    const io = app.get("io");
    if (!io) {
      return;
    }

    const realtime = io.of("/realtime");
    realtime.emit("matatus:live_update", matatu || {});
  } catch (error) {
    console.error("[realtime/events/matatu] emitMatatuUpdate error", error);
  }
};
