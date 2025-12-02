(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [185],
  {
    2914: function (e, r, t) {
      (Promise.resolve().then(t.t.bind(t, 8877, 23)),
        Promise.resolve().then(t.bind(t, 3429)),
        Promise.resolve().then(t.bind(t, 2858)),
        Promise.resolve().then(t.bind(t, 4876)),
        Promise.resolve().then(t.bind(t, 728)),
        Promise.resolve().then(t.bind(t, 3551)));
    },
    2858: function (e, r, t) {
      "use strict";
      t.d(r, {
        FeatureFlagProvider: function () {
          return d;
        },
        N3: function () {
          return s;
        },
      });
      var a = t(7437),
        o = t(2265),
        n = t(542);
      let i = (0, o.createContext)(void 0);
      function d(e) {
        let { children: r } = e,
          [t, d] = (0, o.useState)(null),
          [s, l] = (0, o.useState)(!0),
          [u, c] = (0, o.useState)(null);
        (0, o.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (l(!0), c(null));
              try {
                let r = await (0, n.BZ)();
                if (e) return;
                r && "object" == typeof r ? d(r) : d({});
              } catch (r) {
                if (e) return;
                (d({}),
                  c(
                    r instanceof Error
                      ? r.message
                      : "Failed to load feature flags",
                  ));
              } finally {
                e || l(!1);
              }
            })(),
            () => {
              e = !0;
            }
          );
        }, []);
        let m = (0, o.useMemo)(
          () => ({ flags: t, loading: s, error: u }),
          [t, s, u],
        );
        return (0, a.jsx)(i.Provider, { value: m, children: r });
      }
      function s(e) {
        let r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: t, loading: a } = (function () {
            let e = (0, o.useContext)(i);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (a || !t) return r;
        let n = t[e];
        return !!n && !!n.enabled;
      }
    },
    3551: function (e, r, t) {
      "use strict";
      t.d(r, {
        F: function () {
          return l;
        },
        ThemeProvider: function () {
          return s;
        },
      });
      var a = t(7437),
        o = t(2265),
        n = t(3429),
        i = t(728);
      let d = (0, o.createContext)(void 0);
      function s(e) {
        let { children: r } = e,
          { user: t } = (0, n.a)(),
          { activeMode: s } = (0, i.r)(),
          l = null == t ? void 0 : t.role,
          u = (0, o.useMemo)(
            () =>
              "admin" === l
                ? "sacco"
                : "driver" === l && "driver" === s
                  ? "driver"
                  : l
                    ? "passenger"
                    : "generic",
            [l, s],
          ),
          c = (0, o.useMemo)(() => {
            let e = "passenger" === u || "generic" === u,
              r = "driver" === u,
              t = "sacco" === u;
            return {
              variant: u,
              isPassenger: e,
              isDriver: r,
              isSacco: t,
              headerBgClass: r
                ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-mint/20 via-radaa-teal/15 to-radaa-gold/10 backdrop-blur"
                : t
                  ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-gold/20 via-radaa-orange/15 to-radaa-mint/10 backdrop-blur"
                  : "border-b border-slate-800/70 bg-gradient-to-r from-radaa-blue/25 via-radaa-purple/20 to-radaa-mint/10 backdrop-blur",
              primaryButtonClass: r
                ? "radaa-btn-primary bg-gradient-to-r from-radaa-mint to-radaa-teal shadow-glow-mint"
                : t
                  ? "radaa-btn-primary bg-gradient-to-r from-radaa-gold to-radaa-orange shadow-glow-blue"
                  : "radaa-btn-primary bg-gradient-to-r from-radaa-blue to-radaa-purple shadow-glow-blue",
              subtleButtonClass: "radaa-btn-secondary",
              cardSurfaceClass: r
                ? "radaa-card border-radaa-mint/40"
                : t
                  ? "radaa-card border-radaa-gold/40"
                  : "radaa-card",
            };
          }, [u]);
        return (0, a.jsx)(d.Provider, { value: c, children: r });
      }
      function l() {
        let e = (0, o.useContext)(d);
        if (!e) throw Error("useTheme must be used within a ThemeProvider");
        return e;
      }
    },
    728: function (e, r, t) {
      "use strict";
      t.d(r, {
        RealtimeProvider: function () {
          return c;
        },
        r: function () {
          return m;
        },
      });
      var a = t(7437),
        o = t(2265),
        n = t(3901),
        i = t(4876),
        d = t(3429);
      let s = "radaa_active_mode";
      function l() {
        try {
          let e = window.localStorage.getItem(s);
          if ("driver" === e || "passenger" === e) return e;
        } catch (e) {
          console.error("[realtime] failed to read mode from storage", e);
        }
        return "passenger";
      }
      let u = (0, o.createContext)(void 0);
      function c(e) {
        let { children: r } = e,
          { connect: t, on: c, off: m, emit: f } = (0, n.s)(),
          { addNotification: g } = (0, i.z)(),
          { user: v, token: b } = (0, d.a)(),
          [p, h] = (0, o.useState)([]),
          [w, y] = (0, o.useState)(null),
          [C, P] = (0, o.useState)(() => l()),
          [_, S] = (0, o.useState)(() => "driver" === l());
        (0, o.useEffect)(() => {
          t(b);
          let e = (e) => {
              let r = Array.isArray(e) ? e : [e];
              h((e) => {
                let t = new Map();
                return (
                  e.forEach((e) => {
                    t.set(e.id, e);
                  }),
                  r.forEach((e) => {
                    if (!e || !e.id) return;
                    let r = t.get(e.id) || { id: e.id };
                    t.set(e.id, { ...r, ...e });
                  }),
                  Array.from(t.values())
                );
              });
            },
            r = (e) => {
              if (!e) return;
              y(e);
              let r = e.matatuPlate || e.matatuName || e.matatuNumberPlate;
              g({
                type: "trip",
                title: "New ride assigned",
                message: r
                  ? "A new ride was assigned to ".concat(r, ".")
                  : "A new ride was assigned.",
              });
            },
            a = (e) => {
              e &&
                g({
                  type: "trip",
                  title: "New ride created",
                  message: "A passenger just created a new ride request.",
                });
            },
            o = (e) => {
              g({
                type: "system",
                title: "SACCO stats updated",
                message: "Live SACCO metrics were updated.",
              });
            },
            n = (e) => {};
          return (
            c("matatus:live_update", e),
            c("matatu:live_update", e),
            c("ride:assigned", r),
            c("ride:created", a),
            c("sacco:update", o),
            c("passenger:live_update", n),
            () => {
              (m("matatus:live_update", e),
                m("matatu:live_update", e),
                m("ride:assigned", r),
                m("ride:created", a),
                m("sacco:update", o),
                m("passenger:live_update", n));
            }
          );
        }, [t, c, m, g, b]);
        let E = (0, o.useCallback)(
          (e) => {
            S(e);
            let r = e ? "driver" : "passenger";
            (P(r), f(e ? "driver:online" : "driver:offline", { online: e }));
            try {
              window.localStorage.setItem(s, r);
            } catch (e) {
              console.error("[realtime] failed to persist mode to storage", e);
            }
            console.log("[realtime] setDriverOnline", { online: e, mode: r });
          },
          [f],
        );
        (0, o.useEffect)(() => {
          if (!v) return;
          let e = null;
          try {
            e = window.localStorage.getItem(s);
          } catch (e) {
            console.error(
              "[realtime] failed to read mode from storage for role init",
              e,
            );
          }
          "driver" !== e &&
            "passenger" !== e &&
            ("driver" === (null == v ? void 0 : v.role) ? E(!0) : E(!1));
        }, [v, E]);
        let x = (0, o.useMemo)(
          () => ({
            matatus: p,
            lastRideAssigned: w,
            driverOnline: _,
            setDriverOnline: E,
            activeMode: C,
          }),
          [p, w, _, E, C],
        );
        return (0, a.jsx)(u.Provider, { value: x, children: r });
      }
      function m() {
        let e = (0, o.useContext)(u);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
      }
    },
    8877: function () {},
  },
  function (e) {
    (e.O(0, [404, 472, 40, 401, 971, 23, 744], function () {
      return e((e.s = 2914));
    }),
      (_N_E = e.O()));
  },
]);
