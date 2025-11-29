export const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Radaa Backend API",
    version: "1.0.0",
    description: "API documentation for Radaa backend (Users, Auth, Matatu, Trips, Payments, Loyalty, Health, Admin)."
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Local dev server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Loyalty: {
        type: "object",
        properties: {
          paidRidesCount: { type: "integer", example: 3 },
          freeRides: { type: "integer", example: 1 }
        }
      },
      UserPublic: {
        type: "object",
        properties: {
          _id: { type: "string" },
          username: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          loyalty: { $ref: "#/components/schemas/Loyalty" }
        }
      },
      UserWithToken: {
        allOf: [
          { $ref: "#/components/schemas/UserPublic" },
          {
            type: "object",
            properties: {
              token: { type: "string" }
            }
          }
        ]
      },
      Matatu: {
        type: "object",
        properties: {
          _id: { type: "string" },
          plate: { type: "string" },
          route: { type: "string" },
          driverName: { type: "string" },
          driverPhone: { type: "string" },
          status: { type: "string", example: "active" },
          lastLocation: {
            type: "object",
            properties: {
              type: { type: "string", example: "Point" },
              coordinates: {
                type: "array",
                items: { type: "number" },
                description: "[lng, lat]"
              }
            }
          },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Trip: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          matatu: { type: "string" },
          status: { type: "string", example: "ongoing" },
          startTime: { type: "string", format: "date-time" },
          endTime: { type: "string", format: "date-time", nullable: true },
          startLocation: {
            type: "object",
            properties: {
              type: { type: "string", example: "Point" },
              coordinates: { type: "array", items: { type: "number" } }
            }
          },
          endLocation: {
            type: "object",
            nullable: true,
            properties: {
              type: { type: "string", example: "Point" },
              coordinates: { type: "array", items: { type: "number" } }
            }
          },
          fare: { type: "number" },
          currency: { type: "string", example: "KES" }
        }
      },
      RidePayment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          matatu: { type: "string" },
          amount: { type: "number" },
          currency: { type: "string", example: "KES" },
          provider: { type: "string" },
          providerPaymentId: { type: "string" },
          status: { type: "string", example: "success" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          code: { type: "string" },
          details: { type: "array", items: { type: "object" }, nullable: true }
        }
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          db: { type: "string", example: "connected" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Health status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  password: { type: "string" }
                },
                required: ["username", "email", "password"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "User registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserWithToken" }
              }
            }
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserWithToken" }
              }
            }
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          401: {
            description: "Auth error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserPublic" }
              }
            }
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        responses: {
          200: {
            description: "Users list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/UserPublic" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Users"],
        summary: "Create user (admin/bootstrap)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  password: { type: "string" }
                },
                required: ["username", "email", "password"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserPublic" }
              }
            }
          }
        }
      }
    },
    "/matatus/{id}/location": {
      post: {
        tags: ["Matatu"],
        summary: "Update matatu location",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  lat: { type: "number" },
                  lng: { type: "number" }
                },
                required: ["lat", "lng"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Location updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true }
                  }
                }
              }
            }
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/payments/ride": {
      post: {
        tags: ["Payments"],
        summary: "Create ride payment and update loyalty",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  matatuId: { type: "string" },
                  amount: { type: "number" },
                  currency: { type: "string" },
                  provider: { type: "string" },
                  providerPaymentId: { type: "string" },
                  status: { type: "string" }
                },
                required: ["userId", "matatuId", "amount", "provider", "providerPaymentId"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Payment recorded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    payment: { $ref: "#/components/schemas/RidePayment" },
                    loyalty: { $ref: "#/components/schemas/Loyalty" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/payments/redeem-free": {
      post: {
        tags: ["Payments"],
        summary: "Redeem a free ride",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  matatuId: { type: "string" },
                  provider: { type: "string" }
                },
                required: ["userId", "matatuId"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Free ride redeemed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    payment: { $ref: "#/components/schemas/RidePayment" },
                    loyalty: { $ref: "#/components/schemas/Loyalty" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/trips/start": {
      post: {
        tags: ["Trips"],
        summary: "Start a trip",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  matatuId: { type: "string" },
                  lat: { type: "number" },
                  lng: { type: "number" }
                },
                required: ["userId", "matatuId", "lat", "lng"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Trip started",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Trip" }
              }
            }
          }
        }
      }
    },
    "/trips/{id}/stop": {
      post: {
        tags: ["Trips"],
        summary: "Stop a trip",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  lat: { type: "number" },
                  lng: { type: "number" },
                  fare: { type: "number" },
                  currency: { type: "string" }
                },
                required: ["lat", "lng", "fare"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Trip completed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Trip" }
              }
            }
          }
        }
      }
    },
    "/trips/user/{userId}": {
      get: {
        tags: ["Trips"],
        summary: "Get user trip history",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Trips list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Trip" }
                }
              }
            }
          }
        }
      }
    }
  }
};
