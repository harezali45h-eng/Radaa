((exports.id = 462),
  (exports.ids = [462]),
  (exports.modules = {
    8359: () => {},
    3739: () => {},
    3252: (e, t, r) => {
      Promise.resolve().then(r.bind(r, 7733));
    },
    230: (e, t, r) => {
      (Promise.resolve().then(r.bind(r, 732)),
        Promise.resolve().then(r.bind(r, 4545)),
        Promise.resolve().then(r.bind(r, 7772)),
        Promise.resolve().then(r.bind(r, 457)),
        Promise.resolve().then(r.bind(r, 676)));
    },
    4214: (e, t, r) => {
      (Promise.resolve().then(r.t.bind(r, 2994, 23)),
        Promise.resolve().then(r.t.bind(r, 6114, 23)),
        Promise.resolve().then(r.t.bind(r, 9727, 23)),
        Promise.resolve().then(r.t.bind(r, 9671, 23)),
        Promise.resolve().then(r.t.bind(r, 1868, 23)),
        Promise.resolve().then(r.t.bind(r, 4759, 23)));
    },
    5303: () => {},
    7733: (e, t, r) => {
      "use strict";
      (r.r(t), r.d(t, { default: () => s }));
      var a = r(326);
      function s({ error: e, reset: t }) {
        return a.jsx("html", {
          lang: "en",
          children: a.jsx("body", {
            className: "min-h-screen bg-slate-950 text-slate-50",
            children: a.jsx("div", {
              className: "flex min-h-screen items-center justify-center px-4",
              children: (0, a.jsxs)("div", {
                className:
                  "max-w-md space-y-4 rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-xs",
                children: [
                  a.jsx("h1", {
                    className: "text-lg font-semibold text-red-100",
                    children: "Something went wrong",
                  }),
                  a.jsx("p", {
                    className: "text-slate-200",
                    children:
                      "An unexpected error occurred while rendering this page. You can try again, or go back to the dashboard.",
                  }),
                  (0, a.jsxs)("div", {
                    className: "flex gap-3 text-[11px]",
                    children: [
                      a.jsx("button", {
                        type: "button",
                        onClick: t,
                        className:
                          "inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-500",
                        children: "Try again",
                      }),
                      a.jsx("a", {
                        href: "/dashboard",
                        className:
                          "inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-100 hover:border-slate-500",
                        children: "Go to dashboard",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
        });
      }
      r(7577);
    },
    732: (e, t, r) => {
      "use strict";
      r.d(t, { AuthProvider: () => d, a: () => i });
      var a = r(326),
        s = r(7577),
        o = r(8699);
      let n = (0, s.createContext)(void 0);
      function d({ children: e }) {
        let [t, r] = (0, s.useState)(null),
          [d, i] = (0, s.useState)(null),
          [l, u] = (0, s.useState)(!0),
          c = async (e, t = !1) => {
            u(!0);
            try {
              let t = await (0, o.x4)(e),
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
              (r(a), i(a.token));
            } finally {
              u(!1);
            }
          },
          x = async (e) => {
            u(!0);
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
              (r(a), i(a.token));
            } finally {
              u(!1);
            }
          };
        return a.jsx(n.Provider, {
          value: {
            user: t,
            token: d,
            loading: l,
            login: c,
            register: x,
            logout: () => {
              (r(null), i(null));
            },
          },
          children: e,
        });
      }
      function i() {
        let e = (0, s.useContext)(n);
        if (!e) throw Error("useAuth must be used within an AuthProvider");
        return e;
      }
    },
    4545: (e, t, r) => {
      "use strict";
      r.d(t, { FeatureFlagProvider: () => n, N3: () => d });
      var a = r(326),
        s = r(7577);
      r(6334);
      let o = (0, s.createContext)(void 0);
      function n({ children: e }) {
        let [t, r] = (0, s.useState)(null),
          [n, d] = (0, s.useState)(!0),
          [i, l] = (0, s.useState)(null),
          u = (0, s.useMemo)(
            () => ({ flags: t, loading: n, error: i }),
            [t, n, i],
          );
        return a.jsx(o.Provider, { value: u, children: e });
      }
      function d(e, t = !1) {
        let { flags: r, loading: a } = (function () {
          let e = (0, s.useContext)(o);
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
    7772: (e, t, r) => {
      "use strict";
      r.d(t, { NotificationProvider: () => n, z: () => d });
      var a = r(326),
        s = r(7577);
      r(57);
      let o = (0, s.createContext)(void 0);
      function n({ children: e }) {
        let [t, r] = (0, s.useState)([]),
          n = (0, s.useCallback)((e) => {
            r((t) => [
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                type: e.type,
                title: e.title,
                message: e.message,
                createdAt: new Date().toISOString(),
                read: !1,
              },
              ...t,
            ]);
          }, []),
          d = (0, s.useCallback)(() => {
            r((e) => e.map((e) => ({ ...e, read: !0 })));
          }, []),
          i = (0, s.useCallback)((e) => {
            r((t) => t.map((t) => (t.id === e ? { ...t, read: !0 } : t)));
          }, []),
          l = (0, s.useMemo)(() => t.filter((e) => !e.read).length, [t]),
          u = (0, s.useMemo)(
            () => ({
              notifications: t,
              unreadCount: l,
              addNotification: n,
              markAllAsRead: d,
              markAsRead: i,
            }),
            [t, l, n, d, i],
          );
        return a.jsx(o.Provider, { value: u, children: e });
      }
      function d() {
        let e = (0, s.useContext)(o);
        if (!e)
          throw Error(
            "useNotifications must be used within a NotificationProvider",
          );
        return e;
      }
    },
    676: (e, t, r) => {
      "use strict";
      r.d(t, { F: () => l, ThemeProvider: () => i });
      var a = r(326),
        s = r(7577),
        o = r(732),
        n = r(457);
      let d = (0, s.createContext)(void 0);
      function i({ children: e }) {
        let { user: t } = (0, o.a)(),
          { activeMode: r } = (0, n.r)(),
          i = t?.role,
          l = (0, s.useMemo)(
            () =>
              "admin" === i
                ? "sacco"
                : "driver" === i && "driver" === r
                  ? "driver"
                  : i
                    ? "passenger"
                    : "generic",
            [i, r],
          ),
          u = (0, s.useMemo)(() => {
            let e = "passenger" === l || "generic" === l,
              t = "driver" === l,
              r = "sacco" === l;
            return {
              variant: l,
              isPassenger: e,
              isDriver: t,
              isSacco: r,
              headerBgClass: t
                ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-mint/20 via-radaa-teal/15 to-radaa-gold/10 backdrop-blur"
                : r
                  ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-gold/20 via-radaa-orange/15 to-radaa-mint/10 backdrop-blur"
                  : "border-b border-slate-800/70 bg-gradient-to-r from-radaa-blue/25 via-radaa-purple/20 to-radaa-mint/10 backdrop-blur",
              primaryButtonClass: t
                ? "radaa-btn-primary bg-gradient-to-r from-radaa-mint to-radaa-teal shadow-glow-mint"
                : r
                  ? "radaa-btn-primary bg-gradient-to-r from-radaa-gold to-radaa-orange shadow-glow-blue"
                  : "radaa-btn-primary bg-gradient-to-r from-radaa-blue to-radaa-purple shadow-glow-blue",
              subtleButtonClass: "radaa-btn-secondary",
              cardSurfaceClass: t
                ? "radaa-card border-radaa-mint/40"
                : r
                  ? "radaa-card border-radaa-gold/40"
                  : "radaa-card",
            };
          }, [l]);
        return a.jsx(d.Provider, { value: u, children: e });
      }
      function l() {
        let e = (0, s.useContext)(d);
        if (!e) throw Error("useTheme must be used within a ThemeProvider");
        return e;
      }
    },
    457: (e, t, r) => {
      "use strict";
      r.d(t, { RealtimeProvider: () => u, r: () => c });
      var a = r(326),
        s = r(7577),
        o = r(1264),
        n = r(7772),
        d = r(732);
      function i() {
        return "passenger";
      }
      let l = (0, s.createContext)(void 0);
      function u({ children: e }) {
        let { connect: t, on: r, off: u, emit: c } = (0, o.s)(),
          { addNotification: x } = (0, n.z)(),
          { user: m, token: f } = (0, d.a)(),
          [h, g] = (0, s.useState)([]),
          [p, b] = (0, s.useState)(null),
          [v, y] = (0, s.useState)(() => i()),
          [w, P] = (0, s.useState)(() => "driver" === i()),
          C = (0, s.useCallback)(
            (e) => {
              P(e);
              let t = e ? "driver" : "passenger";
              (y(t),
                c(e ? "driver:online" : "driver:offline", { online: e }),
                console.log("[realtime] setDriverOnline", {
                  online: e,
                  mode: t,
                }));
            },
            [c],
          ),
          k = (0, s.useMemo)(
            () => ({
              matatus: h,
              lastRideAssigned: p,
              driverOnline: w,
              setDriverOnline: C,
              activeMode: v,
            }),
            [h, p, w, C, v],
          );
        return a.jsx(l.Provider, { value: k, children: e });
      }
      function c() {
        let e = (0, s.useContext)(l);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
      }
    },
    1264: (e, t, r) => {
      "use strict";
      r.d(t, { s: () => s });
      var a = r(7577);
      function s() {
        let [e, t] = (0, a.useState)(!1),
          r = (0, a.useCallback)((e) => {}, []),
          s = (0, a.useCallback)(() => {}, []);
        return {
          connect: r,
          disconnect: s,
          emit: (0, a.useCallback)((e, t, r) => {}, []),
          on: (0, a.useCallback)((e, t) => {}, []),
          off: (0, a.useCallback)((e, t) => {}, []),
          connected: e,
        };
      }
      (r(57), "wss://radaa-1.onrender.com".replace(/\/+$/, ""));
    },
    6334: (e, t, r) => {
      "use strict";
      r.d(t, { ZP: () => n, eg: () => d, m5: () => i });
      var a = r(4464);
      let s = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (s && (a.Z.defaults.baseURL = s),
        (a.Z.defaults.withCredentials = !0),
        a.Z.interceptors.request.use((e) => e));
      let o = a.Z,
        n = o,
        d = async (e) => {
          try {
            return (await o.post("/payments/initiate", e)).data;
          } catch (e) {
            throw (console.error("API ERROR:", e?.response?.data || e), e);
          }
        },
        i = async (e) => {
          try {
            return (await o.post("/payments/verify", e)).data;
          } catch (e) {
            throw (console.error("API ERROR:", e?.response?.data || e), e);
          }
        };
    },
    8699: (e, t, r) => {
      "use strict";
      r.d(t, { x4: () => s, z2: () => o });
      var a = r(6334);
      async function s(e) {
        try {
          return (await a.ZP.post("/auth/login", e)).data;
        } catch (t) {
          let e = t?.response?.data ?? {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              t?.message ||
              "Login failed",
          );
        }
      }
      async function o(e) {
        try {
          return (await a.ZP.post("/auth/register", e)).data;
        } catch (t) {
          let e = t?.response?.data ?? {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              t?.message ||
              "Registration failed",
          );
        }
      }
    },
    6083: (e, t, r) => {
      "use strict";
      (r.r(t),
        r.d(t, { $$typeof: () => n, __esModule: () => o, default: () => d }));
      var a = r(8570);
      let s = (0, a.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\error.tsx`,
        ),
        { __esModule: o, $$typeof: n } = s;
      s.default;
      let d = (0, a.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\error.tsx#default`,
      );
    },
    1799: (e, t, r) => {
      "use strict";
      (r.r(t), r.d(t, { default: () => R, metadata: () => S }));
      var a = r(9510);
      r(7272);
      var s = r(8570);
      let o = (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\AuthContext.tsx`,
        ),
        { __esModule: n, $$typeof: d } = o;
      (o.default,
        (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\AuthContext.tsx#AuthContext`,
        ));
      let i = (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\AuthContext.tsx#AuthProvider`,
      );
      (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\AuthContext.tsx#useAuth`,
      );
      let l = (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\NotificationContext.tsx`,
        ),
        { __esModule: u, $$typeof: c } = l;
      l.default;
      let x = (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\NotificationContext.tsx#NotificationProvider`,
      );
      (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\NotificationContext.tsx#useNotifications`,
      );
      let m = (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\realtimeContext.tsx`,
        ),
        { __esModule: f, $$typeof: h } = m;
      m.default;
      let g = (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\realtimeContext.tsx#RealtimeProvider`,
      );
      (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\realtimeContext.tsx#useRealtime`,
      );
      let p = (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\FeatureFlagContext.tsx`,
        ),
        { __esModule: b, $$typeof: v } = p;
      p.default;
      let y = (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\FeatureFlagContext.tsx#FeatureFlagProvider`,
      );
      ((0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\FeatureFlagContext.tsx#useFeatureFlags`,
      ),
        (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\FeatureFlagContext.tsx#useIsFeatureEnabled`,
        ),
        (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\FeatureFlagContext.tsx#FeatureGate`,
        ));
      let w = (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\ThemeContext.tsx`,
        ),
        { __esModule: P, $$typeof: C } = w;
      w.default;
      let k = (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\ThemeContext.tsx#ThemeProvider`,
      );
      (0, s.createProxy)(
        String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\context\ThemeContext.tsx#useTheme`,
      );
      let S = {
        title: "Radaa",
        description: "Live matatu tracking and loyalty rides",
      };
      function R({ children: e }) {
        return a.jsx("html", {
          lang: "en",
          children: a.jsx("body", {
            className: "min-h-screen",
            children: a.jsx(y, {
              children: a.jsx(x, {
                children: a.jsx(i, {
                  children: a.jsx(g, { children: a.jsx(k, { children: e }) }),
                }),
              }),
            }),
          }),
        });
      }
    },
    9644: (e, t, r) => {
      "use strict";
      (r.r(t), r.d(t, { default: () => s }));
      var a = r(9510);
      function s() {
        return (0, a.jsxs)("div", {
          className: "mx-auto max-w-6xl space-y-4 px-4 py-6",
          children: [
            a.jsx("div", {
              className: "h-6 w-32 animate-pulse rounded bg-slate-800/80",
            }),
            a.jsx("div", {
              className: "h-4 w-64 animate-pulse rounded bg-slate-800/80",
            }),
            (0, a.jsxs)("div", {
              className: "grid gap-4 md:grid-cols-3",
              children: [
                a.jsx("div", {
                  className: "h-24 animate-pulse rounded-xl bg-slate-800/80",
                }),
                a.jsx("div", {
                  className: "h-24 animate-pulse rounded-xl bg-slate-800/80",
                }),
                a.jsx("div", {
                  className: "h-24 animate-pulse rounded-xl bg-slate-800/80",
                }),
              ],
            }),
          ],
        });
      }
    },
    7272: () => {},
  }));
