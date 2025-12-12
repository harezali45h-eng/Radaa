import { z } from "zod";

const numericCoordinate = (field) =>
  z
    .union([z.number(), z.string()])
    .transform((value) => (typeof value === "number" ? value : Number(value)))
    .refine((value) => !Number.isNaN(value), {
      message: `${field} must be a number`
    });

const latitudeSchema = numericCoordinate("lat").refine((value) => value >= -90 && value <= 90, {
  message: "lat must be between -90 and 90"
});

const longitudeSchema = numericCoordinate("lng").refine(
  (value) => value >= -180 && value <= 180,
  {
    message: "lng must be between -180 and 180"
  }
);

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(1, "username is required"),
    handle: z
      .string()
      .min(2, "handle must be at least 2 characters")
      .regex(/^@/, "handle must start with @ (e.g. @wes)")
      .optional(),
    email: z.string().email("valid email is required"),
    phone: z.string().optional(),
    password: z.string().min(6, "password must be at least 6 characters"),
    role: z.enum(["user", "driver", "admin"]).optional(),
    saccoName: z.string().optional(),
    registrationNumber: z.string().optional(),
    vehicleRegistration: z.string().optional(),
    licenseNumber: z.string().optional(),
    profilePhoto: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("valid email is required"),
    password: z.string().min(1, "password is required")
  })
});

export const matatuLocationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "matatu id is required")
  }),
  body: z.object({
    lat: latitudeSchema,
    lng: longitudeSchema
  })
});

export const startTripSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
    matatuId: z.string().min(1, "matatuId is required"),
    lat: latitudeSchema,
    lng: longitudeSchema
  })
});

export const stopTripSchema = z.object({
  params: z.object({
    id: z.string().min(1, "trip id is required")
  }),
  body: z.object({
    lat: latitudeSchema,
    lng: longitudeSchema,
    fare: z
      .union([z.number(), z.string()])
      .transform((value) => (typeof value === "number" ? value : Number(value)))
      .refine((value) => !Number.isNaN(value), {
        message: "fare must be a number"
      }),
    currency: z.string().optional()
  })
});

export const createRidePaymentSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
    matatuId: z.string().min(1, "matatuId is required"),
    amount: z
      .union([z.number(), z.string()])
      .transform((value) => (typeof value === "number" ? value : Number(value)))
      .refine((value) => !Number.isNaN(value), {
        message: "amount must be a number"
      }),
    currency: z.string().optional(),
    provider: z.string().min(1, "provider is required"),
    providerPaymentId: z.string().min(1, "providerPaymentId is required"),
    status: z.string().optional()
  })
});

export const redeemFreeRideSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
    matatuId: z.string().min(1, "matatuId is required"),
    provider: z.string().optional()
  })
});

export const initiateMpesaPaymentSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
    matatuId: z.string().min(1, "matatuId is required"),
    amount: z
      .union([z.number(), z.string()])
      .transform((value) => (typeof value === "number" ? value : Number(value)))
      .refine((value) => !Number.isNaN(value) && value > 0, {
        message: "amount must be a positive number"
      }),
    phoneNumber: z.string().min(1, "phoneNumber is required"),
    accountReference: z.string().optional(),
    description: z.string().optional()
  })
});

export const createEphemeralRequestSchema = z.object({
  body: z.object({
    pickup: z.object({
      lat: latitudeSchema,
      lng: longitudeSchema
    }),
    partySize: z
      .union([z.number(), z.string()])
      .transform((value) => (typeof value === "number" ? value : Number(value)))
      .refine((value) => !Number.isNaN(value) && value >= 1 && value <= 10, {
        message: "partySize must be a number between 1 and 10"
      })
      .optional(),
    meta: z.record(z.any()).optional()
  })
});

export const getNearbyEphemeralRequestsSchema = z.object({
  query: z.object({
    lat: latitudeSchema,
    lng: longitudeSchema,
    radius: z
      .union([z.number(), z.string()])
      .transform((value) => (typeof value === "number" ? value : Number(value)))
      .refine((value) => !Number.isNaN(value) && value >= 0, {
        message: "radius must be a non-negative number"
      })
      .optional()
  })
});

export const acceptEphemeralRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1, "request id is required")
  })
});

export const cancelEphemeralRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1, "request id is required")
  }),
  body: z
    .object({
      reason: z.string().min(1, "reason must not be empty").optional()
    })
    .optional()
});

export const lockRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1, "request id is required")
  }),
  body: z
    .object({
      locked: z
        .union([z.boolean(), z.string()])
        .transform((value) => {
          if (typeof value === "boolean") return value;
          if (typeof value === "string") {
            const lower = value.toLowerCase();
            if (lower === "true") return true;
            if (lower === "false") return false;
          }
          return Boolean(value);
        })
        .optional()
    })
    .optional()
});

