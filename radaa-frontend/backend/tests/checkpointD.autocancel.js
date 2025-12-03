import mongoose from "mongoose";
import dotenv from "dotenv";
import BookingWaiting from "../models/BookingWaiting.js";
import AuditLog from "../models/AuditLog.js";
import { __setInMemoryStoreForTests, createRequest } from "../services/requestsService.js";
import {
  __setAutoCancelConfigForTests,
  registerWaitingBooking,
  handlePassengerPing
} from "../services/autoCancelService.js";
import { up as up0003 } from "../migrations/0003_create_bookings_waiting_and_audit.up.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildAppStub = (events) => ({
  get(name) {
    if (name !== "io") return null;

    return {
      of() {
        return {
          emit(event, payload) {
            events.push({ event, payload });
          }
        };
      }
    };
  }
});

const runAutoCancelFlowTest = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGO_URI or MONGODB_URI must be set for Checkpoint D tests");
  }

  await mongoose.connect(uri);

  await up0003(mongoose);

  await BookingWaiting.deleteMany({ requestId: /CPD-/ });
  await AuditLog.deleteMany({ type: "AUTO_CANCEL" });

  __setInMemoryStoreForTests(60000);
  __setAutoCancelConfigForTests({
    distanceMeters: 50,
    warningMs: 80,
    graceMs: 80
  });

  const requestId = `CPD-${Date.now().toString(36)}`;
  const userId = new mongoose.Types.ObjectId();

  await createRequest({
    requestId,
    userId: userId.toString(),
    pickupPoint: { lat: 0, lng: 0 },
    partySize: 1,
    createdAt: new Date()
  });

  await registerWaitingBooking({
    requestId,
    userId,
    pickupPoint: { lat: 0, lng: 0 }
  });

  const events = [];
  const app = buildAppStub(events);

  // Inside radius should not emit any events
  await handlePassengerPing({
    requestId,
    userId: userId.toString(),
    location: { lat: 0, lng: 0 },
    app
  });

  if (events.length !== 0) {
    throw new Error("Expected no events while passenger is within pickup radius");
  }

  // Move outside radius and wait long enough for warning and then auto-cancel
  await delay(100);

  await handlePassengerPing({
    requestId,
    userId: userId.toString(),
    location: { lat: 0.001, lng: 0 },
    app
  });

  await delay(100);

  await handlePassengerPing({
    requestId,
    userId: userId.toString(),
    location: { lat: 0.001, lng: 0 },
    app
  });

  await delay(100);

  await handlePassengerPing({
    requestId,
    userId: userId.toString(),
    location: { lat: 0.001, lng: 0 },
    app
  });

  const warningEvent = events.find((e) => e.event === "ride:auto_cancel_warning");
  const cancelledEvent = events.find((e) => e.event === "ride:auto_cancelled");

  if (!warningEvent) {
    throw new Error("Expected ride:auto_cancel_warning event to be emitted");
  }

  if (!cancelledEvent) {
    throw new Error("Expected ride:auto_cancelled event to be emitted");
  }

  const booking = await BookingWaiting.findOne({ requestId }).lean();

  if (!booking) {
    throw new Error("Expected BookingWaiting document to exist");
  }

  if (booking.autoCancelReason !== "auto_cancelled_drift") {
    throw new Error("Expected booking.autoCancelReason to be auto_cancelled_drift");
  }

  if (!booking.autoCancelAt) {
    throw new Error("Expected booking.autoCancelAt to be set");
  }

  const audit = await AuditLog.findOne({ requestId, type: "AUTO_CANCEL" }).lean();

  if (!audit) {
    throw new Error("Expected AUTO_CANCEL audit log to be written");
  }
};

const run = async () => {
  await runAutoCancelFlowTest();

  // eslint-disable-next-line no-console
  console.log("Checkpoint D auto-cancel tests passed");
};

run()
  .then(() => mongoose.disconnect())
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    mongoose
      .disconnect()
      .catch(() => {})
      .finally(() => {
        process.exit(1);
      });
  });
