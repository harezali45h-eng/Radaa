(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [32],
  {
    1775: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 2335));
    },
    2335: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return d;
          },
        }));
      var r = a(7437),
        s = a(2265),
        n = a(6463),
        l = a(4876),
        o = a(2858);
      let i =
        a(357).env.NEXT_PUBLIC_API_BASE_URL ||
        "https://radaa-1.onrender.com/api";
      function d() {
        var e, t;
        let a = (0, n.useParams)(),
          d = null == a ? void 0 : a.id,
          { addNotification: c } = (0, l.z)(),
          u = (0, o.N3)("trip_ui_v1", !1),
          [m, p] = (0, s.useState)(null),
          [x, f] = (0, s.useState)(null),
          [h, g] = (0, s.useState)(!0),
          [b, v] = (0, s.useState)(null),
          [y, j] = (0, s.useState)(""),
          [w, N] = (0, s.useState)(""),
          [S, k] = (0, s.useState)(""),
          [E, R] = (0, s.useState)("KES"),
          [P, C] = (0, s.useState)(!1),
          [F, _] = (0, s.useState)(null),
          [I, T] = (0, s.useState)(null),
          [A, O] = (0, s.useState)(null),
          [L, M] = (0, s.useState)(!1);
        ((0, s.useEffect)(() => {
          p(window.localStorage.getItem("radaa_user_id"));
        }, []),
          (0, s.useEffect)(() => {
            if (!m || !d) {
              g(!1);
              return;
            }
            (async () => {
              (g(!0), v(null));
              try {
                let e = await fetch("".concat(i, "/trips/user/").concat(m));
                if (!e.ok) {
                  let t = await e.text();
                  throw Error(t || "Failed to load trip");
                }
                let t = (await e.json()).find((e) => e._id === d) || null;
                if (!t) throw Error("Trip not found for this user");
                f(t);
              } catch (e) {
                v(e instanceof Error ? e.message : "Failed to load trip");
              } finally {
                g(!1);
              }
            })();
          }, [m, d]));
        let U = async (e) => {
            if ((e.preventDefault(), d)) {
              (C(!0), _(null));
              try {
                var t;
                let e = await fetch(
                    "".concat(i, "/trips/").concat(d, "/stop"),
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        lat: y,
                        lng: w,
                        fare: S,
                        currency: E,
                      }),
                    },
                  ),
                  a = await e.json().catch(() => null);
                if (!e.ok) {
                  let e =
                    (a && "object" == typeof a && (a.message || a.error)) ||
                    "Failed to stop trip";
                  throw Error(e);
                }
                (f(a),
                  _("Trip stopped and fare recorded successfully"),
                  c({
                    type: "trip",
                    title: "Trip completed",
                    message:
                      ((null === (t = a.matatu) || void 0 === t
                        ? void 0
                        : t.plate) || "Trip") +
                      (null != a.fare
                        ? " completed with fare ".concat(a.fare)
                        : " completed."),
                  }));
              } catch (e) {
                _(e instanceof Error ? e.message : "Failed to stop trip");
              } finally {
                C(!1);
              }
            }
          },
          Z = (null == x ? void 0 : x.startTime) ? new Date(x.startTime) : null,
          z = (null == x ? void 0 : x.endTime) ? new Date(x.endTime) : null,
          D = u && !h && !b && !!x && "completed" === x.status,
          B = (e) => {
            u && (O(e), M(!0));
          };
        return (0, r.jsxs)("div", {
          className: "space-y-6",
          children: [
            h &&
              (0, r.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children: "Loading trip details...",
              }),
            b &&
              !h &&
              (0, r.jsx)("div", {
                className:
                  "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                children: b,
              }),
            !h &&
              !b &&
              x &&
              (0, r.jsxs)(r.Fragment, {
                children: [
                  (0, r.jsxs)("header", {
                    className: "space-y-1",
                    children: [
                      (0, r.jsx)("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: "Trip details",
                      }),
                      (0, r.jsxs)("p", {
                        className: "text-xs text-slate-300",
                        children: [
                          "Matatu ",
                          (null === (e = x.matatu) || void 0 === e
                            ? void 0
                            : e.plate) || "Unknown",
                          " \xb7 ",
                          (null === (t = x.matatu) || void 0 === t
                            ? void 0
                            : t.route) || "Route not set",
                        ],
                      }),
                      u &&
                        (0, r.jsxs)("div", {
                          className:
                            "mt-2 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[10px] text-slate-200",
                          children: [
                            (0, r.jsx)("span", {
                              className:
                                "ongoing" === x.status
                                  ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                                  : "h-1.5 w-1.5 rounded-full bg-slate-500",
                            }),
                            (0, r.jsxs)("span", {
                              className: "capitalize",
                              children: ["Status: ", x.status],
                            }),
                          ],
                        }),
                    ],
                  }),
                  (0, r.jsxs)("section", {
                    className: "grid gap-4 md:grid-cols-3 text-xs",
                    children: [
                      (0, r.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, r.jsx)("div", {
                            className: "text-slate-400",
                            children: "Status",
                          }),
                          (0, r.jsx)("div", {
                            className: "mt-1 text-slate-100 capitalize",
                            children: x.status,
                          }),
                        ],
                      }),
                      (0, r.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, r.jsx)("div", {
                            className: "text-slate-400",
                            children: "Start time",
                          }),
                          (0, r.jsx)("div", {
                            className: "mt-1 text-slate-100",
                            children: Z ? Z.toLocaleString() : "—",
                          }),
                        ],
                      }),
                      (0, r.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, r.jsx)("div", {
                            className: "text-slate-400",
                            children: "End time",
                          }),
                          (0, r.jsx)("div", {
                            className: "mt-1 text-slate-100",
                            children: z ? z.toLocaleString() : "—",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, r.jsxs)("section", {
                    className:
                      "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                    children: [
                      (0, r.jsx)("div", {
                        className: "flex items-center justify-between",
                        children: (0, r.jsxs)("div", {
                          children: [
                            (0, r.jsx)("h2", {
                              className: "text-sm font-semibold text-slate-100",
                              children: "Fare and completion",
                            }),
                            (0, r.jsx)("p", {
                              className: "text-[11px] text-slate-400",
                              children:
                                "If this trip is still ongoing, you can stop it and record the fare amount.",
                            }),
                          ],
                        }),
                      }),
                      F &&
                        (0, r.jsx)("div", {
                          className:
                            "rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-200",
                          children: F,
                        }),
                      "ongoing" === x.status
                        ? (0, r.jsxs)("form", {
                            onSubmit: U,
                            className:
                              "grid gap-3 md:grid-cols-[repeat(4,minmax(0,1fr)),auto]",
                            children: [
                              u &&
                                (0, r.jsxs)("div", {
                                  className: "space-y-1 md:col-span-4",
                                  children: [
                                    (0, r.jsx)("button", {
                                      type: "button",
                                      onClick: () => {
                                        if (!navigator.geolocation) {
                                          T(
                                            "Geolocation is not available in this browser.",
                                          );
                                          return;
                                        }
                                        (T("Detecting your current location…"),
                                          navigator.geolocation.getCurrentPosition(
                                            (e) => {
                                              (j(String(e.coords.latitude)),
                                                N(String(e.coords.longitude)),
                                                T(
                                                  "Location captured. You can adjust it before stopping the trip.",
                                                ));
                                            },
                                            (e) => {
                                              T(
                                                (null == e
                                                  ? void 0
                                                  : e.message) ||
                                                  "Unable to determine your current location.",
                                              );
                                            },
                                            {
                                              enableHighAccuracy: !0,
                                              timeout: 1e4,
                                            },
                                          ));
                                      },
                                      className:
                                        "inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/15 px-3 py-1.5 text-[11px] font-medium text-sky-100 shadow-sm transition hover:border-sky-400 hover:bg-sky-600/25",
                                      children:
                                        "Use my current location for end point",
                                    }),
                                    I &&
                                      (0, r.jsx)("p", {
                                        className: "text-[11px] text-slate-400",
                                        children: I,
                                      }),
                                  ],
                                }),
                              (0, r.jsxs)("div", {
                                className: "space-y-1",
                                children: [
                                  (0, r.jsx)("label", {
                                    htmlFor: "lat",
                                    className:
                                      "text-[11px] font-medium text-slate-100",
                                    children: "End latitude",
                                  }),
                                  (0, r.jsx)("input", {
                                    id: "lat",
                                    type: "number",
                                    step: "0.0001",
                                    required: !0,
                                    value: y,
                                    onChange: (e) => j(e.target.value),
                                    className:
                                      "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                    placeholder: "-1.2864",
                                  }),
                                ],
                              }),
                              (0, r.jsxs)("div", {
                                className: "space-y-1",
                                children: [
                                  (0, r.jsx)("label", {
                                    htmlFor: "lng",
                                    className:
                                      "text-[11px] font-medium text-slate-100",
                                    children: "End longitude",
                                  }),
                                  (0, r.jsx)("input", {
                                    id: "lng",
                                    type: "number",
                                    step: "0.0001",
                                    required: !0,
                                    value: w,
                                    onChange: (e) => N(e.target.value),
                                    className:
                                      "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                    placeholder: "36.8219",
                                  }),
                                ],
                              }),
                              (0, r.jsxs)("div", {
                                className: "space-y-1",
                                children: [
                                  (0, r.jsx)("label", {
                                    htmlFor: "fare",
                                    className:
                                      "text-[11px] font-medium text-slate-100",
                                    children: "Fare amount",
                                  }),
                                  (0, r.jsx)("input", {
                                    id: "fare",
                                    type: "number",
                                    step: "1",
                                    min: "0",
                                    required: !0,
                                    value: S,
                                    onChange: (e) => k(e.target.value),
                                    className:
                                      "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                    placeholder: "80",
                                  }),
                                ],
                              }),
                              (0, r.jsxs)("div", {
                                className: "space-y-1",
                                children: [
                                  (0, r.jsx)("label", {
                                    htmlFor: "currency",
                                    className:
                                      "text-[11px] font-medium text-slate-100",
                                    children: "Currency",
                                  }),
                                  (0, r.jsx)("input", {
                                    id: "currency",
                                    type: "text",
                                    value: E,
                                    onChange: (e) => R(e.target.value),
                                    className:
                                      "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                  }),
                                ],
                              }),
                              (0, r.jsx)("div", {
                                className: "flex items-end",
                                children: (0, r.jsx)("button", {
                                  type: "submit",
                                  disabled: P,
                                  className:
                                    "inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                                  children: P
                                    ? "Stopping trip..."
                                    : "Stop trip",
                                }),
                              }),
                            ],
                          })
                        : (0, r.jsxs)("div", {
                            className: "text-[11px] text-slate-300",
                            children: [
                              "This trip has already been completed. Fare: ",
                              null != x.fare ? "".concat(x.fare, " ") : "",
                              x.currency ||
                                (null != x.fare ? "KES" : "") ||
                                "—",
                              ".",
                            ],
                          }),
                    ],
                  }),
                  D &&
                    (0, r.jsxs)("section", {
                      className:
                        "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                      children: [
                        (0, r.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, r.jsxs)("div", {
                              children: [
                                (0, r.jsx)("h2", {
                                  className:
                                    "text-sm font-semibold text-slate-100",
                                  children: "Rate this trip",
                                }),
                                (0, r.jsx)("p", {
                                  className: "text-[11px] text-slate-400",
                                  children:
                                    "How was your ride? This rating helps us tune future experiments and UX.",
                                }),
                              ],
                            }),
                            L &&
                              null != A &&
                              (0, r.jsxs)("span", {
                                className:
                                  "rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-300",
                                children: ["Thanks for rating ", A, "/5"],
                              }),
                          ],
                        }),
                        (0, r.jsx)("div", {
                          className: "flex items-center gap-2",
                          children: [1, 2, 3, 4, 5].map((e) => {
                            let t = null != A && e <= A;
                            return (0, r.jsx)(
                              "button",
                              {
                                type: "button",
                                onClick: () => B(e),
                                className:
                                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ".concat(
                                    t
                                      ? "border-amber-400 bg-amber-500/20 text-amber-300"
                                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800",
                                  ),
                                "aria-label": "Rate this trip "
                                  .concat(e, " star")
                                  .concat(e > 1 ? "s" : ""),
                                children: (0, r.jsx)("span", { children: "★" }),
                              },
                              e,
                            );
                          }),
                        }),
                      ],
                    }),
                ],
              }),
          ],
        });
      }
    },
    2858: function (e, t, a) {
      "use strict";
      a.d(t, {
        FeatureFlagProvider: function () {
          return o;
        },
        N3: function () {
          return i;
        },
      });
      var r = a(7437),
        s = a(2265),
        n = a(542);
      let l = (0, s.createContext)(void 0);
      function o(e) {
        let { children: t } = e,
          [a, o] = (0, s.useState)(null),
          [i, d] = (0, s.useState)(!0),
          [c, u] = (0, s.useState)(null);
        (0, s.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (d(!0), u(null));
              try {
                let t = await (0, n.BZ)();
                if (e) return;
                t && "object" == typeof t ? o(t) : o({});
              } catch (t) {
                if (e) return;
                (o({}),
                  u(
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
        let m = (0, s.useMemo)(
          () => ({ flags: a, loading: i, error: c }),
          [a, i, c],
        );
        return (0, r.jsx)(l.Provider, { value: m, children: t });
      }
      function i(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: a, loading: r } = (function () {
            let e = (0, s.useContext)(l);
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
    4876: function (e, t, a) {
      "use strict";
      a.d(t, {
        NotificationProvider: function () {
          return o;
        },
        z: function () {
          return i;
        },
      });
      var r = a(7437),
        s = a(2265),
        n = a(5040);
      let l = (0, s.createContext)(void 0);
      function o(e) {
        let { children: t } = e,
          [a, o] = (0, s.useState)([]),
          i = (0, s.useCallback)((e) => {
            o((t) => [
              {
                id: ""
                  .concat(Date.now(), "-")
                  .concat(Math.random().toString(36).slice(2)),
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
            o((e) => e.map((e) => ({ ...e, read: !0 })));
          }, []),
          c = (0, s.useCallback)((e) => {
            o((t) => t.map((t) => (t.id === e ? { ...t, read: !0 } : t)));
          }, []),
          u = (0, s.useMemo)(() => a.filter((e) => !e.read).length, [a]);
        (0, s.useEffect)(() => {
          let e;
          let t = "wss://radaa-1.onrender.com";
          if (!t) return;
          let a = "".concat(t.replace(/\/+$/, ""), "/realtime");
          {
            let t =
              window.localStorage.getItem("token") ||
              window.sessionStorage.getItem("token");
            t && "string" == typeof t && (e = { token: t });
          }
          if (!e) return;
          let r = (0, n.io)(a, {
            transports: ["websocket"],
            path: "/socket.io",
            auth: e,
          });
          return (
            r.on("matatu:update", (e) => {
              let t =
                  (null == e ? void 0 : e.plate) ||
                  (null == e ? void 0 : e.numberPlate) ||
                  "Matatu",
                a = null == e ? void 0 : e.route;
              i({
                type: "matatu",
                title: "Matatu location update",
                message: a
                  ? ""
                      .concat(t, " on route ")
                      .concat(a, " reported a new location.")
                  : "".concat(t, " reported a new location."),
              });
            }),
            r.on("connect_error", () => {
              i({
                type: "system",
                title: "Realtime temporarily unavailable",
                message:
                  "Socket connection failed. Live notifications may be delayed.",
              });
            }),
            () => {
              r.disconnect();
            }
          );
        }, [i]);
        let m = (0, s.useMemo)(
          () => ({
            notifications: a,
            unreadCount: u,
            addNotification: i,
            markAllAsRead: d,
            markAsRead: c,
          }),
          [a, u, i, d, c],
        );
        return (0, r.jsx)(l.Provider, { value: m, children: t });
      }
      function i() {
        let e = (0, s.useContext)(l);
        if (!e)
          throw Error(
            "useNotifications must be used within a NotificationProvider",
          );
        return e;
      }
    },
    542: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return l;
        },
        BZ: function () {
          return d;
        },
        Nj: function () {
          return o;
        },
        GX: function () {
          return c;
        },
        Yf: function () {
          return i;
        },
        eg: function () {
          return u;
        },
        m5: function () {
          return m;
        },
      });
      var r = a(8472);
      let s = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (s && (r.Z.defaults.baseURL = s),
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
        l = n;
      let o = async () => {
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
    (e.O(0, [472, 40, 971, 23, 744], function () {
      return e((e.s = 1775));
    }),
      (_N_E = e.O()));
  },
]);
