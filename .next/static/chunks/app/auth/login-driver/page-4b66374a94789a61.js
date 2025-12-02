(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [274],
  {
    2878: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 2019));
    },
    2019: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return d;
          },
        }));
      var a = r(7437),
        o = r(2265),
        n = r(7138),
        s = r(6463),
        i = r(3429),
        l = r(2858);
      function d() {
        let { login: e, loading: t } = (0, i.a)(),
          r = (0, s.useRouter)(),
          [d, u] = (0, o.useState)(""),
          [c, m] = (0, o.useState)(""),
          [f, h] = (0, o.useState)(null),
          [v, g] = (0, o.useState)(!1),
          w = (0, l.N3)("driver_onboard_v1", !1),
          p = async (t) => {
            (t.preventDefault(), h(null), g(!0));
            try {
              (await e({ email: d, password: c }),
                r.push("/dashboard/driver/live"));
            } catch (e) {
              h(e instanceof Error ? e.message : "Login failed");
            } finally {
              g(!1);
            }
          },
          x = v || t;
        return (0, a.jsxs)("div", {
          className: "mx-auto max-w-md space-y-6",
          children: [
            (0, a.jsxs)("div", {
              className: "space-y-2",
              children: [
                (0, a.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Driver sign in",
                }),
                (0, a.jsx)("p", {
                  className: "text-sm text-slate-300",
                  children:
                    "Sign in to access the live driver dashboard and manage ride requests.",
                }),
              ],
            }),
            w &&
              (0, a.jsxs)("div", {
                className:
                  "rounded-lg border border-emerald-600/50 bg-emerald-600/10 px-3 py-2 text-xs text-emerald-100",
                children: [
                  (0, a.jsx)("p", {
                    className: "font-medium",
                    children: "New driver flow (beta)",
                  }),
                  (0, a.jsx)("p", {
                    className: "mt-0.5 text-[11px] text-emerald-100/90",
                    children:
                      "Use the driver sign in and live dashboard to test how rides feel from behind the wheel. This flow is feature-flagged and safe to tweak.",
                  }),
                ],
              }),
            f &&
              (0, a.jsx)("div", {
                className:
                  "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200",
                children: f,
              }),
            (0, a.jsxs)("form", {
              onSubmit: p,
              className: "space-y-4",
              children: [
                (0, a.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, a.jsx)("label", {
                      htmlFor: "email",
                      className: "text-sm font-medium text-slate-100",
                      children: "Email",
                    }),
                    (0, a.jsx)("input", {
                      id: "email",
                      type: "email",
                      autoComplete: "email",
                      required: !0,
                      value: d,
                      onChange: (e) => u(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500",
                      placeholder: "you@example.com",
                    }),
                  ],
                }),
                (0, a.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, a.jsx)("label", {
                      htmlFor: "password",
                      className: "text-sm font-medium text-slate-100",
                      children: "Password",
                    }),
                    (0, a.jsx)("input", {
                      id: "password",
                      type: "password",
                      autoComplete: "current-password",
                      required: !0,
                      value: c,
                      onChange: (e) => m(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500",
                      placeholder: "••••••••",
                    }),
                  ],
                }),
                (0, a.jsx)("button", {
                  type: "submit",
                  disabled: x,
                  className:
                    "inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                  children: x ? "Signing in..." : "Sign in as driver",
                }),
              ],
            }),
            (0, a.jsxs)("p", {
              className: "text-center text-xs text-slate-400",
              children: [
                "Need a driver account?",
                " ",
                (0, a.jsx)(n.default, {
                  href: "/auth/register-driver",
                  className:
                    "font-medium text-emerald-400 hover:text-emerald-300",
                  children: "Create one",
                }),
              ],
            }),
            (0, a.jsxs)("p", {
              className: "text-center text-xs text-slate-500",
              children: [
                "Not a driver?",
                " ",
                (0, a.jsx)(n.default, {
                  href: "/auth/login",
                  className: "font-medium text-sky-400 hover:text-sky-300",
                  children: "Go to passenger/admin login",
                }),
              ],
            }),
          ],
        });
      }
    },
    3429: function (e, t, r) {
      "use strict";
      r.d(t, {
        AuthProvider: function () {
          return u;
        },
        a: function () {
          return c;
        },
      });
      var a = r(7437),
        o = r(2265),
        n = r(2315);
      let s = "user",
        i = "token",
        l = "radaa_token",
        d = (0, o.createContext)(void 0);
      function u(e) {
        let { children: t } = e,
          [r, u] = (0, o.useState)(null),
          [c, m] = (0, o.useState)(null),
          [f, h] = (0, o.useState)(!0);
        (0, o.useEffect)(() => {
          try {
            let e = window.localStorage.getItem(s),
              t = window.sessionStorage.getItem(s),
              r = null,
              a = null;
            if (e) {
              let t = JSON.parse(e);
              t &&
                "string" == typeof t._id &&
                "string" == typeof t.token &&
                ((r = t), (a = t.token));
            }
            if (!r && t) {
              let e = JSON.parse(t);
              e &&
                "string" == typeof e._id &&
                "string" == typeof e.token &&
                ((r = e), (a = e.token));
            }
            if (!a) {
              let e =
                window.localStorage.getItem(i) ||
                window.sessionStorage.getItem(i);
              e && "string" == typeof e && (a = e);
            }
            (r && u(r), a && m(a));
          } catch (e) {
          } finally {
            h(!1);
          }
        }, []);
        let v = async function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            h(!0);
            try {
              let r = await (0, n.x4)(e),
                a = {
                  _id: r._id,
                  email: r.email,
                  token: r.token,
                  username: r.username,
                  handle: r.handle,
                  phone: r.phone,
                  createdAt: r.createdAt,
                  role: r.role,
                  enabled: r.enabled,
                  driverProfile: r.driverProfile,
                  driverVerificationStatus: r.driverVerificationStatus,
                  saccoProfile: r.saccoProfile,
                };
              (u(a), m(a.token));
              {
                let e = t ? window.localStorage : window.sessionStorage;
                (e.setItem(s, JSON.stringify(a)),
                  e.setItem(i, a.token),
                  window.localStorage.setItem("radaa_user_id", a._id),
                  t
                    ? (window.sessionStorage.removeItem(s),
                      window.sessionStorage.removeItem(i))
                    : (window.localStorage.removeItem(s),
                      window.localStorage.removeItem(i)));
                let r = "https:" === window.location.protocol,
                  o = [
                    "".concat(l, "=").concat(a.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (r && o.push("Secure"), (document.cookie = o.join("; ")));
              }
            } finally {
              h(!1);
            }
          },
          g = async (e) => {
            h(!0);
            try {
              let t = await (0, n.z2)(e),
                r = {
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
              (u(r), m(r.token));
              {
                (window.localStorage.setItem(s, JSON.stringify(r)),
                  window.localStorage.setItem(i, r.token),
                  window.localStorage.setItem("radaa_user_id", r._id));
                let e = "https:" === window.location.protocol,
                  t = [
                    "".concat(l, "=").concat(r.token),
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
        return (0, a.jsx)(d.Provider, {
          value: {
            user: r,
            token: c,
            loading: f,
            login: v,
            register: g,
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
    2858: function (e, t, r) {
      "use strict";
      r.d(t, {
        FeatureFlagProvider: function () {
          return i;
        },
        N3: function () {
          return l;
        },
      });
      var a = r(7437),
        o = r(2265),
        n = r(542);
      let s = (0, o.createContext)(void 0);
      function i(e) {
        let { children: t } = e,
          [r, i] = (0, o.useState)(null),
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
          () => ({ flags: r, loading: l, error: u }),
          [r, l, u],
        );
        return (0, a.jsx)(s.Provider, { value: m, children: t });
      }
      function l(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: r, loading: a } = (function () {
            let e = (0, o.useContext)(s);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (a || !r) return t;
        let n = r[e];
        return !!n && !!n.enabled;
      }
    },
    542: function (e, t, r) {
      "use strict";
      r.d(t, {
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
      var a = r(8472);
      let o = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (o && (a.Z.defaults.baseURL = o),
        (a.Z.defaults.withCredentials = !0),
        a.Z.interceptors.request.use((e) => {
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
      var n = a.Z,
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
    2315: function (e, t, r) {
      "use strict";
      r.d(t, {
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
      var a = r(542);
      async function o(e) {
        try {
          return (await a.ZP.post("/auth/login", e)).data;
        } catch (a) {
          var t, r;
          let e =
            null !==
              (r =
                null == a
                  ? void 0
                  : null === (t = a.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== r
              ? r
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == a ? void 0 : a.message) ||
              "Login failed",
          );
        }
      }
      async function n(e) {
        try {
          return (await a.ZP.post("/auth/register", e)).data;
        } catch (a) {
          var t, r;
          let e =
            null !==
              (r =
                null == a
                  ? void 0
                  : null === (t = a.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== r
              ? r
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == a ? void 0 : a.message) ||
              "Registration failed",
          );
        }
      }
      async function s(e) {
        try {
          return (
            await a.ZP.get("/auth/profile", {
              headers: { Authorization: "Bearer ".concat(e) },
            })
          ).data;
        } catch (a) {
          var t, r;
          let e =
            null !==
              (r =
                null == a
                  ? void 0
                  : null === (t = a.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== r
              ? r
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == a ? void 0 : a.message) ||
              "Failed to load profile",
          );
        }
      }
    },
    6463: function (e, t, r) {
      "use strict";
      var a = r(1169);
      (r.o(a, "useParams") &&
        r.d(t, {
          useParams: function () {
            return a.useParams;
          },
        }),
        r.o(a, "usePathname") &&
          r.d(t, {
            usePathname: function () {
              return a.usePathname;
            },
          }),
        r.o(a, "useRouter") &&
          r.d(t, {
            useRouter: function () {
              return a.useRouter;
            },
          }));
    },
  },
  function (e) {
    (e.O(0, [472, 138, 971, 23, 744], function () {
      return e((e.s = 2878));
    }),
      (_N_E = e.O()));
  },
]);
