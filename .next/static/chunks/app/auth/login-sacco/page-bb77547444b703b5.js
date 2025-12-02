(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [102],
  {
    5449: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 3583));
    },
    3583: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return d;
          },
        }));
      var r = a(7437),
        o = a(2265),
        n = a(7138),
        s = a(6463),
        i = a(3429),
        l = a(2858);
      function d() {
        let { login: e, loading: t } = (0, i.a)(),
          a = (0, s.useRouter)(),
          [d, u] = (0, o.useState)(""),
          [c, m] = (0, o.useState)(""),
          [f, h] = (0, o.useState)(null),
          [g, v] = (0, o.useState)(!1),
          p = (0, l.N3)("sacco_onboard_v1", !1),
          w = async (t) => {
            (t.preventDefault(), h(null), v(!0));
            try {
              (await e({ email: d, password: c }), a.push("/dashboard/sacco"));
            } catch (e) {
              h(e instanceof Error ? e.message : "Login failed");
            } finally {
              v(!1);
            }
          },
          y = g || t;
        return (0, r.jsxs)("div", {
          className: "mx-auto max-w-md space-y-6",
          children: [
            (0, r.jsxs)("div", {
              className: "space-y-2",
              children: [
                (0, r.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "SACCO sign in",
                }),
                (0, r.jsx)("p", {
                  className: "text-sm text-slate-300",
                  children:
                    "Sign in as a SACCO admin to manage your fleet and drivers in Radaa.",
                }),
              ],
            }),
            p &&
              (0, r.jsxs)("div", {
                className:
                  "rounded-lg border border-sky-600/60 bg-sky-600/10 px-3 py-2 text-xs text-sky-100",
                children: [
                  (0, r.jsx)("p", {
                    className: "font-medium",
                    children: "New SACCO dashboard (beta)",
                  }),
                  (0, r.jsx)("p", {
                    className: "mt-0.5 text-[11px] text-sky-100/90",
                    children:
                      "Use this admin sign-in to explore the experimental SACCO fleet dashboard. This experience is safely feature-flagged while we iterate.",
                  }),
                ],
              }),
            f &&
              (0, r.jsx)("div", {
                className:
                  "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200",
                children: f,
              }),
            (0, r.jsxs)("form", {
              onSubmit: w,
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
                      value: d,
                      onChange: (e) => u(e.target.value),
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
                    (0, r.jsx)("input", {
                      id: "password",
                      type: "password",
                      autoComplete: "current-password",
                      required: !0,
                      value: c,
                      onChange: (e) => m(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "••••••••",
                    }),
                  ],
                }),
                (0, r.jsx)("button", {
                  type: "submit",
                  disabled: y,
                  className:
                    "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                  children: y ? "Signing in..." : "Sign in as SACCO",
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "text-center text-xs text-slate-400",
              children: [
                "Need a SACCO account?",
                " ",
                (0, r.jsx)(n.default, {
                  href: "/auth/register-sacco",
                  className: "font-medium text-sky-400 hover:text-sky-300",
                  children: "Create one",
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "text-center text-xs text-slate-500",
              children: [
                "Not a SACCO admin?",
                " ",
                (0, r.jsx)(n.default, {
                  href: "/auth/login",
                  className: "font-medium text-sky-400 hover:text-sky-300",
                  children: "Go to main login",
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
        i = "token",
        l = "radaa_token",
        d = (0, o.createContext)(void 0);
      function u(e) {
        let { children: t } = e,
          [a, u] = (0, o.useState)(null),
          [c, m] = (0, o.useState)(null),
          [f, h] = (0, o.useState)(!0);
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
            (a && u(a), r && m(r));
          } catch (e) {
          } finally {
            h(!1);
          }
        }, []);
        let g = async function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            h(!0);
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
              h(!1);
            }
          },
          v = async (e) => {
            h(!0);
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
              h(!1);
            }
          };
        return (0, r.jsx)(d.Provider, {
          value: {
            user: a,
            token: c,
            loading: f,
            login: g,
            register: v,
            logout: () => {
              (u(null),
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
      function c() {
        let e = (0, o.useContext)(d);
        if (!e) throw Error("useAuth must be used within an AuthProvider");
        return e;
      }
    },
    2858: function (e, t, a) {
      "use strict";
      a.d(t, {
        FeatureFlagProvider: function () {
          return i;
        },
        N3: function () {
          return l;
        },
      });
      var r = a(7437),
        o = a(2265),
        n = a(542);
      let s = (0, o.createContext)(void 0);
      function i(e) {
        let { children: t } = e,
          [a, i] = (0, o.useState)(null),
          [l, d] = (0, o.useState)(!0),
          [u, c] = (0, o.useState)(null);
        (0, o.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (d(!0), c(null));
              try {
                let t = await (0, n.BZ)();
                if (e) return;
                t && "object" == typeof t ? i(t) : i({});
              } catch (t) {
                if (e) return;
                (i({}),
                  c(
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
        let m = (0, o.useMemo)(
          () => ({ flags: a, loading: l, error: u }),
          [a, l, u],
        );
        return (0, r.jsx)(s.Provider, { value: m, children: t });
      }
      function l(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: a, loading: r } = (function () {
            let e = (0, o.useContext)(s);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (r || !a) return t;
        let n = a[e];
        return !!n && !!n.enabled;
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
          return u;
        },
        Yf: function () {
          return l;
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
      return e((e.s = 5449));
    }),
      (_N_E = e.O()));
  },
]);