const pingLocationShape = z.object({
  lat: latitudeSchema,
  lng: longitudeSchema
});

export const pingPassengerLocationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "request id is required")
  }),
  body: z.union([
    pingLocationShape,
    z.object({
      location: pingLocationShape
    })
  ])
});

export const createRideRequestSchema = z.object({
  body: z.object({
    pickup: z.object({
      lat: latitudeSchema,
      lng: longitudeSchema
    }),
    destination: z
      .object({
        lat: latitudeSchema,
        lng: longitudeSchema
      })
      .optional(),
    saccoId: z.string().min(1).optional(),
    matatuId: z.string().min(1).optional()
  })
});

export const estimateFareSchema = z.object({
  body: z.object({
    pickup: z.object({
      lat: latitudeSchema,
      lng: longitudeSchema
    }),
    destination: z
      .object({
        lat: latitudeSchema,
        lng: longitudeSchema
      })
      .optional(),
    partySize: z
      .union([z.number(), z.string()])
      .transform((value) => (typeof value === "number" ? value : Number(value)))
      .refine((value) => !Number.isNaN(value) && value >= 1 && value <= 10, {
        message: "partySize must be a number between 1 and 10"
      })
      .optional(),
    routeName: z.string().max(120).optional()
  })
});

export const getNearbyRideRequestsSchema = z.object({
  query: z.object({
    lat: latitudeSchema,
    lng: longitudeSchema,
    radius: z
      .union([z.number(), z.string()])
      .transform((value) => (typeof value === "number" ? value : Number(value)))
      .refine((value) => !Number.isNaN(value) && value >= 0, {
        message: "radius must be a non-negative number"
      })
      .optional()
  })
});

export const acceptRideRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ride id is required")
  })
});

export const cancelRideRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ride id is required")
  })
});

export const getUserRidesSchema = z.object({
  params: z.object({
    id: z.string().min(1, "user id is required")
  })
});

export const createRatingSchema = z.object({
  body: z.object({
    matatuId: z.string().min(1, "matatuId is required"),
    driverId: z.string().min(1).optional(),
    rating: z
      .union([z.number(), z.string()])
      .transform((value) => (typeof value === "number" ? value : Number(value)))
      .refine((value) => !Number.isNaN(value) && value >= 1 && value <= 5, {
        message: "rating must be between 1 and 5"
      }),
    comment: z.string().max(1000).optional()
  })
});

export const getMatatuRatingsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "matatu id is required")
  }),
  query: z
    .object({
      page: z
        .union([z.number(), z.string()])
        .transform((value) => (typeof value === "number" ? value : Number(value)))
        .refine((value) => !Number.isNaN(value) && value >= 1, {
          message: "page must be a positive number"
        })
        .optional(),
      pageSize: z
        .union([z.number(), z.string()])
        .transform((value) => (typeof value === "number" ? value : Number(value)))
        .refine((value) => !Number.isNaN(value) && value >= 1 && value <= 50, {
          message: "pageSize must be between 1 and 50"
        })
        .optional()
    })
    .optional()
});

export const photoModerationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "matatu id is required"),
    photoId: z.string().min(1, "photo id is required")
  }),
  body: z
    .object({
      reason: z.string().max(500).optional()
    })
    .optional()
});

export const saccoSetDriverEnabledSchema = z.object({
  params: z.object({
    id: z.string().min(1, "sacco id is required"),
    driverId: z.string().min(1, "driver id is required")
  }),
  body: z.object({
    enabled: z
      .union([z.boolean(), z.string()])
      .transform((value) => {
        if (typeof value === "boolean") return value;
        if (typeof value === "string") {
          const lower = value.toLowerCase();
          if (lower === "true") return true;
          if (lower === "false") return false;
        }
        return Boolean(value);
      })
  })
});

export const saccoOverviewSchema = z.object({
  params: z.object({
    id: z.string().min(1, "sacco id is required")
  }),
  query: z
    .object({
      range: z.string().optional()
    })
    .optional()
});

export const saccoListDriversSchema = z.object({
  params: z.object({
    id: z.string().min(1, "sacco id is required")
  })
});

export const saccoListMatatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, "sacco id is required")
  }),
  query: z
    .object({
      status: z.string().optional()
    })
    .optional()
});

export const saccoSetDriverVerificationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "sacco id is required"),
    driverId: z.string().min(1, "driver id is required")
  }),
  body: z.object({
    status: z.enum(["pending", "approved", "rejected"])
  })
});

export const saccoSetMatatuApprovalSchema = z.object({
  params: z.object({
    id: z.string().min(1, "sacco id is required"),
    matatuId: z.string().min(1, "matatu id is required")
  }),
  body: z.object({
    status: z.enum(["pending", "approved", "rejected"])
  })
});
