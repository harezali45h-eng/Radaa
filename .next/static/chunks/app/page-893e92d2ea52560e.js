(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [931],
  {
    8621: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 6774));
    },
    6774: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return n;
          },
        }));
      var a = r(7437),
        s = r(2265),
        i = r(7138),
        o = r(6463),
        l = r(3429),
        d = r(728);
      function n() {
        let { user: e, token: t, loading: r } = (0, l.a)(),
          n = (0, o.useRouter)(),
          { activeMode: u } = (0, d.r)();
        return ((0, s.useEffect)(() => {
          if (r || (!e && !t)) return;
          let a = null == e ? void 0 : e.role,
            s = "/dashboard";
          ((s =
            "admin" === a
              ? "/dashboard/sacco"
              : "driver" === a && "driver" === u
                ? "/dashboard/driver/live"
                : "/dashboard"),
            console.log("[mode] root redirect", {
              role: a,
              activeMode: u,
              target: s,
            }),
            n.replace(s));
        }, [r, e, t, n, u]),
        e || t)
          ? (0, a.jsx)("div", {
              className: "space-y-2 text-sm text-slate-300",
              children: (0, a.jsx)("p", {
                children: "Redirecting to your dashboard...",
              }),
            })
          : (0, a.jsxs)("div", {
              className: "space-y-6",
              children: [
                (0, a.jsxs)("section", {
                  className: "space-y-3",
                  children: [
                    (0, a.jsx)("h1", {
                      className: "text-3xl font-semibold tracking-tight",
                      children: "Welcome to Radaa",
                    }),
                    (0, a.jsx)("p", {
                      className: "max-w-2xl text-sm text-slate-300",
                      children:
                        "Track live matatus, manage your rides, and unlock free trips through the built-in loyalty program.",
                    }),
                  ],
                }),
                (0, a.jsxs)("section", {
                  className: "grid gap-4 md:grid-cols-3",
                  children: [
                    (0, a.jsxs)(i.default, {
                      href: "/map",
                      className:
                        "rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-sky-500/80 hover:bg-slate-900",
                      children: [
                        (0, a.jsx)("h2", {
                          className: "text-base font-semibold",
                          children: "Live Matatu Map",
                        }),
                        (0, a.jsx)("p", {
                          className: "mt-1 text-xs text-slate-300",
                          children:
                            "See matatus in real time, including their latest location and basic route details.",
                        }),
                      ],
                    }),
                    (0, a.jsxs)(i.default, {
                      href: "/profile",
                      className:
                        "rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-emerald-500/80 hover:bg-slate-900",
                      children: [
                        (0, a.jsx)("h2", {
                          className: "text-base font-semibold",
                          children: "Your Profile & Loyalty",
                        }),
                        (0, a.jsx)("p", {
                          className: "mt-1 text-xs text-slate-300",
                          children:
                            "View your ride history, loyalty progress, and unlocked free rides.",
                        }),
                      ],
                    }),
                    (0, a.jsxs)(i.default, {
                      href: "/payments",
                      className:
                        "rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-amber-400/80 hover:bg-slate-900",
                      children: [
                        (0, a.jsx)("h2", {
                          className: "text-base font-semibold",
                          children: "Quick Payments",
                        }),
                        (0, a.jsx)("p", {
                          className: "mt-1 text-xs text-slate-300",
                          children:
                            "Initiate and verify payments via Mpesa, card, or other providers (sandboxed).",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            });
      }
    },
    728: function (e, t, r) {
      "use strict";
      r.d(t, {
        RealtimeProvider: function () {
          return c;
        },
        r: function () {
          return m;
        },
      });
      var a = r(7437),
        s = r(2265),
        i = r(3901),
        o = r(4876),
        l = r(3429);
      let d = "radaa_active_mode";
      function n() {
        try {
          let e = window.localStorage.getItem(d);
          if ("driver" === e || "passenger" === e) return e;
        } catch (e) {
          console.error("[realtime] failed to read mode from storage", e);
        }
        return "passenger";
      }
      let u = (0, s.createContext)(void 0);
      function c(e) {
        let { children: t } = e,
          { connect: r, on: c, off: m, emit: f } = (0, i.s)(),
          { addNotification: h } = (0, o.z)(),
          { user: p, token: v } = (0, l.a)(),
          [g, x] = (0, s.useState)([]),
          [b, y] = (0, s.useState)(null),
          [N, w] = (0, s.useState)(() => n()),
          [j, P] = (0, s.useState)(() => "driver" === n());
        (0, s.useEffect)(() => {
          r(v);
          let e = (e) => {
              let t = Array.isArray(e) ? e : [e];
              x((e) => {
                let r = new Map();
                return (
                  e.forEach((e) => {
                    r.set(e.id, e);
                  }),
                  t.forEach((e) => {
                    if (!e || !e.id) return;
                    let t = r.get(e.id) || { id: e.id };
                    r.set(e.id, { ...t, ...e });
                  }),
                  Array.from(r.values())
                );
              });
            },
            t = (e) => {
              if (!e) return;
              y(e);
              let t = e.matatuPlate || e.matatuName || e.matatuNumberPlate;
              h({
                type: "trip",
                title: "New ride assigned",
                message: t
                  ? "A new ride was assigned to ".concat(t, ".")
                  : "A new ride was assigned.",
              });
            },
            a = (e) => {
              e &&
                h({
                  type: "trip",
                  title: "New ride created",
                  message: "A passenger just created a new ride request.",
                });
            },
            s = (e) => {
              h({
                type: "system",
                title: "SACCO stats updated",
                message: "Live SACCO metrics were updated.",
              });
            },
            i = (e) => {};
          return (
            c("matatus:live_update", e),
            c("matatu:live_update", e),
            c("ride:assigned", t),
            c("ride:created", a),
            c("sacco:update", s),
            c("passenger:live_update", i),
            () => {
              (m("matatus:live_update", e),
                m("matatu:live_update", e),
                m("ride:assigned", t),
                m("ride:created", a),
                m("sacco:update", s),
                m("passenger:live_update", i));
            }
          );
        }, [r, c, m, h, v]);
        let _ = (0, s.useCallback)(
          (e) => {
            P(e);
            let t = e ? "driver" : "passenger";
            (w(t), f(e ? "driver:online" : "driver:offline", { online: e }));
            try {
              window.localStorage.setItem(d, t);
            } catch (e) {
              console.error("[realtime] failed to persist mode to storage", e);
            }
            console.log("[realtime] setDriverOnline", { online: e, mode: t });
          },
          [f],
        );
        (0, s.useEffect)(() => {
          if (!p) return;
          let e = null;
          try {
            e = window.localStorage.getItem(d);
          } catch (e) {
            console.error(
              "[realtime] failed to read mode from storage for role init",
              e,
            );
          }
          "driver" !== e &&
            "passenger" !== e &&
            ("driver" === (null == p ? void 0 : p.role) ? _(!0) : _(!1));
        }, [p, _]);
        let k = (0, s.useMemo)(
          () => ({
            matatus: g,
            lastRideAssigned: b,
            driverOnline: j,
            setDriverOnline: _,
            activeMode: N,
          }),
          [g, b, j, _, N],
        );
        return (0, a.jsx)(u.Provider, { value: k, children: t });
      }
      function m() {
        let e = (0, s.useContext)(u);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
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
    (e.O(0, [472, 138, 40, 401, 971, 23, 744], function () {
      return e((e.s = 8621));
    }),
      (_N_E = e.O()));
  },
]);
