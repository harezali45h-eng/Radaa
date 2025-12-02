(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [894],
  {
    5794: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 8442));
    },
    8442: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return i;
          },
        }));
      var a = r(7437),
        s = r(2265),
        n = r(6463),
        o = r(2858);
      let l =
        r(357).env.NEXT_PUBLIC_API_BASE_URL ||
        "https://radaa-1.onrender.com/api";
      function i() {
        let e = (0, n.useRouter)(),
          [t, r] = (0, s.useState)(null),
          [i, d] = (0, s.useState)(""),
          [u, c] = (0, s.useState)(""),
          [m, x] = (0, s.useState)(""),
          [p, h] = (0, s.useState)(!1),
          [f, g] = (0, s.useState)(null),
          [b, y] = (0, s.useState)(null),
          [v, j] = (0, s.useState)(null),
          N = (0, o.N3)("trip_ui_v1", !1);
        (0, s.useEffect)(() => {
          r(window.localStorage.getItem("radaa_user_id"));
        }, []);
        let w = async (r) => {
            if ((r.preventDefault(), t)) {
              (g(null), y(null), h(!0));
              try {
                let r = await fetch("".concat(l, "/trips/start"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: t,
                      matatuId: i,
                      lat: u,
                      lng: m,
                    }),
                  }),
                  a = await r.json().catch(() => null);
                if (!r.ok) {
                  let e =
                    (a && "object" == typeof a && (a.message || a.error)) ||
                    "Failed to start trip";
                  throw Error(e);
                }
                (y("Trip started successfully"),
                  a && a._id && e.push("/dashboard/trips/".concat(a._id)));
              } catch (e) {
                g(e instanceof Error ? e.message : "Failed to start trip");
              } finally {
                h(!1);
              }
            }
          },
          S = p || !t;
        return (0, a.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, a.jsxs)("header", {
              className: "space-y-2",
              children: [
                (0, a.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Start a new trip",
                }),
                (0, a.jsx)("p", {
                  className: "text-xs text-slate-300",
                  children:
                    "Record a new trip by linking a user to a matatu and initial coordinates. You can stop the trip later with the final fare and drop-off location.",
                }),
              ],
            }),
            N &&
              (0, a.jsxs)("section", {
                className:
                  "grid gap-2 text-[11px] text-slate-300 md:grid-cols-3",
                children: [
                  (0, a.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, a.jsx)("div", {
                        className: "text-slate-400",
                        children: "Step 1",
                      }),
                      (0, a.jsx)("div", {
                        className: "mt-0.5 font-semibold text-slate-50",
                        children: "Pick a matatu",
                      }),
                    ],
                  }),
                  (0, a.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, a.jsx)("div", {
                        className: "text-slate-400",
                        children: "Step 2",
                      }),
                      (0, a.jsx)("div", {
                        className: "mt-0.5 font-semibold text-slate-50",
                        children: "Set start location",
                      }),
                    ],
                  }),
                  (0, a.jsxs)("div", {
                    className:
                      "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                    children: [
                      (0, a.jsx)("div", {
                        className: "text-slate-400",
                        children: "Step 3",
                      }),
                      (0, a.jsx)("div", {
                        className: "mt-0.5 font-semibold text-slate-50",
                        children: "Start trip",
                      }),
                    ],
                  }),
                ],
              }),
            !t &&
              (0, a.jsx)("div", {
                className:
                  "rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100",
                children:
                  "No user ID found. Make sure you are logged in via the auth screens before creating trips.",
              }),
            f &&
              (0, a.jsx)("div", {
                className:
                  "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200",
                children: f,
              }),
            b &&
              (0, a.jsx)("div", {
                className:
                  "rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200",
                children: b,
              }),
            (0, a.jsxs)("form", {
              onSubmit: w,
              className:
                "space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
              children: [
                (0, a.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, a.jsx)("label", {
                      htmlFor: "matatuId",
                      className: "text-xs font-medium text-slate-100",
                      children: "Matatu ID",
                    }),
                    (0, a.jsx)("input", {
                      id: "matatuId",
                      type: "text",
                      required: !0,
                      value: i,
                      onChange: (e) => d(e.target.value),
                      className:
                        "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                      placeholder: "Paste a matatu MongoDB ID",
                    }),
                    (0, a.jsx)("p", {
                      className: "text-[11px] text-slate-500",
                      children:
                        "Use the ID from the Matatus list or backend logs while wiring things up.",
                    }),
                  ],
                }),
                N &&
                  (0, a.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      (0, a.jsx)("button", {
                        type: "button",
                        onClick: () => {
                          if (!navigator.geolocation) {
                            j("Geolocation is not available in this browser.");
                            return;
                          }
                          (j("Detecting your current location…"),
                            navigator.geolocation.getCurrentPosition(
                              (e) => {
                                (c(String(e.coords.latitude)),
                                  x(String(e.coords.longitude)),
                                  j(
                                    "Location captured. You can adjust it before starting the trip.",
                                  ));
                              },
                              (e) => {
                                j(
                                  (null == e ? void 0 : e.message) ||
                                    "Unable to determine your current location.",
                                );
                              },
                              { enableHighAccuracy: !0, timeout: 1e4 },
                            ));
                        },
                        className:
                          "inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/15 px-3 py-1.5 text-[11px] font-medium text-sky-100 shadow-sm transition hover:border-sky-400 hover:bg-sky-600/25",
                        children: "Use my current location",
                      }),
                      v &&
                        (0, a.jsx)("p", {
                          className: "text-[11px] text-slate-400",
                          children: v,
                        }),
                    ],
                  }),
                (0, a.jsxs)("div", {
                  className: "grid gap-4 md:grid-cols-2",
                  children: [
                    (0, a.jsxs)("div", {
                      className: "space-y-1",
                      children: [
                        (0, a.jsx)("label", {
                          htmlFor: "lat",
                          className: "text-xs font-medium text-slate-100",
                          children: "Start latitude",
                        }),
                        (0, a.jsx)("input", {
                          id: "lat",
                          type: "number",
                          step: "0.0001",
                          required: !0,
                          value: u,
                          onChange: (e) => c(e.target.value),
                          className:
                            "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "-1.2864",
                        }),
                      ],
                    }),
                    (0, a.jsxs)("div", {
                      className: "space-y-1",
                      children: [
                        (0, a.jsx)("label", {
                          htmlFor: "lng",
                          className: "text-xs font-medium text-slate-100",
                          children: "Start longitude",
                        }),
                        (0, a.jsx)("input", {
                          id: "lng",
                          type: "number",
                          step: "0.0001",
                          required: !0,
                          value: m,
                          onChange: (e) => x(e.target.value),
                          className:
                            "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "36.8219",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, a.jsx)("button", {
                  type: "submit",
                  disabled: S,
                  className:
                    "inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                  children: S
                    ? "Starting trip..."
                    : N
                      ? "Start trip (beta UI)"
                      : "Start trip",
                }),
              ],
            }),
          ],
        });
      }
    },
    2858: function (e, t, r) {
      "use strict";
      r.d(t, {
        FeatureFlagProvider: function () {
          return l;
        },
        N3: function () {
          return i;
        },
      });
      var a = r(7437),
        s = r(2265),
        n = r(542);
      let o = (0, s.createContext)(void 0);
      function l(e) {
        let { children: t } = e,
          [r, l] = (0, s.useState)(null),
          [i, d] = (0, s.useState)(!0),
          [u, c] = (0, s.useState)(null);
        (0, s.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (d(!0), c(null));
              try {
                let t = await (0, n.BZ)();
                if (e) return;
                t && "object" == typeof t ? l(t) : l({});
              } catch (t) {
                if (e) return;
                (l({}),
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
        let m = (0, s.useMemo)(
          () => ({ flags: r, loading: i, error: u }),
          [r, i, u],
        );
        return (0, a.jsx)(o.Provider, { value: m, children: t });
      }
      function i(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: r, loading: a } = (function () {
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
    542: function (e, t, r) {
      "use strict";
      r.d(t, {
        ZP: function () {
          return o;
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
      var n = a.Z,
        o = n;
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
    (e.O(0, [472, 971, 23, 744], function () {
      return e((e.s = 5794));
    }),
      (_N_E = e.O()));
  },
]);
