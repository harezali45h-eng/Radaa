(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [702],
  {
    4126: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 4591));
    },
    4591: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return c;
          },
        }));
      var r = a(7437),
        s = a(2265),
        l = a(7138),
        i = a(3429),
        d = a(2315),
        n = a(542),
        o = a(3314);
      function c() {
        var e, t, a, c, u, m, x, v, p, f, h, g, b, y, j;
        let { user: N, token: w, logout: k } = (0, i.a)(),
          [S, E] = (0, s.useState)(null),
          [P, C] = (0, s.useState)(!0),
          [A, R] = (0, s.useState)(null),
          [_, q] = (0, s.useState)(null),
          [O, T] = (0, s.useState)(!1);
        (0, s.useEffect)(() => {
          if (!w) {
            C(!1);
            return;
          }
          let e = !1;
          return (
            (async () => {
              (C(!0), R(null));
              try {
                let t = await (0, d.Ai)(w);
                e || E(t);
              } catch (t) {
                e ||
                  R(t instanceof Error ? t.message : "Failed to load profile");
              } finally {
                e || C(!1);
              }
            })(),
            () => {
              e = !0;
            }
          );
        }, [w]);
        let M = null != S ? S : N;
        return (
          (0, s.useEffect)(() => {
            var e;
            let t =
              null === (e = null != S ? S : N) || void 0 === e ? void 0 : e._id;
            if (!t) return;
            let a = !1;
            return (
              (async () => {
                T(!0);
                try {
                  let [e, r] = await Promise.all([
                    (0, n.Nj)().catch(() => []),
                    (0, n.GX)(t).catch(() => null),
                  ]);
                  if (a) return;
                  let s = Array.isArray(e) ? e : [];
                  q({
                    activeMatatus: s.length,
                    liveSample: s.slice(0, 6),
                    loyalty: r,
                  });
                } finally {
                  a || T(!1);
                }
              })(),
              () => {
                a = !0;
              }
            );
          }, [S, N]),
          (0, r.jsxs)("div", {
            className: "space-y-6",
            children: [
              (0, r.jsxs)("header", {
                className:
                  "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                children: [
                  (0, r.jsxs)("div", {
                    children: [
                      (0, r.jsxs)("h1", {
                        className: "text-2xl font-bold tracking-tight",
                        children: [
                          "Welcome back",
                          M ? ", " : "",
                          null == M ? void 0 : M.username,
                        ],
                      }),
                      (0, r.jsx)("p", {
                        className: "text-xs text-slate-300",
                        children:
                          "Your central hub for matatus, trips, loyalty, and payments.",
                      }),
                    ],
                  }),
                  (0, r.jsx)("button", {
                    type: "button",
                    onClick: k,
                    className:
                      "inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm transition hover:border-red-500/60 hover:bg-red-600/10 hover:text-red-200",
                    children: "Log out",
                  }),
                ],
              }),
              (0, r.jsxs)("section", {
                className: "radaa-card space-y-2 p-3 text-xs",
                children: [
                  (0, r.jsx)("div", {
                    className: "flex items-center justify-between gap-2",
                    children: (0, r.jsx)("h2", {
                      className:
                        "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                      children: "Quick actions",
                    }),
                  }),
                  (0, r.jsxs)("div", {
                    className: "flex flex-wrap gap-2 text-[11px]",
                    children: [
                      (0, r.jsx)(l.default, {
                        href: "/map",
                        className:
                          "inline-flex flex-none items-center justify-center rounded-md border border-sky-600/40 bg-sky-600/15 px-3 py-1.5 font-medium text-sky-200 transition hover:border-sky-400/70 hover:bg-sky-600/25",
                        children: "Open live map",
                      }),
                      (0, r.jsx)(l.default, {
                        href: "/dashboard/matatus/list",
                        className:
                          "inline-flex flex-none items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90",
                        children: "View matatus",
                      }),
                      (0, r.jsx)(l.default, {
                        href: "/dashboard/trips/list",
                        className:
                          "inline-flex flex-none items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90",
                        children: "View trips",
                      }),
                      (0, r.jsx)(l.default, {
                        href: "/payments",
                        className:
                          "inline-flex flex-none items-center justify-center rounded-md border border-emerald-600/40 bg-emerald-600/10 px-3 py-1.5 font-medium text-emerald-200 transition hover:border-emerald-400/70 hover:bg-emerald-600/20",
                        children: "Payments & wallet",
                      }),
                      (0, r.jsx)(o.Z, {}),
                    ],
                  }),
                ],
              }),
              P &&
                (0, r.jsx)("div", {
                  className: "radaa-card p-4 text-xs text-slate-300",
                  children: "Loading your profile...",
                }),
              A &&
                (0, r.jsx)("div", {
                  className:
                    "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                  children: A,
                }),
              M &&
                !P &&
                !A &&
                (0, r.jsxs)(r.Fragment, {
                  children: [
                    (0, r.jsxs)("section", {
                      className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                      children: [
                        (0, r.jsxs)("div", {
                          className: "radaa-card p-4 text-xs",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-slate-400",
                              children: "Email",
                            }),
                            (0, r.jsx)("div", {
                              className:
                                "mt-1 text-sm font-semibold text-slate-100",
                              children: M.email,
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "radaa-card p-4 text-xs",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-slate-400",
                              children: "Handle",
                            }),
                            (0, r.jsx)("div", {
                              className:
                                "mt-1 text-sm font-semibold text-slate-100",
                              children: M.handle || "Not set",
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-slate-400",
                              children: "Joined",
                            }),
                            (0, r.jsx)("div", {
                              className:
                                "mt-1 text-sm font-semibold text-slate-100",
                              children: M.createdAt
                                ? new Date(M.createdAt).toLocaleDateString()
                                : "—",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, r.jsxs)("section", {
                      className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                      children: [
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-slate-400",
                              children: "Active matatus",
                            }),
                            (0, r.jsx)("div", {
                              className:
                                "mt-1 text-lg font-semibold text-sky-400",
                              children: O
                                ? "—"
                                : null !==
                                      (p =
                                        null == _ ? void 0 : _.activeMatatus) &&
                                    void 0 !== p
                                  ? p
                                  : 0,
                            }),
                            (0, r.jsx)("p", {
                              className: "mt-1 text-[11px] text-slate-400",
                              children: "Based on current live map data.",
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-slate-400",
                              children: "Wallet summary",
                            }),
                            (0, r.jsxs)("div", {
                              className:
                                "mt-1 text-lg font-semibold text-emerald-400",
                              children: [
                                "KES ",
                                null !==
                                  (f =
                                    null == _
                                      ? void 0
                                      : null === (e = _.loyalty) || void 0 === e
                                        ? void 0
                                        : e.balance) && void 0 !== f
                                  ? f
                                  : 0,
                              ],
                            }),
                            (0, r.jsxs)("p", {
                              className: "mt-1 text-[11px] text-slate-400",
                              children: [
                                "Loyalty points: ",
                                null !==
                                  (h =
                                    null == _
                                      ? void 0
                                      : null === (t = _.loyalty) || void 0 === t
                                        ? void 0
                                        : t.loyaltyPoints) && void 0 !== h
                                  ? h
                                  : 0,
                              ],
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                          children: [
                            (0, r.jsx)("div", {
                              className: "text-slate-400",
                              children: "Trip stats",
                            }),
                            (0, r.jsxs)("div", {
                              className:
                                "mt-1 text-sm font-semibold text-slate-100",
                              children: [
                                null !==
                                  (g =
                                    null == _
                                      ? void 0
                                      : null === (a = _.loyalty) || void 0 === a
                                        ? void 0
                                        : a.ridesTaken) && void 0 !== g
                                  ? g
                                  : 0,
                                " rides taken",
                              ],
                            }),
                            (0, r.jsxs)("div", {
                              className: "mt-1 text-xs text-slate-300",
                              children: [
                                "Paid rides: ",
                                null !==
                                  (b =
                                    null == _
                                      ? void 0
                                      : null === (c = _.loyalty) || void 0 === c
                                        ? void 0
                                        : c.ridesPaid) && void 0 !== b
                                  ? b
                                  : 0,
                              ],
                            }),
                            (0, r.jsx)("div", {
                              className:
                                "mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800",
                              children: (0, r.jsx)("div", {
                                className: "h-full rounded-full bg-sky-500",
                                style: {
                                  width: "".concat(
                                    Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        ((null !==
                                          (y =
                                            null == _
                                              ? void 0
                                              : null === (m = _.loyalty) ||
                                                  void 0 === m
                                                ? void 0
                                                : null === (u = m.loyalty) ||
                                                    void 0 === u
                                                  ? void 0
                                                  : u.paidRidesCount) &&
                                        void 0 !== y
                                          ? y
                                          : 0) /
                                          10) *
                                          100,
                                      ),
                                    ),
                                    "%",
                                  ),
                                },
                              }),
                            }),
                            (0, r.jsxs)("p", {
                              className: "mt-1 text-[11px] text-slate-400",
                              children: [
                                null !==
                                  (j =
                                    null == _
                                      ? void 0
                                      : null === (v = _.loyalty) || void 0 === v
                                        ? void 0
                                        : null === (x = v.loyalty) ||
                                            void 0 === x
                                          ? void 0
                                          : x.paidRidesCount) && void 0 !== j
                                  ? j
                                  : 0,
                                "/10 paid rides towards a free ride.",
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, r.jsxs)("section", {
                      className: "grid gap-4 lg:grid-cols-[2fr,1fr]",
                      children: [
                        (0, r.jsxs)("div", {
                          className: "radaa-card p-4 text-xs",
                          children: [
                            (0, r.jsxs)("div", {
                              className: "flex items-center justify-between",
                              children: [
                                (0, r.jsxs)("div", {
                                  children: [
                                    (0, r.jsx)("div", {
                                      className:
                                        "text-sm font-semibold text-slate-100",
                                      children: "Live map preview",
                                    }),
                                    (0, r.jsx)("div", {
                                      className: "text-[11px] text-slate-400",
                                      children:
                                        "Quick glance at matatus currently online. Open the full map for details.",
                                    }),
                                  ],
                                }),
                                (0, r.jsx)("a", {
                                  href: "/map",
                                  className:
                                    "text-[11px] font-medium text-sky-400 hover:text-sky-300",
                                  children: "Open map",
                                }),
                              ],
                            }),
                            (0, r.jsxs)("div", {
                              className:
                                "mt-3 grid grid-cols-3 gap-2 text-[10px]",
                              children: [
                                O &&
                                  (0, r.jsx)("div", {
                                    className:
                                      "col-span-3 h-16 animate-pulse rounded-lg bg-slate-800/60",
                                  }),
                                !O &&
                                  (null == _ ? void 0 : _.liveSample.length) ===
                                    0 &&
                                  (0, r.jsx)("p", {
                                    className: "col-span-3 text-slate-400",
                                    children: "No live matatus at the moment.",
                                  }),
                                !O &&
                                  (null == _
                                    ? void 0
                                    : _.liveSample.map((e) => {
                                        var t;
                                        return (0, r.jsx)(
                                          "div",
                                          {
                                            className:
                                              "flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-2",
                                            children: (0, r.jsxs)("div", {
                                              children: [
                                                (0, r.jsx)("div", {
                                                  className:
                                                    "text-[11px] font-semibold text-slate-100",
                                                  children:
                                                    e.plate ||
                                                    e.numberPlate ||
                                                    e.id.slice(0, 4),
                                                }),
                                                (0, r.jsx)("div", {
                                                  className:
                                                    "text-[10px] text-slate-400",
                                                  children:
                                                    null !== (t = e.route) &&
                                                    void 0 !== t
                                                      ? t
                                                      : "Route TBD",
                                                }),
                                              ],
                                            }),
                                          },
                                          e.id,
                                        );
                                      })),
                              ],
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "space-y-3 radaa-card p-4 text-xs",
                          children: [
                            (0, r.jsxs)("div", {
                              className: "flex items-center justify-between",
                              children: [
                                (0, r.jsxs)("div", {
                                  children: [
                                    (0, r.jsx)("div", {
                                      className:
                                        "text-sm font-semibold text-slate-100",
                                      children: "Your active trips",
                                    }),
                                    (0, r.jsx)("div", {
                                      className: "text-[11px] text-slate-400",
                                      children:
                                        "When a trip is live, it will appear here with quick actions.",
                                    }),
                                  ],
                                }),
                                (0, r.jsx)("span", {
                                  className:
                                    "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200",
                                  children: 0,
                                }),
                              ],
                            }),
                            (0, r.jsx)("div", {
                              className:
                                "rounded-md border border-dashed border-slate-700 bg-slate-900/60 px-3 py-4 text-[11px] text-slate-400",
                              children:
                                "No active trips right now. Start a ride from your matatu or trips section.",
                            }),
                            (0, r.jsx)("a", {
                              href: "/dashboard/trips/list",
                              className:
                                "inline-flex items-center text-[11px] font-medium text-sky-400 hover:text-sky-300",
                              children: "View all trips",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              !P &&
                !M &&
                !A &&
                (0, r.jsx)("div", {
                  className:
                    "rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100",
                  children:
                    "We couldn't find your profile details. Try signing out and back in again.",
                }),
            ],
          })
        );
      }
    },
    3314: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return o;
        },
      });
      var r = a(7437),
        s = a(2265),
        l = a(3429),
        i = a(4876),
        d = a(7299),
        n = a(3551);
      function o() {
        let { token: e } = (0, l.a)(),
          { addNotification: t } = (0, i.z)(),
          [a, o] = (0, s.useState)(!1),
          { primaryButtonClass: c } = (0, n.F)();
        return (0, r.jsx)("button", {
          type: "button",
          onClick: () => {
            if (!e) {
              t({
                type: "system",
                title: "Sign in required",
                message: "You need to be signed in to request a ride.",
              });
              return;
            }
            if (!navigator.geolocation) {
              t({
                type: "system",
                title: "Location unavailable",
                message: "Geolocation is not available in this browser.",
              });
              return;
            }
            (o(!0),
              navigator.geolocation.getCurrentPosition(
                async (a) => {
                  try {
                    (await (0, d.jc)(
                      {
                        pickup: {
                          lat: a.coords.latitude,
                          lng: a.coords.longitude,
                        },
                      },
                      e,
                    ),
                      t({
                        type: "trip",
                        title: "Ride requested",
                        message: "We are finding a nearby driver for you.",
                      }));
                  } catch (e) {
                    t({
                      type: "system",
                      title: "Ride request failed",
                      message:
                        e instanceof Error
                          ? e.message
                          : "Failed to request ride",
                    });
                  } finally {
                    o(!1);
                  }
                },
                (e) => {
                  (t({
                    type: "system",
                    title: "Location error",
                    message:
                      (null == e ? void 0 : e.message) ||
                      "Unable to fetch current location.",
                  }),
                    o(!1));
                },
                { enableHighAccuracy: !0, timeout: 1e4 },
              ));
          },
          disabled: a,
          className: "".concat(
            c,
            " flex-none text-[11px] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60",
          ),
          children: a ? "Requesting ride..." : "Request a ride",
        });
      }
    },
    3551: function (e, t, a) {
      "use strict";
      a.d(t, {
        F: function () {
          return o;
        },
        ThemeProvider: function () {
          return n;
        },
      });
      var r = a(7437),
        s = a(2265),
        l = a(3429),
        i = a(728);
      let d = (0, s.createContext)(void 0);
      function n(e) {
        let { children: t } = e,
          { user: a } = (0, l.a)(),
          { activeMode: n } = (0, i.r)(),
          o = null == a ? void 0 : a.role,
          c = (0, s.useMemo)(
            () =>
              "admin" === o
                ? "sacco"
                : "driver" === o && "driver" === n
                  ? "driver"
                  : o
                    ? "passenger"
                    : "generic",
            [o, n],
          ),
          u = (0, s.useMemo)(() => {
            let e = "passenger" === c || "generic" === c,
              t = "driver" === c,
              a = "sacco" === c;
            return {
              variant: c,
              isPassenger: e,
              isDriver: t,
              isSacco: a,
              headerBgClass: t
                ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-mint/20 via-radaa-teal/15 to-radaa-gold/10 backdrop-blur"
                : a
                  ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-gold/20 via-radaa-orange/15 to-radaa-mint/10 backdrop-blur"
                  : "border-b border-slate-800/70 bg-gradient-to-r from-radaa-blue/25 via-radaa-purple/20 to-radaa-mint/10 backdrop-blur",
              primaryButtonClass: t
                ? "radaa-btn-primary bg-gradient-to-r from-radaa-mint to-radaa-teal shadow-glow-mint"
                : a
                  ? "radaa-btn-primary bg-gradient-to-r from-radaa-gold to-radaa-orange shadow-glow-blue"
                  : "radaa-btn-primary bg-gradient-to-r from-radaa-blue to-radaa-purple shadow-glow-blue",
              subtleButtonClass: "radaa-btn-secondary",
              cardSurfaceClass: t
                ? "radaa-card border-radaa-mint/40"
                : a
                  ? "radaa-card border-radaa-gold/40"
                  : "radaa-card",
            };
          }, [c]);
        return (0, r.jsx)(d.Provider, { value: u, children: t });
      }
      function o() {
        let e = (0, s.useContext)(d);
        if (!e) throw Error("useTheme must be used within a ThemeProvider");
        return e;
      }
    },
    728: function (e, t, a) {
      "use strict";
      a.d(t, {
        RealtimeProvider: function () {
          return u;
        },
        r: function () {
          return m;
        },
      });
      var r = a(7437),
        s = a(2265),
        l = a(3901),
        i = a(4876),
        d = a(3429);
      let n = "radaa_active_mode";
      function o() {
        try {
          let e = window.localStorage.getItem(n);
          if ("driver" === e || "passenger" === e) return e;
        } catch (e) {
          console.error("[realtime] failed to read mode from storage", e);
        }
        return "passenger";
      }
      let c = (0, s.createContext)(void 0);
      function u(e) {
        let { children: t } = e,
          { connect: a, on: u, off: m, emit: x } = (0, l.s)(),
          { addNotification: v } = (0, i.z)(),
          { user: p, token: f } = (0, d.a)(),
          [h, g] = (0, s.useState)([]),
          [b, y] = (0, s.useState)(null),
          [j, N] = (0, s.useState)(() => o()),
          [w, k] = (0, s.useState)(() => "driver" === o());
        (0, s.useEffect)(() => {
          a(f);
          let e = (e) => {
              let t = Array.isArray(e) ? e : [e];
              g((e) => {
                let a = new Map();
                return (
                  e.forEach((e) => {
                    a.set(e.id, e);
                  }),
                  t.forEach((e) => {
                    if (!e || !e.id) return;
                    let t = a.get(e.id) || { id: e.id };
                    a.set(e.id, { ...t, ...e });
                  }),
                  Array.from(a.values())
                );
              });
            },
            t = (e) => {
              if (!e) return;
              y(e);
              let t = e.matatuPlate || e.matatuName || e.matatuNumberPlate;
              v({
                type: "trip",
                title: "New ride assigned",
                message: t
                  ? "A new ride was assigned to ".concat(t, ".")
                  : "A new ride was assigned.",
              });
            },
            r = (e) => {
              e &&
                v({
                  type: "trip",
                  title: "New ride created",
                  message: "A passenger just created a new ride request.",
                });
            },
            s = (e) => {
              v({
                type: "system",
                title: "SACCO stats updated",
                message: "Live SACCO metrics were updated.",
              });
            },
            l = (e) => {};
          return (
            u("matatus:live_update", e),
            u("matatu:live_update", e),
            u("ride:assigned", t),
            u("ride:created", r),
            u("sacco:update", s),
            u("passenger:live_update", l),
            () => {
              (m("matatus:live_update", e),
                m("matatu:live_update", e),
                m("ride:assigned", t),
                m("ride:created", r),
                m("sacco:update", s),
                m("passenger:live_update", l));
            }
          );
        }, [a, u, m, v, f]);
        let S = (0, s.useCallback)(
          (e) => {
            k(e);
            let t = e ? "driver" : "passenger";
            (N(t), x(e ? "driver:online" : "driver:offline", { online: e }));
            try {
              window.localStorage.setItem(n, t);
            } catch (e) {
              console.error("[realtime] failed to persist mode to storage", e);
            }
            console.log("[realtime] setDriverOnline", { online: e, mode: t });
          },
          [x],
        );
        (0, s.useEffect)(() => {
          if (!p) return;
          let e = null;
          try {
            e = window.localStorage.getItem(n);
          } catch (e) {
            console.error(
              "[realtime] failed to read mode from storage for role init",
              e,
            );
          }
          "driver" !== e &&
            "passenger" !== e &&
            ("driver" === (null == p ? void 0 : p.role) ? S(!0) : S(!1));
        }, [p, S]);
        let E = (0, s.useMemo)(
          () => ({
            matatus: h,
            lastRideAssigned: b,
            driverOnline: w,
            setDriverOnline: S,
            activeMode: j,
          }),
          [h, b, w, S, j],
        );
        return (0, r.jsx)(c.Provider, { value: E, children: t });
      }
      function m() {
        let e = (0, s.useContext)(c);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
      }
    },
    7299: function (e, t, a) {
      "use strict";
      a.d(t, {
        jc: function () {
          return l;
        },
        nW: function () {
          return d;
        },
        uZ: function () {
          return i;
        },
      });
      var r = a(542);
      async function s(e) {
        let t,
          a =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: s = "GET", body: l, token: i } = a,
          d = {};
        i && (d.Authorization = "Bearer ".concat(i));
        for (let a = 1; a <= 3; a += 1)
          try {
            let t = (
              await r.ZP.request({ url: e, method: s, data: l, headers: d })
            ).data;
            if (
              null != t &&
              t &&
              "object" == typeof t &&
              "success" in t &&
              !0 === t.success &&
              "data" in t
            )
              return t.data;
            return t;
          } catch (l) {
            var n, o, c;
            ((t = l),
              console.error(
                "API ERROR:",
                (null == l
                  ? void 0
                  : null === (n = l.response) || void 0 === n
                    ? void 0
                    : n.data) || l,
              ));
            let e =
                null == l
                  ? void 0
                  : null === (o = l.response) || void 0 === o
                    ? void 0
                    : o.status,
              r =
                null == l
                  ? void 0
                  : null === (c = l.response) || void 0 === c
                    ? void 0
                    : c.data,
              s =
                (r && "object" == typeof r && (r.message || r.error)) ||
                (null == l ? void 0 : l.message) ||
                "Request failed";
            if (e && e >= 500 && a < 3) {
              t = Error(s);
              continue;
            }
            throw Error(s);
          }
        throw t instanceof Error ? t : Error("Request failed");
      }
      async function l(e, t) {
        return s("/rides/request", { method: "POST", body: e, token: t });
      }
      async function i(e, t) {
        let a = new URLSearchParams();
        return (
          a.set("lat", String(e.lat)),
          a.set("lng", String(e.lng)),
          "number" == typeof e.radiusMeters &&
            a.set("radius", String(e.radiusMeters)),
          s("/rides/nearby?".concat(a.toString()), { method: "GET", token: t })
        );
      }
      async function d(e, t) {
        return s("/rides/".concat(e, "/accept"), { method: "POST", token: t });
      }
    },
  },
  function (e) {
    (e.O(0, [472, 138, 40, 401, 971, 23, 744], function () {
      return e((e.s = 4126));
    }),
      (_N_E = e.O()));
  },
]);
