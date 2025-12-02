"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [239],
  {
    4239: function (e, a, t) {
      t.d(a, {
        AppShell: function () {
          return x;
        },
      });
      var r = t(7437),
        s = t(2265),
        l = t(7138),
        d = t(6463),
        i = t(3429),
        o = t(4876),
        n = t(728),
        c = t(3551);
      function m() {
        let e = (0, d.useRouter)(),
          { activeMode: a } = (0, n.r)(),
          { primaryButtonClass: t } = (0, c.F)();
        return (0, r.jsxs)("button", {
          type: "button",
          onClick: () => {
            let t = "driver" === a ? "/dashboard/driver/live" : "/dashboard";
            (console.log("[mode] back-to-dashboard", {
              activeMode: a,
              target: t,
            }),
              e.push(t));
          },
          className: "".concat(t, " gap-1 text-xs"),
          children: [
            (0, r.jsx)("span", { className: "mr-1", children: "←" }),
            "Back to Dashboard",
          ],
        });
      }
      var u = t(3901);
      function x(e) {
        let { children: a } = e,
          t = (0, d.usePathname)(),
          { user: x, token: h, logout: f } = (0, i.a)(),
          { notifications: p, unreadCount: b, markAllAsRead: v } = (0, o.z)(),
          [g, j] = (0, s.useState)(!1),
          { connect: N } = (0, u.s)(),
          { driverOnline: w, setDriverOnline: y, activeMode: C } = (0, n.r)(),
          { headerBgClass: k } = (0, c.F)();
        (0, s.useEffect)(() => {
          h && N(h);
        }, [h, N]);
        let P = "/dashboard" === t,
          S = t.startsWith("/dashboard/"),
          A = t.startsWith("/auth"),
          _ = "/" !== t && !A && !P,
          E = null == x ? void 0 : x.role,
          R = "admin" === E,
          T = "driver" === E,
          L = R
            ? "/dashboard/sacco"
            : T && "driver" === C
              ? "/dashboard/driver/live"
              : "/dashboard",
          M =
            T && "driver" === C
              ? "/dashboard/driver/live"
              : "/dashboard/passenger/live";
        return (0, r.jsxs)("div", {
          className: "flex min-h-screen flex-col",
          children: [
            (0, r.jsx)("header", {
              className: k,
              children: (0, r.jsxs)("div", {
                className: "radaa-shell flex items-center justify-between py-3",
                children: [
                  (0, r.jsx)(l.default, {
                    href: L,
                    className: "text-lg font-semibold tracking-tight",
                    children: "Radaa",
                  }),
                  (0, r.jsxs)("nav", {
                    className: "flex items-center gap-4 text-sm text-slate-300",
                    children: [
                      (0, r.jsxs)("div", {
                        className: "hidden items-center gap-3 md:flex",
                        children: [
                          (0, r.jsx)(l.default, {
                            href: L,
                            className: "hover:text-white",
                            children: "Home",
                          }),
                          (0, r.jsx)(l.default, {
                            href: M,
                            className: "hover:text-white",
                            children: "Live",
                          }),
                          (0, r.jsx)(l.default, {
                            href: "/dashboard/trips/list",
                            className: "hover:text-white",
                            children: "Trips",
                          }),
                          (0, r.jsx)(l.default, {
                            href: "/profile",
                            className: "hover:text-white",
                            children: "Profile",
                          }),
                          R &&
                            (0, r.jsx)(l.default, {
                              href: "/dashboard/sacco",
                              className: "hover:text-white",
                              children: "SACCO",
                            }),
                        ],
                      }),
                      (P || S) &&
                        T &&
                        (0, r.jsxs)("button", {
                          type: "button",
                          onClick: () => {
                            let e = !w;
                            (console.log(
                              "[mode] header toggle ->",
                              e ? "driver" : "passenger",
                            ),
                              y(e));
                          },
                          className:
                            "inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium shadow-sm transition ".concat(
                              w
                                ? "border-emerald-500/80 bg-emerald-600/20 text-emerald-200"
                                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500",
                            ),
                          children: [
                            (0, r.jsx)("span", {
                              className:
                                "mr-1 h-1.5 w-1.5 rounded-full ".concat(
                                  w ? "bg-emerald-400" : "bg-slate-500",
                                ),
                            }),
                            "Driver Mode",
                          ],
                        }),
                      (0, r.jsxs)("div", {
                        className: "relative",
                        children: [
                          (0, r.jsxs)("button", {
                            type: "button",
                            onClick: () => {
                              let e = !g;
                              (j(e), e && v());
                            },
                            className:
                              "relative inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-200 shadow-sm transition hover:border-sky-500/70 hover:text-sky-200",
                            children: [
                              (0, r.jsx)("span", {
                                className:
                                  "mr-1 h-1.5 w-1.5 rounded-full bg-sky-400",
                              }),
                              "Notifications",
                              b > 0 &&
                                (0, r.jsx)("span", {
                                  className:
                                    "ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white",
                                  children: b,
                                }),
                            ],
                          }),
                          g &&
                            (0, r.jsxs)("div", {
                              className:
                                "absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-md border border-slate-800 bg-slate-950 text-[11px] shadow-lg",
                              children: [
                                (0, r.jsx)("div", {
                                  className:
                                    "border-b border-slate-800 px-3 py-2 text-xs font-semibold text-slate-200",
                                  children: "Notifications",
                                }),
                                0 === p.length
                                  ? (0, r.jsx)("div", {
                                      className: "px-3 py-3 text-slate-400",
                                      children: "No notifications yet.",
                                    })
                                  : (0, r.jsx)("ul", {
                                      className:
                                        "max-h-64 divide-y divide-slate-800 overflow-auto",
                                      children: p.map((e) =>
                                        (0, r.jsxs)(
                                          "li",
                                          {
                                            className:
                                              "px-3 py-2 hover:bg-slate-900/80",
                                            children: [
                                              (0, r.jsxs)("div", {
                                                className:
                                                  "flex items-start justify-between gap-2",
                                                children: [
                                                  (0, r.jsxs)("div", {
                                                    children: [
                                                      (0, r.jsx)("div", {
                                                        className:
                                                          "text-[11px] font-semibold text-slate-100",
                                                        children: e.title,
                                                      }),
                                                      (0, r.jsx)("div", {
                                                        className:
                                                          "mt-0.5 text-[11px] text-slate-300",
                                                        children: e.message,
                                                      }),
                                                    ],
                                                  }),
                                                  !e.read &&
                                                    (0, r.jsx)("span", {
                                                      className:
                                                        "mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-400",
                                                    }),
                                                ],
                                              }),
                                              (0, r.jsx)("div", {
                                                className:
                                                  "mt-1 text-[10px] text-slate-500",
                                                children: new Date(
                                                  e.createdAt,
                                                ).toLocaleTimeString(),
                                              }),
                                            ],
                                          },
                                          e.id,
                                        ),
                                      ),
                                    }),
                              ],
                            }),
                        ],
                      }),
                      (0, r.jsx)("button", {
                        type: "button",
                        onClick: f,
                        className:
                          "text-xs font-medium text-slate-300 hover:text-red-300",
                        children: "Logout",
                      }),
                    ],
                  }),
                ],
              }),
            }),
            (0, r.jsx)("main", {
              className: "flex-1",
              children: (0, r.jsxs)("div", {
                className: "mx-auto max-w-6xl px-4 py-6",
                children: [
                  _ &&
                    (0, r.jsx)("div", {
                      className: "mb-4 flex justify-end",
                      children: (0, r.jsx)(m, {}),
                    }),
                  a,
                ],
              }),
            }),
            (P || S) &&
              T &&
              (0, r.jsx)("nav", {
                className:
                  "fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-950/90 px-4 py-2 text-[11px] text-slate-200 md:hidden",
                children: (0, r.jsxs)("div", {
                  className:
                    "mx-auto flex max-w-md items-center justify-between",
                  children: [
                    (0, r.jsx)(l.default, {
                      href: L,
                      className: "flex flex-1 flex-col items-center px-2 py-1",
                      children: (0, r.jsx)("span", {
                        className: "text-[11px]",
                        children: "Home",
                      }),
                    }),
                    (0, r.jsx)(l.default, {
                      href: M,
                      className: "flex flex-1 flex-col items-center px-2 py-1",
                      children: (0, r.jsx)("span", {
                        className: "text-[11px]",
                        children: "Live",
                      }),
                    }),
                    (0, r.jsx)(l.default, {
                      href: "/dashboard/trips/list",
                      className: "flex flex-1 flex-col items-center px-2 py-1",
                      children: (0, r.jsx)("span", {
                        className: "text-[11px]",
                        children: "Trips",
                      }),
                    }),
                    (0, r.jsx)(l.default, {
                      href: "/profile",
                      className: "flex flex-1 flex-col items-center px-2 py-1",
                      children: (0, r.jsx)("span", {
                        className: "text-[11px]",
                        children: "Profile",
                      }),
                    }),
                    R &&
                      (0, r.jsx)(l.default, {
                        href: "/dashboard/sacco",
                        className:
                          "flex flex-1 flex-col items-center px-2 py-1",
                        children: (0, r.jsx)("span", {
                          className: "text-[11px]",
                          children: "SACCO",
                        }),
                      }),
                  ],
                }),
              }),
          ],
        });
      }
    },
    3551: function (e, a, t) {
      t.d(a, {
        F: function () {
          return n;
        },
        ThemeProvider: function () {
          return o;
        },
      });
      var r = t(7437),
        s = t(2265),
        l = t(3429),
        d = t(728);
      let i = (0, s.createContext)(void 0);
      function o(e) {
        let { children: a } = e,
          { user: t } = (0, l.a)(),
          { activeMode: o } = (0, d.r)(),
          n = null == t ? void 0 : t.role,
          c = (0, s.useMemo)(
            () =>
              "admin" === n
                ? "sacco"
                : "driver" === n && "driver" === o
                  ? "driver"
                  : n
                    ? "passenger"
                    : "generic",
            [n, o],
          ),
          m = (0, s.useMemo)(() => {
            let e = "passenger" === c || "generic" === c,
              a = "driver" === c,
              t = "sacco" === c;
            return {
              variant: c,
              isPassenger: e,
              isDriver: a,
              isSacco: t,
              headerBgClass: a
                ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-mint/20 via-radaa-teal/15 to-radaa-gold/10 backdrop-blur"
                : t
                  ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-gold/20 via-radaa-orange/15 to-radaa-mint/10 backdrop-blur"
                  : "border-b border-slate-800/70 bg-gradient-to-r from-radaa-blue/25 via-radaa-purple/20 to-radaa-mint/10 backdrop-blur",
              primaryButtonClass: a
                ? "radaa-btn-primary bg-gradient-to-r from-radaa-mint to-radaa-teal shadow-glow-mint"
                : t
                  ? "radaa-btn-primary bg-gradient-to-r from-radaa-gold to-radaa-orange shadow-glow-blue"
                  : "radaa-btn-primary bg-gradient-to-r from-radaa-blue to-radaa-purple shadow-glow-blue",
              subtleButtonClass: "radaa-btn-secondary",
              cardSurfaceClass: a
                ? "radaa-card border-radaa-mint/40"
                : t
                  ? "radaa-card border-radaa-gold/40"
                  : "radaa-card",
            };
          }, [c]);
        return (0, r.jsx)(i.Provider, { value: m, children: a });
      }
      function n() {
        let e = (0, s.useContext)(i);
        if (!e) throw Error("useTheme must be used within a ThemeProvider");
        return e;
      }
    },
    728: function (e, a, t) {
      t.d(a, {
        RealtimeProvider: function () {
          return m;
        },
        r: function () {
          return u;
        },
      });
      var r = t(7437),
        s = t(2265),
        l = t(3901),
        d = t(4876),
        i = t(3429);
      let o = "radaa_active_mode";
      function n() {
        try {
          let e = window.localStorage.getItem(o);
          if ("driver" === e || "passenger" === e) return e;
        } catch (e) {
          console.error("[realtime] failed to read mode from storage", e);
        }
        return "passenger";
      }
      let c = (0, s.createContext)(void 0);
      function m(e) {
        let { children: a } = e,
          { connect: t, on: m, off: u, emit: x } = (0, l.s)(),
          { addNotification: h } = (0, d.z)(),
          { user: f, token: p } = (0, i.a)(),
          [b, v] = (0, s.useState)([]),
          [g, j] = (0, s.useState)(null),
          [N, w] = (0, s.useState)(() => n()),
          [y, C] = (0, s.useState)(() => "driver" === n());
        (0, s.useEffect)(() => {
          t(p);
          let e = (e) => {
              let a = Array.isArray(e) ? e : [e];
              v((e) => {
                let t = new Map();
                return (
                  e.forEach((e) => {
                    t.set(e.id, e);
                  }),
                  a.forEach((e) => {
                    if (!e || !e.id) return;
                    let a = t.get(e.id) || { id: e.id };
                    t.set(e.id, { ...a, ...e });
                  }),
                  Array.from(t.values())
                );
              });
            },
            a = (e) => {
              if (!e) return;
              j(e);
              let a = e.matatuPlate || e.matatuName || e.matatuNumberPlate;
              h({
                type: "trip",
                title: "New ride assigned",
                message: a
                  ? "A new ride was assigned to ".concat(a, ".")
                  : "A new ride was assigned.",
              });
            },
            r = (e) => {
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
            l = (e) => {};
          return (
            m("matatus:live_update", e),
            m("matatu:live_update", e),
            m("ride:assigned", a),
            m("ride:created", r),
            m("sacco:update", s),
            m("passenger:live_update", l),
            () => {
              (u("matatus:live_update", e),
                u("matatu:live_update", e),
                u("ride:assigned", a),
                u("ride:created", r),
                u("sacco:update", s),
                u("passenger:live_update", l));
            }
          );
        }, [t, m, u, h, p]);
        let k = (0, s.useCallback)(
          (e) => {
            C(e);
            let a = e ? "driver" : "passenger";
            (w(a), x(e ? "driver:online" : "driver:offline", { online: e }));
            try {
              window.localStorage.setItem(o, a);
            } catch (e) {
              console.error("[realtime] failed to persist mode to storage", e);
            }
            console.log("[realtime] setDriverOnline", { online: e, mode: a });
          },
          [x],
        );
        (0, s.useEffect)(() => {
          if (!f) return;
          let e = null;
          try {
            e = window.localStorage.getItem(o);
          } catch (e) {
            console.error(
              "[realtime] failed to read mode from storage for role init",
              e,
            );
          }
          "driver" !== e &&
            "passenger" !== e &&
            ("driver" === (null == f ? void 0 : f.role) ? k(!0) : k(!1));
        }, [f, k]);
        let P = (0, s.useMemo)(
          () => ({
            matatus: b,
            lastRideAssigned: g,
            driverOnline: y,
            setDriverOnline: k,
            activeMode: N,
          }),
          [b, g, y, k, N],
        );
        return (0, r.jsx)(c.Provider, { value: P, children: a });
      }
      function u() {
        let e = (0, s.useContext)(c);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
      }
    },
    6463: function (e, a, t) {
      var r = t(1169);
      (t.o(r, "useParams") &&
        t.d(a, {
          useParams: function () {
            return r.useParams;
          },
        }),
        t.o(r, "usePathname") &&
          t.d(a, {
            usePathname: function () {
              return r.usePathname;
            },
          }),
        t.o(r, "useRouter") &&
          t.d(a, {
            useRouter: function () {
              return r.useRouter;
            },
          }));
    },
  },
]);
