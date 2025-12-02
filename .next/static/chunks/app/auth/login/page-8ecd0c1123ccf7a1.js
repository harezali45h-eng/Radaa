(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [716],
  {
    4387: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 2727));
    },
    2727: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return l;
          },
        }));
      var r = a(7437),
        o = a(2265),
        n = a(7138),
        s = a(6463),
        i = a(3429);
      function l() {
        let { login: e, loading: t } = (0, i.a)(),
          a = (0, s.useRouter)(),
          [l, d] = (0, o.useState)(""),
          [c, u] = (0, o.useState)(""),
          [m, h] = (0, o.useState)(!1),
          [f, g] = (0, o.useState)(!1),
          [v, x] = (0, o.useState)(null),
          [p, w] = (0, o.useState)(!1);
        (0, o.useEffect)(() => {
          let e = window.localStorage.getItem("radaa_login_email");
          e && (d(e), h(!0));
        }, []);
        let y = async (t) => {
            (t.preventDefault(), x(null), w(!0));
            try {
              (await e({ email: l, password: c }, m),
                m
                  ? window.localStorage.setItem("radaa_login_email", l)
                  : window.localStorage.removeItem("radaa_login_email"),
                a.push("/dashboard"));
            } catch (e) {
              x(e instanceof Error ? e.message : "Login failed");
            } finally {
              w(!1);
            }
          },
          S = p || t;
        return (0, r.jsxs)("div", {
          className: "mx-auto max-w-md space-y-6",
          children: [
            (0, r.jsxs)("div", {
              className: "space-y-2",
              children: [
                (0, r.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Sign in",
                }),
                (0, r.jsx)("p", {
                  className: "text-sm text-slate-300",
                  children:
                    "Access your Radaa dashboard to manage matatus, trips, and payments.",
                }),
              ],
            }),
            (0, r.jsxs)("form", {
              onSubmit: y,
              className: "space-y-4",
              children: [
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
                      value: l,
                      onChange: (e) => d(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "you@example.com",
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
                    (0, r.jsxs)("div", {
                      className: "relative",
                      children: [
                        (0, r.jsx)("input", {
                          id: "password",
                          type: f ? "text" : "password",
                          autoComplete: "current-password",
                          required: !0,
                          value: c,
                          onChange: (e) => u(e.target.value),
                          className:
                            "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "••••••••",
                          "aria-invalid": !!v,
                          "aria-describedby": v ? "password-error" : void 0,
                        }),
                        (0, r.jsx)("button", {
                          type: "button",
                          onClick: () => g((e) => !e),
                          className:
                            "absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-400 hover:text-slate-200 focus:outline-none",
                          "aria-label": f ? "Hide password" : "Show password",
                          children: f ? "Hide" : "Show",
                        }),
                      ],
                    }),
                    v &&
                      (0, r.jsx)("p", {
                        id: "password-error",
                        className: "text-xs text-red-400",
                        role: "alert",
                        children: v,
                      }),
                  ],
                }),
                (0, r.jsx)("div", {
                  className: "flex items-center justify-between",
                  children: (0, r.jsxs)("label", {
                    htmlFor: "rememberMe",
                    className:
                      "flex items-center space-x-2 text-xs text-slate-300",
                    children: [
                      (0, r.jsx)("input", {
                        id: "rememberMe",
                        type: "checkbox",
                        checked: m,
                        onChange: (e) => h(e.target.checked),
                        className:
                          "h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500",
                      }),
                      (0, r.jsx)("span", {
                        children: "Remember me on this device",
                      }),
                    ],
                  }),
                }),
                (0, r.jsxs)("button", {
                  type: "submit",
                  disabled: S,
                  className:
                    "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                  "aria-busy": S,
                  children: [
                    S &&
                      (0, r.jsxs)("svg", {
                        className: "mr-2 h-4 w-4 animate-spin text-sky-100",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        children: [
                          (0, r.jsx)("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4",
                            fill: "none",
                          }),
                          (0, r.jsx)("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z",
                          }),
                        ],
                      }),
                    (0, r.jsx)("span", {
                      children: S ? "Signing in..." : "Sign in",
                    }),
                  ],
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "text-center text-xs text-slate-400",
              children: [
                "Don't have an account?",
                " ",
                (0, r.jsx)(n.default, {
                  href: "/auth/register",
                  className: "font-medium text-sky-400 hover:text-sky-300",
                  children: "Create one",
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "text-center text-xs text-slate-400",
              children: [
                "Are you a SACCO admin?",
                " ",
                (0, r.jsx)(n.default, {
                  href: "/auth/login-sacco",
                  className: "font-medium text-sky-400 hover:text-sky-300",
                  children: "Sign in to SACCO dashboard",
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "text-center text-xs text-slate-400",
              children: [
                "Are you a driver?",
                " ",
                (0, r.jsx)(n.default, {
                  href: "/auth/login-driver",
                  className:
                    "font-medium text-emerald-400 hover:text-emerald-300",
                  children: "Sign in to driver dashboard",
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
        o = a(2265),
        n = a(2315);
      let s = "user",
        i = "token",
        l = "radaa_token",
        d = (0, o.createContext)(void 0);
      function c(e) {
        let { children: t } = e,
          [a, c] = (0, o.useState)(null),
          [u, m] = (0, o.useState)(null),
          [h, f] = (0, o.useState)(!0);
        (0, o.useEffect)(() => {
          try {
            let e = window.localStorage.getItem(s),
              t = window.sessionStorage.getItem(s),
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
                window.localStorage.getItem(i) ||
                window.sessionStorage.getItem(i);
              e && "string" == typeof e && (r = e);
            }
            (a && c(a), r && m(r));
          } catch (e) {
          } finally {
            f(!1);
          }
        }, []);
        let g = async function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            f(!0);
            try {
              let a = await (0, n.x4)(e),
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
                (e.setItem(s, JSON.stringify(r)),
                  e.setItem(i, r.token),
                  window.localStorage.setItem("radaa_user_id", r._id),
                  t
                    ? (window.sessionStorage.removeItem(s),
                      window.sessionStorage.removeItem(i))
                    : (window.localStorage.removeItem(s),
                      window.localStorage.removeItem(i)));
                let a = "https:" === window.location.protocol,
                  o = [
                    "".concat(l, "=").concat(r.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (a && o.push("Secure"), (document.cookie = o.join("; ")));
              }
            } finally {
              f(!1);
            }
          },
          v = async (e) => {
            f(!0);
            try {
              let t = await (0, n.z2)(e),
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
                (window.localStorage.setItem(s, JSON.stringify(a)),
                  window.localStorage.setItem(i, a.token),
                  window.localStorage.setItem("radaa_user_id", a._id));
                let e = "https:" === window.location.protocol,
                  t = [
                    "".concat(l, "=").concat(a.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (e && t.push("Secure"), (document.cookie = t.join("; ")));
              }
            } finally {
              f(!1);
            }
          };
        return (0, r.jsx)(d.Provider, {
          value: {
            user: a,
            token: u,
            loading: h,
            login: g,
            register: v,
            logout: () => {
              (c(null),
                m(null),
                window.localStorage.removeItem(s),
                window.localStorage.removeItem(i),
                window.sessionStorage.removeItem(s),
                window.sessionStorage.removeItem(i),
                window.localStorage.removeItem("radaa_user_id"),
                (document.cookie = "".concat(
                  l,
                  "=; Path=/; Max-Age=0; SameSite=Lax",
                )));
            },
          },
          children: t,
        });
      }
      function u() {
        let e = (0, o.useContext)(d);
        if (!e) throw Error("useAuth must be used within an AuthProvider");
        return e;
      }
    },
    542: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return s;
        },
        BZ: function () {
          return d;
        },
        Nj: function () {
          return i;
        },
        GX: function () {
          return c;
        },
        Yf: function () {
          return l;
        },
        eg: function () {
          return u;
        },
        m5: function () {
          return m;
        },
      });
      var r = a(8472);
      let o = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (o && (r.Z.defaults.baseURL = o),
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
      var n = r.Z,
        s = n;
      let i = async () => {
          try {
            return (await n.get("/matatu-system/live")).data;
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
        l = async () => {
          try {
            let e = (await n.get("/map/markers")).data;
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
            let e = (await n.get("/feature-flags")).data;
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
            return (await n.get("/users/".concat(e, "/loyalty"))).data;
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
            return (await n.post("/payments/initiate", e)).data;
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
            return (await n.post("/payments/verify", e)).data;
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
          return s;
        },
        x4: function () {
          return o;
        },
        z2: function () {
          return n;
        },
      });
      var r = a(542);
      async function o(e) {
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
      async function n(e) {
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
      async function s(e) {
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
      return e((e.s = 4387));
    }),
      (_N_E = e.O()));
  },
]);
