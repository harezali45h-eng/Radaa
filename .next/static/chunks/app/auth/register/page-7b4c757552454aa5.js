(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [454],
  {
    8264: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 4400));
    },
    4400: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return i;
          },
        }));
      var r = a(7437),
        o = a(2265),
        n = a(7138),
        s = a(6463),
        l = a(3429);
      function i() {
        let { register: e, loading: t } = (0, l.a)(),
          a = (0, s.useRouter)(),
          [i, d] = (0, o.useState)(""),
          [u, c] = (0, o.useState)(""),
          [m, h] = (0, o.useState)(""),
          [f, p] = (0, o.useState)(""),
          [x, g] = (0, o.useState)(""),
          [v, y] = (0, o.useState)(null),
          [w, b] = (0, o.useState)(!1),
          S = async (t) => {
            (t.preventDefault(), y(null), b(!0));
            try {
              (await e({
                username: i,
                email: m,
                password: x,
                phone: f || void 0,
                handle: u || void 0,
              }),
                a.push("/dashboard"));
            } catch (e) {
              y(e instanceof Error ? e.message : "Registration failed");
            } finally {
              b(!1);
            }
          },
          k = w || t;
        return (0, r.jsxs)("div", {
          className: "mx-auto max-w-md space-y-6",
          children: [
            (0, r.jsxs)("div", {
              className: "space-y-2",
              children: [
                (0, r.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Create your account",
                }),
                (0, r.jsx)("p", {
                  className: "text-sm text-slate-300",
                  children:
                    "Register to start managing matatus, trips, and payments in your Radaa dashboard.",
                }),
              ],
            }),
            v &&
              (0, r.jsx)("div", {
                className:
                  "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200",
                children: v,
              }),
            (0, r.jsxs)("form", {
              onSubmit: S,
              className: "space-y-4",
              children: [
                (0, r.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsx)("label", {
                      htmlFor: "username",
                      className: "text-sm font-medium text-slate-100",
                      children: "Username",
                    }),
                    (0, r.jsx)("input", {
                      id: "username",
                      type: "text",
                      required: !0,
                      value: i,
                      onChange: (e) => d(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "Jane Doe",
                    }),
                  ],
                }),
                (0, r.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsxs)("label", {
                      htmlFor: "handle",
                      className: "text-sm font-medium text-slate-100",
                      children: [
                        "Handle ",
                        (0, r.jsx)("span", {
                          className: "text-xs font-normal text-slate-400",
                          children: "(optional)",
                        }),
                      ],
                    }),
                    (0, r.jsx)("input", {
                      id: "handle",
                      type: "text",
                      value: u,
                      onChange: (e) => c(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "@radaa",
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
                      value: m,
                      onChange: (e) => h(e.target.value),
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
                      onChange: (e) => p(e.target.value),
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
                  disabled: k,
                  className:
                    "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                  children: k ? "Creating account..." : "Create account",
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "text-center text-xs text-slate-400",
              children: [
                "Already have an account?",
                " ",
                (0, r.jsx)(n.default, {
                  href: "/auth/login",
                  className: "font-medium text-sky-400 hover:text-sky-300",
                  children: "Sign in",
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "text-center text-xs text-slate-400",
              children: [
                "Want to drive with Radaa?",
                " ",
                (0, r.jsx)(n.default, {
                  href: "/auth/register-driver",
                  className:
                    "font-medium text-emerald-400 hover:text-emerald-300",
                  children: "Create a driver account",
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
          return u;
        },
        a: function () {
          return c;
        },
      });
      var r = a(7437),
        o = a(2265),
        n = a(2315);
      let s = "user",
        l = "token",
        i = "radaa_token",
        d = (0, o.createContext)(void 0);
      function u(e) {
        let { children: t } = e,
          [a, u] = (0, o.useState)(null),
          [c, m] = (0, o.useState)(null),
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
                window.localStorage.getItem(l) ||
                window.sessionStorage.getItem(l);
              e && "string" == typeof e && (r = e);
            }
            (a && u(a), r && m(r));
          } catch (e) {
          } finally {
            f(!1);
          }
        }, []);
        let p = async function (e) {
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
              (u(r), m(r.token));
              {
                let e = t ? window.localStorage : window.sessionStorage;
                (e.setItem(s, JSON.stringify(r)),
                  e.setItem(l, r.token),
                  window.localStorage.setItem("radaa_user_id", r._id),
                  t
                    ? (window.sessionStorage.removeItem(s),
                      window.sessionStorage.removeItem(l))
                    : (window.localStorage.removeItem(s),
                      window.localStorage.removeItem(l)));
                let a = "https:" === window.location.protocol,
                  o = [
                    "".concat(i, "=").concat(r.token),
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
          x = async (e) => {
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
              (u(a), m(a.token));
              {
                (window.localStorage.setItem(s, JSON.stringify(a)),
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
              f(!1);
            }
          };
        return (0, r.jsx)(d.Provider, {
          value: {
            user: a,
            token: c,
            loading: h,
            login: p,
            register: x,
            logout: () => {
              (u(null),
                m(null),
                window.localStorage.removeItem(s),
                window.localStorage.removeItem(l),
                window.sessionStorage.removeItem(s),
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
      function c() {
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
          return l;
        },
        GX: function () {
          return u;
        },
        Yf: function () {
          return i;
        },
        eg: function () {
          return c;
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
      let l = async () => {
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
        i = async () => {
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
        u = async (e) => {
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
        c = async (e) => {
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
      return e((e.s = 8264));
    }),
      (_N_E = e.O()));
  },
]);
