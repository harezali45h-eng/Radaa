(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [765],
  {
    9733: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 8725));
    },
    8725: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return i;
          },
        }));
      var a = r(7437),
        s = r(2265),
        l = r(7138),
        n = r(2858);
      function i() {
        let [e, t] = (0, s.useState)(null),
          [r, i] = (0, s.useState)([]),
          [d, o] = (0, s.useState)(!0),
          [c, u] = (0, s.useState)(null),
          x = (0, n.N3)("trip_ui_v1", !1);
        ((0, s.useEffect)(() => {
          t(window.localStorage.getItem("radaa_user_id"));
        }, []),
          (0, s.useEffect)(() => {
            if (!e) {
              o(!1);
              return;
            }
            (async () => {
              (o(!0), u(null));
              try {
                let t = await fetch(
                  ""
                    .concat("https://radaa-1.onrender.com/api", "/trips/user/")
                    .concat(e),
                );
                if (!t.ok) {
                  let e = await t.text();
                  throw Error(e || "Failed to load trips");
                }
                let r = await t.json();
                i(r);
              } catch (e) {
                u(e instanceof Error ? e.message : "Failed to load trips");
              } finally {
                o(!1);
              }
            })();
          }, [e]));
        let h = r.length,
          m = r.filter((e) => "completed" === e.status).length,
          p = r.filter((e) => "ongoing" === e.status).length,
          f = r.reduce((e, t) => {
            let r = t.endTime || t.startTime;
            if (!r) return e;
            let a = new Date(r);
            return !e || a > e ? a : e;
          }, null);
        return (0, a.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, a.jsxs)("header", {
              className:
                "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
              children: [
                (0, a.jsxs)("div", {
                  children: [
                    (0, a.jsx)("h1", {
                      className: "text-2xl font-semibold tracking-tight",
                      children: "Trips",
                    }),
                    (0, a.jsx)("p", {
                      className: "text-xs text-slate-300",
                      children:
                        "Browse your trip history. Each completed trip is tied to a fare payment and loyalty update.",
                    }),
                  ],
                }),
                (0, a.jsx)(l.default, {
                  href: "/dashboard/trips/create",
                  className:
                    "inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500",
                  children: "Start new trip",
                }),
              ],
            }),
            x &&
              !d &&
              !c &&
              h > 0 &&
              (0, a.jsxs)("section", {
                className:
                  "grid gap-3 text-[11px] text-slate-200 md:grid-cols-3",
                children: [
                  (0, a.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, a.jsx)("div", {
                        className: "text-slate-400",
                        children: "Total trips",
                      }),
                      (0, a.jsx)("div", {
                        className: "mt-0.5 text-sm font-semibold text-slate-50",
                        children: h,
                      }),
                    ],
                  }),
                  (0, a.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, a.jsx)("div", {
                        className: "text-slate-400",
                        children: "Completed",
                      }),
                      (0, a.jsx)("div", {
                        className:
                          "mt-0.5 text-sm font-semibold text-emerald-300",
                        children: m,
                      }),
                    ],
                  }),
                  (0, a.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, a.jsx)("div", {
                        className: "text-slate-400",
                        children: "Ongoing",
                      }),
                      (0, a.jsx)("div", {
                        className:
                          "mt-0.5 text-sm font-semibold text-amber-300",
                        children: p,
                      }),
                      f &&
                        (0, a.jsxs)("div", {
                          className: "mt-1 text-[10px] text-slate-400",
                          children: ["Last trip: ", f.toLocaleString()],
                        }),
                    ],
                  }),
                ],
              }),
            !e &&
              !d &&
              (0, a.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children:
                  "No user ID found. Make sure you are logged in via the auth screens before viewing trips.",
              }),
            d &&
              (0, a.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children: "Loading trips...",
              }),
            c &&
              (0, a.jsx)("div", {
                className:
                  "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                children: c,
              }),
            !d &&
              !c &&
              0 === r.length &&
              e &&
              (0, a.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children:
                  "No trips found yet. Start a new trip to see it appear here.",
              }),
            !d &&
              !c &&
              r.length > 0 &&
              (0, a.jsx)("div", {
                className:
                  "overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80",
                children: (0, a.jsxs)("table", {
                  className: "min-w-full border-collapse text-xs",
                  children: [
                    (0, a.jsx)("thead", {
                      className: "bg-slate-900/80 text-slate-300",
                      children: (0, a.jsxs)("tr", {
                        children: [
                          (0, a.jsx)("th", {
                            className: "px-3 py-2 text-left font-medium",
                            children: "Matatu",
                          }),
                          (0, a.jsx)("th", {
                            className: "px-3 py-2 text-left font-medium",
                            children: "Route",
                          }),
                          (0, a.jsx)("th", {
                            className: "px-3 py-2 text-left font-medium",
                            children: "Start",
                          }),
                          (0, a.jsx)("th", {
                            className: "px-3 py-2 text-left font-medium",
                            children: "End",
                          }),
                          (0, a.jsx)("th", {
                            className: "px-3 py-2 text-left font-medium",
                            children: "Fare",
                          }),
                          (0, a.jsx)("th", {
                            className: "px-3 py-2 text-left font-medium",
                            children: "Status",
                          }),
                          (0, a.jsx)("th", {
                            className: "px-3 py-2 text-right font-medium",
                            children: "Actions",
                          }),
                        ],
                      }),
                    }),
                    (0, a.jsx)("tbody", {
                      children: r.map((e) => {
                        var t, r;
                        let s = e.startTime ? new Date(e.startTime) : null,
                          n = e.endTime ? new Date(e.endTime) : null;
                        return (0, a.jsxs)(
                          "tr",
                          {
                            className: "border-t border-slate-800/80",
                            children: [
                              (0, a.jsx)("td", {
                                className: "px-3 py-2 text-slate-100",
                                children:
                                  (null === (t = e.matatu) || void 0 === t
                                    ? void 0
                                    : t.plate) || "Unknown",
                              }),
                              (0, a.jsx)("td", {
                                className: "px-3 py-2 text-slate-300",
                                children:
                                  (null === (r = e.matatu) || void 0 === r
                                    ? void 0
                                    : r.route) || "—",
                              }),
                              (0, a.jsx)("td", {
                                className: "px-3 py-2 text-slate-300",
                                children: s ? s.toLocaleString() : "—",
                              }),
                              (0, a.jsx)("td", {
                                className: "px-3 py-2 text-slate-300",
                                children: n ? n.toLocaleString() : "—",
                              }),
                              (0, a.jsx)("td", {
                                className: "px-3 py-2 text-slate-300",
                                children:
                                  null != e.fare
                                    ? ""
                                        .concat(e.fare, " ")
                                        .concat(e.currency || "KES")
                                    : "—",
                              }),
                              (0, a.jsx)("td", {
                                className:
                                  "px-3 py-2 text-slate-300 capitalize",
                                children: e.status,
                              }),
                              (0, a.jsx)("td", {
                                className: "px-3 py-2 text-right",
                                children: (0, a.jsx)(l.default, {
                                  href: "/dashboard/trips/".concat(e._id),
                                  className:
                                    "rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 hover:border-sky-500/70 hover:text-sky-200",
                                  children: "View",
                                }),
                              }),
                            ],
                          },
                          e._id,
                        );
                      }),
                    }),
                  ],
                }),
              }),
          ],
        });
      }
    },
    2858: function (e, t, r) {
      "use strict";
      r.d(t, {
        FeatureFlagProvider: function () {
          return i;
        },
        N3: function () {
          return d;
        },
      });
      var a = r(7437),
        s = r(2265),
        l = r(542);
      let n = (0, s.createContext)(void 0);
      function i(e) {
        let { children: t } = e,
          [r, i] = (0, s.useState)(null),
          [d, o] = (0, s.useState)(!0),
          [c, u] = (0, s.useState)(null);
        (0, s.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (o(!0), u(null));
              try {
                let t = await (0, l.BZ)();
                if (e) return;
                t && "object" == typeof t ? i(t) : i({});
              } catch (t) {
                if (e) return;
                (i({}),
                  u(
                    t instanceof Error
                      ? t.message
                      : "Failed to load feature flags",
                  ));
              } finally {
                e || o(!1);
              }
            })(),
            () => {
              e = !0;
            }
          );
        }, []);
        let x = (0, s.useMemo)(
          () => ({ flags: r, loading: d, error: c }),
          [r, d, c],
        );
        return (0, a.jsx)(n.Provider, { value: x, children: t });
      }
      function d(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: r, loading: a } = (function () {
            let e = (0, s.useContext)(n);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (a || !r) return t;
        let l = r[e];
        return !!l && !!l.enabled;
      }
    },
    542: function (e, t, r) {
      "use strict";
      r.d(t, {
        ZP: function () {
          return n;
        },
        BZ: function () {
          return o;
        },
        Nj: function () {
          return i;
        },
        GX: function () {
          return c;
        },
        Yf: function () {
          return d;
        },
        eg: function () {
          return u;
        },
        m5: function () {
          return x;
        },
      });
      var a = r(8472);
      let s = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (s && (a.Z.defaults.baseURL = s),
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
      var l = a.Z,
        n = l;
      let i = async () => {
          try {
            return (await l.get("/matatu-system/live")).data;
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
            let e = (await l.get("/map/markers")).data;
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
        o = async () => {
          try {
            let e = (await l.get("/feature-flags")).data;
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
            return (await l.get("/users/".concat(e, "/loyalty"))).data;
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
            return (await l.post("/payments/initiate", e)).data;
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
        x = async (e) => {
          try {
            return (await l.post("/payments/verify", e)).data;
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
  },
  function (e) {
    (e.O(0, [472, 138, 971, 23, 744], function () {
      return e((e.s = 9733));
    }),
      (_N_E = e.O()));
  },
]);
