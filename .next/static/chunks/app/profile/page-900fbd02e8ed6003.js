(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [178],
  {
    4939: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 7083));
    },
    7083: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return l;
          },
        }));
      var s = a(7437),
        r = a(2265),
        i = a(3429),
        o = a(542);
      function l() {
        var e, t, a, l, n, d, c, u;
        let { user: m } = (0, i.a)(),
          [v, h] = (0, r.useState)(null);
        (0, r.useEffect)(() => {
          let e = window.localStorage.getItem("radaa_user_id");
          e &&
            (0, o.GX)(e)
              .then((e) => h(e))
              .catch(() => void 0);
        }, []);
        let x = v ? (v.loyalty.paidRidesCount / 10) * 100 : 0,
          f = (null == m ? void 0 : m.role) === "driver";
        return (0, s.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, s.jsxs)("section", {
              className: "space-y-2",
              children: [
                (0, s.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Your Profile",
                }),
                (0, s.jsx)("p", {
                  className: "text-xs text-slate-300",
                  children:
                    "This screen focuses on your ride and loyalty stats. Hook it up to your auth profile data later.",
                }),
              ],
            }),
            f &&
              m &&
              (0, s.jsxs)("section", {
                className: "space-y-3 radaa-card p-4 text-xs",
                children: [
                  (0, s.jsxs)("div", {
                    className: "flex items-center justify-between",
                    children: [
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-sm font-semibold text-slate-100",
                            children: "Driver profile",
                          }),
                          (0, s.jsx)("div", {
                            className: "text-[11px] text-slate-400",
                            children: "Basic details for your driver account.",
                          }),
                        ],
                      }),
                      (0, s.jsxs)("span", {
                        className:
                          "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200",
                        children: [
                          "Verification:",
                          " ",
                          (0, s.jsx)("span", {
                            className: "font-semibold",
                            children: m.driverVerificationStatus || "pending",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, s.jsxs)("div", {
                    className: "grid gap-3 md:grid-cols-2",
                    children: [
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-slate-400",
                            children: "Name",
                          }),
                          (0, s.jsx)("div", {
                            className:
                              "mt-1 text-sm font-semibold text-slate-100",
                            children: m.username,
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-slate-400",
                            children: "Driver ID",
                          }),
                          (0, s.jsx)("div", {
                            className:
                              "mt-1 text-sm font-semibold text-slate-100",
                            children: m._id,
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-slate-400",
                            children: "Phone",
                          }),
                          (0, s.jsx)("div", {
                            className:
                              "mt-1 text-sm font-semibold text-slate-100",
                            children: m.phone || "Not set",
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-slate-400",
                            children: "License number",
                          }),
                          (0, s.jsx)("div", {
                            className:
                              "mt-1 text-sm font-semibold text-slate-100",
                            children:
                              (null === (e = m.driverProfile) || void 0 === e
                                ? void 0
                                : e.licenseNumber) || "Not set",
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-slate-400",
                            children: "SACCO",
                          }),
                          (0, s.jsx)("div", {
                            className:
                              "mt-1 text-sm font-semibold text-slate-100",
                            children:
                              (null === (t = m.driverProfile) || void 0 === t
                                ? void 0
                                : t.saccoName) || "Not set",
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-slate-400",
                            children: "Vehicle",
                          }),
                          (0, s.jsx)("div", {
                            className:
                              "mt-1 text-sm font-semibold text-slate-100",
                            children:
                              (null === (a = m.driverProfile) || void 0 === a
                                ? void 0
                                : a.vehicleRegistration) || "Not set",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            (0, s.jsxs)("section", {
              className: "grid gap-4 md:grid-cols-3",
              children: [
                (0, s.jsxs)("div", {
                  className: "radaa-card p-4 text-xs",
                  children: [
                    (0, s.jsx)("div", {
                      className: "text-slate-400",
                      children: "Balance",
                    }),
                    (0, s.jsxs)("div", {
                      className: "mt-1 text-lg font-semibold text-emerald-400",
                      children: [
                        "KES ",
                        null !== (n = null == v ? void 0 : v.balance) &&
                        void 0 !== n
                          ? n
                          : 0,
                      ],
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                  children: [
                    (0, s.jsx)("div", {
                      className: "text-slate-400",
                      children: "Rides taken",
                    }),
                    (0, s.jsx)("div", {
                      className: "mt-1 text-lg font-semibold",
                      children:
                        null !== (d = null == v ? void 0 : v.ridesTaken) &&
                        void 0 !== d
                          ? d
                          : 0,
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                  children: [
                    (0, s.jsx)("div", {
                      className: "text-slate-400",
                      children: "Free rides available",
                    }),
                    (0, s.jsx)("div", {
                      className: "mt-1 text-lg font-semibold text-amber-300",
                      children:
                        null !==
                          (c =
                            null == v
                              ? void 0
                              : null === (l = v.loyalty) || void 0 === l
                                ? void 0
                                : l.freeRides) && void 0 !== c
                          ? c
                          : 0,
                    }),
                  ],
                }),
              ],
            }),
            (0, s.jsxs)("section", {
              className:
                "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
              children: [
                (0, s.jsxs)("div", {
                  className: "flex items-center justify-between",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("div", {
                          className: "font-medium",
                          children: "Loyalty progress",
                        }),
                        (0, s.jsx)("div", {
                          className: "text-slate-400",
                          children:
                            "Complete 10 paid rides to unlock a free ride.",
                        }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "text-right text-slate-300",
                      children: [
                        null !==
                          (u = null == v ? void 0 : v.loyalty.paidRidesCount) &&
                        void 0 !== u
                          ? u
                          : 0,
                        "/10 paid rides",
                      ],
                    }),
                  ],
                }),
                (0, s.jsx)("div", {
                  className:
                    "mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800",
                  children: (0, s.jsx)("div", {
                    className: "h-full rounded-full bg-emerald-400",
                    style: {
                      width: "".concat(Math.max(0, Math.min(100, x)), "%"),
                    },
                  }),
                }),
              ],
            }),
          ],
        });
      }
    },
    3429: function (e, t, a) {
      "use strict";
      a.d(t, {
        AuthProvider: function () {
          return c;
        },
        a: function () {
          return u;
        },
      });
      var s = a(7437),
        r = a(2265),
        i = a(2315);
      let o = "user",
        l = "token",
        n = "radaa_token",
        d = (0, r.createContext)(void 0);
      function c(e) {
        let { children: t } = e,
          [a, c] = (0, r.useState)(null),
          [u, m] = (0, r.useState)(null),
          [v, h] = (0, r.useState)(!0);
        (0, r.useEffect)(() => {
          try {
            let e = window.localStorage.getItem(o),
              t = window.sessionStorage.getItem(o),
              a = null,
              s = null;
            if (e) {
              let t = JSON.parse(e);
              t &&
                "string" == typeof t._id &&
                "string" == typeof t.token &&
                ((a = t), (s = t.token));
            }
            if (!a && t) {
              let e = JSON.parse(t);
              e &&
                "string" == typeof e._id &&
                "string" == typeof e.token &&
                ((a = e), (s = e.token));
            }
            if (!s) {
              let e =
                window.localStorage.getItem(l) ||
                window.sessionStorage.getItem(l);
              e && "string" == typeof e && (s = e);
            }
            (a && c(a), s && m(s));
          } catch (e) {
          } finally {
            h(!1);
          }
        }, []);
        let x = async function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            h(!0);
            try {
              let a = await (0, i.x4)(e),
                s = {
                  _id: a._id,
                  email: a.email,
                  token: a.token,
                  username: a.username,
                  handle: a.handle,
                  phone: a.phone,
                  createdAt: a.createdAt,
                  role: a.role,
                  enabled: a.enabled,
                  driverProfile: a.driverProfile,
                  driverVerificationStatus: a.driverVerificationStatus,
                  saccoProfile: a.saccoProfile,
                };
              (c(s), m(s.token));
              {
                let e = t ? window.localStorage : window.sessionStorage;
                (e.setItem(o, JSON.stringify(s)),
                  e.setItem(l, s.token),
                  window.localStorage.setItem("radaa_user_id", s._id),
                  t
                    ? (window.sessionStorage.removeItem(o),
                      window.sessionStorage.removeItem(l))
                    : (window.localStorage.removeItem(o),
                      window.localStorage.removeItem(l)));
                let a = "https:" === window.location.protocol,
                  r = [
                    "".concat(n, "=").concat(s.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (a && r.push("Secure"), (document.cookie = r.join("; ")));
              }
            } finally {
              h(!1);
            }
          },
          f = async (e) => {
            h(!0);
            try {
              let t = await (0, i.z2)(e),
                a = {
                  _id: t._id,
                  email: t.email,
                  token: t.token,
                  username: t.username,
                  handle: t.handle,
                  phone: t.phone,
                  createdAt: t.createdAt,
                  role: t.role,
                  enabled: t.enabled,
                  driverProfile: t.driverProfile,
                  driverVerificationStatus: t.driverVerificationStatus,
                  saccoProfile: t.saccoProfile,
                };
              (c(a), m(a.token));
              {
                (window.localStorage.setItem(o, JSON.stringify(a)),
                  window.localStorage.setItem(l, a.token),
                  window.localStorage.setItem("radaa_user_id", a._id));
                let e = "https:" === window.location.protocol,
                  t = [
                    "".concat(n, "=").concat(a.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (e && t.push("Secure"), (document.cookie = t.join("; ")));
              }
            } finally {
              h(!1);
            }
          };
        return (0, s.jsx)(d.Provider, {
          value: {
            user: a,
            token: u,
            loading: v,
            login: x,
            register: f,
            logout: () => {
              (c(null),
                m(null),
                window.localStorage.removeItem(o),
                window.localStorage.removeItem(l),
                window.sessionStorage.removeItem(o),
                window.sessionStorage.removeItem(l),
                window.localStorage.removeItem("radaa_user_id"),
                (document.cookie = "".concat(
                  n,
                  "=; Path=/; Max-Age=0; SameSite=Lax",
                )));
            },
          },
          children: t,
        });
      }
      function u() {
        let e = (0, r.useContext)(d);
        if (!e) throw Error("useAuth must be used within an AuthProvider");
        return e;
      }
    },
    542: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return o;
        },
        BZ: function () {
          return d;
        },
        Nj: function () {
          return l;
        },
        GX: function () {
          return c;
        },
        Yf: function () {
          return n;
        },
        eg: function () {
          return u;
        },
        m5: function () {
          return m;
        },
      });
      var s = a(8472);
      let r = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (r && (s.Z.defaults.baseURL = r),
        (s.Z.defaults.withCredentials = !0),
        s.Z.interceptors.request.use((e) => {
          try {
            let t =
              window.localStorage.getItem("token") ||
              window.sessionStorage.getItem("token");
            t &&
              ((e.headers = e.headers || {}),
              e.headers.Authorization ||
                (e.headers.Authorization = "Bearer ".concat(t)));
          } catch (e) {}
          return e;
        }));
      var i = s.Z,
        o = i;
      let l = async () => {
          try {
            return (await i.get("/matatu-system/live")).data;
          } catch (t) {
            var e;
            throw (
              console.error(
                "API ERROR:",
                (null == t
                  ? void 0
                  : null === (e = t.response) || void 0 === e
                    ? void 0
                    : e.data) || t,
              ),
              t
            );
          }
        },
        n = async () => {
          try {
            let e = (await i.get("/map/markers")).data;
            if (e && "object" == typeof e && "data" in e) return e.data;
            return e;
          } catch (t) {
            var e;
            throw (
              console.error(
                "API ERROR:",
                (null == t
                  ? void 0
                  : null === (e = t.response) || void 0 === e
                    ? void 0
                    : e.data) || t,
              ),
              t
            );
          }
        },
        d = async () => {
          try {
            let e = (await i.get("/feature-flags")).data;
            if (e && "object" == typeof e && "data" in e) return e.data;
            return e;
          } catch (t) {
            var e;
            throw (
              console.error(
                "API ERROR:",
                (null == t
                  ? void 0
                  : null === (e = t.response) || void 0 === e
                    ? void 0
                    : e.data) || t,
              ),
              t
            );
          }
        },
        c = async (e) => {
          try {
            return (await i.get("/users/".concat(e, "/loyalty"))).data;
          } catch (e) {
            var t;
            throw (
              console.error(
                "API ERROR:",
                (null == e
                  ? void 0
                  : null === (t = e.response) || void 0 === t
                    ? void 0
                    : t.data) || e,
              ),
              e
            );
          }
        },
        u = async (e) => {
          try {
            return (await i.post("/payments/initiate", e)).data;
          } catch (e) {
            var t;
            throw (
              console.error(
                "API ERROR:",
                (null == e
                  ? void 0
                  : null === (t = e.response) || void 0 === t
                    ? void 0
                    : t.data) || e,
              ),
              e
            );
          }
        },
        m = async (e) => {
          try {
            return (await i.post("/payments/verify", e)).data;
          } catch (e) {
            var t;
            throw (
              console.error(
                "API ERROR:",
                (null == e
                  ? void 0
                  : null === (t = e.response) || void 0 === t
                    ? void 0
                    : t.data) || e,
              ),
              e
            );
          }
        };
    },
    2315: function (e, t, a) {
      "use strict";
      a.d(t, {
        Ai: function () {
          return o;
        },
        x4: function () {
          return r;
        },
        z2: function () {
          return i;
        },
      });
      var s = a(542);
      async function r(e) {
        try {
          return (await s.ZP.post("/auth/login", e)).data;
        } catch (s) {
          var t, a;
          let e =
            null !==
              (a =
                null == s
                  ? void 0
                  : null === (t = s.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == s ? void 0 : s.message) ||
              "Login failed",
          );
        }
      }
      async function i(e) {
        try {
          return (await s.ZP.post("/auth/register", e)).data;
        } catch (s) {
          var t, a;
          let e =
            null !==
              (a =
                null == s
                  ? void 0
                  : null === (t = s.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == s ? void 0 : s.message) ||
              "Registration failed",
          );
        }
      }
      async function o(e) {
        try {
          return (
            await s.ZP.get("/auth/profile", {
              headers: { Authorization: "Bearer ".concat(e) },
            })
          ).data;
        } catch (s) {
          var t, a;
          let e =
            null !==
              (a =
                null == s
                  ? void 0
                  : null === (t = s.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == s ? void 0 : s.message) ||
              "Failed to load profile",
          );
        }
      }
    },
  },
  function (e) {
    (e.O(0, [472, 971, 23, 744], function () {
      return e((e.s = 4939));
    }),
      (_N_E = e.O()));
  },
]);
