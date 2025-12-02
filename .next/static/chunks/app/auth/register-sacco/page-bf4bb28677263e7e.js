(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [629],
  {
    7542: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 5548));
    },
    5548: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return d;
          },
        }));
      var r = a(7437),
        s = a(2265),
        o = a(7138),
        n = a(6463),
        l = a(3429),
        i = a(2858);
      function d() {
        let { register: e, loading: t } = (0, l.a)(),
          a = (0, n.useRouter)(),
          [d, c] = (0, s.useState)(""),
          [u, m] = (0, s.useState)(""),
          [f, h] = (0, s.useState)(""),
          [x, g] = (0, s.useState)(""),
          [p, v] = (0, s.useState)(""),
          [y, w] = (0, s.useState)(""),
          [b, S] = (0, s.useState)(null),
          [N, j] = (0, s.useState)(!1),
          k = (0, i.N3)("sacco_onboard_v1", !1),
          C = async (t) => {
            (t.preventDefault(), S(null), j(!0));
            try {
              (await e({
                username: d,
                email: u,
                password: x,
                phone: f || void 0,
                role: "admin",
                saccoName: p,
                registrationNumber: y || void 0,
              }),
                a.push("/dashboard/sacco"));
            } catch (e) {
              S(e instanceof Error ? e.message : "SACCO registration failed");
            } finally {
              j(!1);
            }
          },
          P = N || t;
        return (0, r.jsxs)("div", {
          className: "mx-auto max-w-md space-y-6",
          children: [
            (0, r.jsxs)("div", {
              className: "space-y-2",
              children: [
                (0, r.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "SACCO sign up",
                }),
                (0, r.jsx)("p", {
                  className: "text-sm text-slate-300",
                  children:
                    "Create a SACCO admin account to manage your fleet, drivers, and documents in Radaa.",
                }),
              ],
            }),
            k &&
              (0, r.jsxs)("section", {
                className:
                  "grid gap-2 text-[11px] text-slate-300 md:grid-cols-3",
                children: [
                  (0, r.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, r.jsx)("div", {
                        className: "text-slate-400",
                        children: "Step 1",
                      }),
                      (0, r.jsx)("div", {
                        className: "mt-0.5 font-semibold text-slate-50",
                        children: "SACCO profile",
                      }),
                    ],
                  }),
                  (0, r.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, r.jsx)("div", {
                        className: "text-slate-400",
                        children: "Step 2",
                      }),
                      (0, r.jsx)("div", {
                        className: "mt-0.5 font-semibold text-slate-50",
                        children: "Registration details",
                      }),
                    ],
                  }),
                  (0, r.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, r.jsx)("div", {
                        className: "text-slate-400",
                        children: "Step 3",
                      }),
                      (0, r.jsx)("div", {
                        className: "mt-0.5 font-semibold text-slate-50",
                        children: "Invite drivers",
                      }),
                    ],
                  }),
                ],
              }),
            b &&
              (0, r.jsx)("div", {
                className:
                  "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200",
                children: b,
              }),
            (0, r.jsxs)("form", {
              onSubmit: C,
              className: "space-y-4",
              children: [
                (0, r.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsx)("label", {
                      htmlFor: "username",
                      className: "text-sm font-medium text-slate-100",
                      children: "Admin name",
                    }),
                    (0, r.jsx)("input", {
                      id: "username",
                      type: "text",
                      required: !0,
                      value: d,
                      onChange: (e) => c(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "Jane Doe",
                    }),
                  ],
                }),
                (0, r.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsx)("label", {
                      htmlFor: "saccoName",
                      className: "text-sm font-medium text-slate-100",
                      children: "SACCO name",
                    }),
                    (0, r.jsx)("input", {
                      id: "saccoName",
                      type: "text",
                      required: !0,
                      value: p,
                      onChange: (e) => v(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "e.g. Radaa Express SACCO",
                    }),
                  ],
                }),
                (0, r.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsxs)("label", {
                      htmlFor: "registrationNumber",
                      className: "text-sm font-medium text-slate-100",
                      children: [
                        "Registration number ",
                        (0, r.jsx)("span", {
                          className: "text-xs font-normal text-slate-400",
                          children: "(optional)",
                        }),
                      ],
                    }),
                    (0, r.jsx)("input", {
                      id: "registrationNumber",
                      type: "text",
                      value: y,
                      onChange: (e) => w(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "Your official SACCO registration ID",
                    }),
                  ],
                }),
                (0, r.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsx)("label", {
                      htmlFor: "email",
                      className: "text-sm font-medium text-slate-100",
                      children: "Email",
                    }),
                    (0, r.jsx)("input", {
                      id: "email",
                      type: "email",
                      autoComplete: "email",
                      required: !0,
                      value: u,
                      onChange: (e) => m(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "you@example.com",
                    }),
                  ],
                }),
                (0, r.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsxs)("label", {
                      htmlFor: "phone",
                      className: "text-sm font-medium text-slate-100",
                      children: [
                        "Phone ",
                        (0, r.jsx)("span", {
                          className: "text-xs font-normal text-slate-400",
                          children: "(optional)",
                        }),
                      ],
                    }),
                    (0, r.jsx)("input", {
                      id: "phone",
                      type: "tel",
                      value: f,
                      onChange: (e) => h(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "07xx xxx xxx",
                    }),
                  ],
                }),
                (0, r.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsx)("label", {
                      htmlFor: "password",
                      className: "text-sm font-medium text-slate-100",
                      children: "Password",
                    }),
                    (0, r.jsx)("input", {
                      id: "password",
                      type: "password",
                      autoComplete: "new-password",
                      required: !0,
                      value: x,
                      onChange: (e) => g(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "At least 6 characters",
                    }),
                  ],
                }),
                (0, r.jsx)("button", {
                  type: "submit",
                  disabled: P,
                  className:
                    "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                  children: P
                    ? "Creating SACCO account..."
                    : "Create SACCO account",
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "text-center text-xs text-slate-400",
              children: [
                "Already have a SACCO account?",
                " ",
                (0, r.jsx)(o.default, {
                  href: "/auth/login-sacco",
                  className: "font-medium text-sky-400 hover:text-sky-300",
                  children: "Sign in",
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
      var r = a(7437),
        s = a(2265),
        o = a(2315);
      let n = "user",
        l = "token",
        i = "radaa_token",
        d = (0, s.createContext)(void 0);
      function c(e) {
        let { children: t } = e,
          [a, c] = (0, s.useState)(null),
          [u, m] = (0, s.useState)(null),
          [f, h] = (0, s.useState)(!0);
        (0, s.useEffect)(() => {
          try {
            let e = window.localStorage.getItem(n),
              t = window.sessionStorage.getItem(n),
              a = null,
              r = null;
            if (e) {
              let t = JSON.parse(e);
              t &&
                "string" == typeof t._id &&
                "string" == typeof t.token &&
                ((a = t), (r = t.token));
            }
            if (!a && t) {
              let e = JSON.parse(t);
              e &&
                "string" == typeof e._id &&
                "string" == typeof e.token &&
                ((a = e), (r = e.token));
            }
            if (!r) {
              let e =
                window.localStorage.getItem(l) ||
                window.sessionStorage.getItem(l);
              e && "string" == typeof e && (r = e);
            }
            (a && c(a), r && m(r));
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
              let a = await (0, o.x4)(e),
                r = {
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
              (c(r), m(r.token));
              {
                let e = t ? window.localStorage : window.sessionStorage;
                (e.setItem(n, JSON.stringify(r)),
                  e.setItem(l, r.token),
                  window.localStorage.setItem("radaa_user_id", r._id),
                  t
                    ? (window.sessionStorage.removeItem(n),
                      window.sessionStorage.removeItem(l))
                    : (window.localStorage.removeItem(n),
                      window.localStorage.removeItem(l)));
                let a = "https:" === window.location.protocol,
                  s = [
                    "".concat(i, "=").concat(r.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (a && s.push("Secure"), (document.cookie = s.join("; ")));
              }
            } finally {
              h(!1);
            }
          },
          g = async (e) => {
            h(!0);
            try {
              let t = await (0, o.z2)(e),
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
                (window.localStorage.setItem(n, JSON.stringify(a)),
                  window.localStorage.setItem(l, a.token),
                  window.localStorage.setItem("radaa_user_id", a._id));
                let e = "https:" === window.location.protocol,
                  t = [
                    "".concat(i, "=").concat(a.token),
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
        return (0, r.jsx)(d.Provider, {
          value: {
            user: a,
            token: u,
            loading: f,
            login: x,
            register: g,
            logout: () => {
              (c(null),
                m(null),
                window.localStorage.removeItem(n),
                window.localStorage.removeItem(l),
                window.sessionStorage.removeItem(n),
                window.sessionStorage.removeItem(l),
                window.localStorage.removeItem("radaa_user_id"),
                (document.cookie = "".concat(
                  i,
                  "=; Path=/; Max-Age=0; SameSite=Lax",
                )));
            },
          },
          children: t,
        });
      }
      function u() {
        let e = (0, s.useContext)(d);
        if (!e) throw Error("useAuth must be used within an AuthProvider");
        return e;
      }
    },
    2858: function (e, t, a) {
      "use strict";
      a.d(t, {
        FeatureFlagProvider: function () {
          return l;
        },
        N3: function () {
          return i;
        },
      });
      var r = a(7437),
        s = a(2265),
        o = a(542);
      let n = (0, s.createContext)(void 0);
      function l(e) {
        let { children: t } = e,
          [a, l] = (0, s.useState)(null),
          [i, d] = (0, s.useState)(!0),
          [c, u] = (0, s.useState)(null);
        (0, s.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (d(!0), u(null));
              try {
                let t = await (0, o.BZ)();
                if (e) return;
                t && "object" == typeof t ? l(t) : l({});
              } catch (t) {
                if (e) return;
                (l({}),
                  u(
                    t instanceof Error
                      ? t.message
                      : "Failed to load feature flags",
                  ));
              } finally {
                e || d(!1);
              }
            })(),
            () => {
              e = !0;
            }
          );
        }, []);
        let m = (0, s.useMemo)(
          () => ({ flags: a, loading: i, error: c }),
          [a, i, c],
        );
        return (0, r.jsx)(n.Provider, { value: m, children: t });
      }
      function i(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: a, loading: r } = (function () {
            let e = (0, s.useContext)(n);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (r || !a) return t;
        let o = a[e];
        return !!o && !!o.enabled;
      }
    },
    542: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return n;
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
          return i;
        },
        eg: function () {
          return u;
        },
        m5: function () {
          return m;
        },
      });
      var r = a(8472);
      let s = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (s && (r.Z.defaults.baseURL = s),
        (r.Z.defaults.withCredentials = !0),
        r.Z.interceptors.request.use((e) => {
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
      var o = r.Z,
        n = o;
      let l = async () => {
          try {
            return (await o.get("/matatu-system/live")).data;
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
        i = async () => {
          try {
            let e = (await o.get("/map/markers")).data;
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
            let e = (await o.get("/feature-flags")).data;
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
            return (await o.get("/users/".concat(e, "/loyalty"))).data;
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
            return (await o.post("/payments/initiate", e)).data;
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
            return (await o.post("/payments/verify", e)).data;
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
          return n;
        },
        x4: function () {
          return s;
        },
        z2: function () {
          return o;
        },
      });
      var r = a(542);
      async function s(e) {
        try {
          return (await r.ZP.post("/auth/login", e)).data;
        } catch (r) {
          var t, a;
          let e =
            null !==
              (a =
                null == r
                  ? void 0
                  : null === (t = r.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == r ? void 0 : r.message) ||
              "Login failed",
          );
        }
      }
      async function o(e) {
        try {
          return (await r.ZP.post("/auth/register", e)).data;
        } catch (r) {
          var t, a;
          let e =
            null !==
              (a =
                null == r
                  ? void 0
                  : null === (t = r.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == r ? void 0 : r.message) ||
              "Registration failed",
          );
        }
      }
      async function n(e) {
        try {
          return (
            await r.ZP.get("/auth/profile", {
              headers: { Authorization: "Bearer ".concat(e) },
            })
          ).data;
        } catch (r) {
          var t, a;
          let e =
            null !==
              (a =
                null == r
                  ? void 0
                  : null === (t = r.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == r ? void 0 : r.message) ||
              "Failed to load profile",
          );
        }
      }
    },
    6463: function (e, t, a) {
      "use strict";
      var r = a(1169);
      (a.o(r, "useParams") &&
        a.d(t, {
          useParams: function () {
            return r.useParams;
          },
        }),
        a.o(r, "usePathname") &&
          a.d(t, {
            usePathname: function () {
              return r.usePathname;
            },
          }),
        a.o(r, "useRouter") &&
          a.d(t, {
            useRouter: function () {
              return r.useRouter;
            },
          }));
    },
  },
  function (e) {
    (e.O(0, [472, 138, 971, 23, 744], function () {
      return e((e.s = 7542));
    }),
      (_N_E = e.O()));
  },
]);
