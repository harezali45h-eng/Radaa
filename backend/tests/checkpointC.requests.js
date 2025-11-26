import dotenv from "dotenv";
import {
  __setInMemoryStoreForTests,
  createRequest,
  acceptRequest
} from "../services/requestsService.js";
import { acceptEphemeralRequest } from "../controllers/requestsController.js";
import { AuthError } from "../utils/errors.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createMockRes = () => {
  const response = {
    statusCode: 200,
    body: null
  };

  const res = {
    status(code) {
      response.statusCode = code;
      return this;
    },
    json(payload) {
      response.body = payload;
      return this;
    }
  };

  return { res, response };
};

const runLifecycleTest = async () => {
  __setInMemoryStoreForTests(50);

  const created = await createRequest({
    userId: "user-1",
    pickupPoint: { lat: -1.2921, lng: 36.8219 },
    partySize: 1,
    createdAt: new Date()
  });

  if (!created || !created.id) {
    throw new Error("createRequest did not return an id");
  }

  await delay(80);

  let error = null;
  try {
    await acceptRequest(created.id, "driver-1");
  } catch (err) {
    error = err;
  }

  if (!error) {
    throw new Error("Expected error when accepting an expired request, but none was thrown");
  }
};

const runRoleEnforcementTest = async () => {
  const req = {
    params: { id: "dummy" },
    user: { _id: "user-1", role: "user" },
    app: { get: () => null },
    body: {}
  };

  const { res, response } = createMockRes();

  let nextError = null;
  const next = (err) => {
    nextError = err;
  };

  await acceptEphemeralRequest(req, res, next);
 
  // Validate proper error forwarding in isolated controller test
  if (!nextError) {
    throw new Error("Expected controller to forward an AuthError via next(error)");
  }
  if (!(nextError instanceof AuthError)) {
    throw new Error("Expected nextError to be an AuthError");
  }
};

const run = async () => {
  await runLifecycleTest();
  await runRoleEnforcementTest();

  // eslint-disable-next-line no-console
  console.log("Checkpoint C requests tests passed");
};

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
