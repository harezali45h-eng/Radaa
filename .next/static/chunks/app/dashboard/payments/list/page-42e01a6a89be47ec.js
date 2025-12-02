(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [19],
  {
    7116: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 5399));
    },
    5399: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return o;
          },
        }));
      var s = a(7437),
        r = a(2265),
        l = a(7138),
        d = a(542);
      let n =
        a(357).env.NEXT_PUBLIC_API_BASE_URL ||
        "https://radaa-1.onrender.com/api";
      function o() {
        var e, t, a, o, i;
        let [c, x] = (0, r.useState)(null),
          [u, m] = (0, r.useState)(null),
          [h, p] = (0, r.useState)([]),
          [f, v] = (0, r.useState)(!0),
          [y, b] = (0, r.useState)(null);
        ((0, r.useEffect)(() => {
          x(window.localStorage.getItem("radaa_user_id"));
        }, []),
          (0, r.useEffect)(() => {
            if (!c) {
              v(!1);
              return;
            }
            (async () => {
              (v(!0), b(null));
              try {
                let [e, t] = await Promise.all([
                  (0, d.GX)(c),
                  fetch("".concat(n, "/trips/user/").concat(c)),
                ]);
                if ((m(e), !t.ok)) {
                  let e = await t.text();
                  throw Error(e || "Failed to load trips");
                }
                let a = await t.json();
                p(a);
              } catch (e) {
                b(
                  e instanceof Error
                    ? e.message
                    : "Failed to load payment data",
                );
              } finally {
                v(!1);
              }
            })();
          }, [c]));
        let j = h.filter((e) => "completed" === e.status && null != e.fare);
        return (0, s.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, s.jsxs)("header", {
              className: "space-y-2",
              children: [
                (0, s.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Payments",
                }),
                (0, s.jsx)("p", {
                  className: "text-xs text-slate-300",
                  children:
                    "View a ledger of completed trips and the fares that were charged. Loyalty and balance data comes directly from the backend.",
                }),
              ],
            }),
            !c &&
              !f &&
              (0, s.jsx)("div", {
                className:
                  "rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100",
                children:
                  "No user ID found. Make sure you are logged in via the auth screens before viewing payments.",
              }),
            f &&
              (0, s.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children: "Loading payments data...",
              }),
            y &&
              (0, s.jsx)("div", {
                className:
                  "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                children: y,
              }),
            u &&
              !f &&
              !y &&
              (0, s.jsxs)("section", {
                className: "grid gap-4 md:grid-cols-4 text-xs",
                children: [
                  (0, s.jsxs)("div", {
                    className:
                      "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                    children: [
                      (0, s.jsx)("div", {
                        className: "text-slate-400",
                        children: "Balance",
                      }),
                      (0, s.jsxs)("div", {
                        className:
                          "mt-1 text-lg font-semibold text-emerald-400",
                        children: [
                          "KES ",
                          null !== (t = u.balance) && void 0 !== t ? t : 0,
                        ],
                      }),
                    ],
                  }),
                  (0, s.jsxs)("div", {
                    className:
                      "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                    children: [
                      (0, s.jsx)("div", {
                        className: "text-slate-400",
                        children: "Rides paid",
                      }),
                      (0, s.jsx)("div", {
                        className: "mt-1 text-lg font-semibold text-slate-100",
                        children:
                          null !== (a = u.ridesPaid) && void 0 !== a ? a : 0,
                      }),
                    ],
                  }),
                  (0, s.jsxs)("div", {
                    className:
                      "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                    children: [
                      (0, s.jsx)("div", {
                        className: "text-slate-400",
                        children: "Loyalty points",
                      }),
                      (0, s.jsx)("div", {
                        className: "mt-1 text-lg font-semibold text-slate-100",
                        children:
                          null !== (o = u.loyaltyPoints) && void 0 !== o
                            ? o
                            : 0,
                      }),
                    ],
                  }),
                  (0, s.jsxs)("div", {
                    className:
                      "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                    children: [
                      (0, s.jsx)("div", {
                        className: "text-slate-400",
                        children: "Free rides",
                      }),
                      (0, s.jsx)("div", {
                        className: "mt-1 text-lg font-semibold text-amber-300",
                        children:
                          null !==
                            (i =
                              null === (e = u.loyalty) || void 0 === e
                                ? void 0
                                : e.freeRides) && void 0 !== i
                            ? i
                            : 0,
                      }),
                    ],
                  }),
                ],
              }),
            !f &&
              !y &&
              j.length > 0 &&
              (0, s.jsxs)("section", {
                className: "space-y-3",
                children: [
                  (0, s.jsxs)("div", {
                    className: "flex items-center justify-between",
                    children: [
                      (0, s.jsx)("h2", {
                        className: "text-sm font-semibold text-slate-100",
                        children: "Completed payments",
                      }),
                      (0, s.jsx)("p", {
                        className: "text-[11px] text-slate-400",
                        children:
                          "Each row represents a completed trip with a fare recorded on the backend.",
                      }),
                    ],
                  }),
                  (0, s.jsx)("div", {
                    className:
                      "overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80",
                    children: (0, s.jsxs)("table", {
                      className: "min-w-full border-collapse text-xs",
                      children: [
                        (0, s.jsx)("thead", {
                          className: "bg-slate-900/80 text-slate-300",
                          children: (0, s.jsxs)("tr", {
                            children: [
                              (0, s.jsx)("th", {
                                className: "px-3 py-2 text-left font-medium",
                                children: "Matatu",
                              }),
                              (0, s.jsx)("th", {
                                className: "px-3 py-2 text-left font-medium",
                                children: "Route",
                              }),
                              (0, s.jsx)("th", {
                                className: "px-3 py-2 text-left font-medium",
                                children: "Start",
                              }),
                              (0, s.jsx)("th", {
                                className: "px-3 py-2 text-left font-medium",
                                children: "End",
                              }),
                              (0, s.jsx)("th", {
                                className: "px-3 py-2 text-left font-medium",
                                children: "Fare",
                              }),
                              (0, s.jsx)("th", {
                                className: "px-3 py-2 text-right font-medium",
                                children: "Detail",
                              }),
                            ],
                          }),
                        }),
                        (0, s.jsx)("tbody", {
                          children: j.map((e) => {
                            var t, a;
                            let r = e.startTime ? new Date(e.startTime) : null,
                              d = e.endTime ? new Date(e.endTime) : null;
                            return (0, s.jsxs)(
                              "tr",
                              {
                                className: "border-t border-slate-800/80",
                                children: [
                                  (0, s.jsx)("td", {
                                    className: "px-3 py-2 text-slate-100",
                                    children:
                                      (null === (t = e.matatu) || void 0 === t
                                        ? void 0
                                        : t.plate) || "Unknown",
                                  }),
                                  (0, s.jsx)("td", {
                                    className: "px-3 py-2 text-slate-300",
                                    children:
                                      (null === (a = e.matatu) || void 0 === a
                                        ? void 0
                                        : a.route) || "—",
                                  }),
                                  (0, s.jsx)("td", {
                                    className: "px-3 py-2 text-slate-300",
                                    children: r ? r.toLocaleString() : "—",
                                  }),
                                  (0, s.jsx)("td", {
                                    className: "px-3 py-2 text-slate-300",
                                    children: d ? d.toLocaleString() : "—",
                                  }),
                                  (0, s.jsx)("td", {
                                    className: "px-3 py-2 text-slate-300",
                                    children:
                                      null != e.fare
                                        ? ""
                                            .concat(e.fare, " ")
                                            .concat(e.currency || "KES")
                                        : "—",
                                  }),
                                  (0, s.jsx)("td", {
                                    className: "px-3 py-2 text-right",
                                    children: (0, s.jsx)(l.default, {
                                      href: "/dashboard/payments/".concat(
                                        e._id,
                                      ),
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
              }),
            !f &&
              !y &&
              0 === j.length &&
              c &&
              (0, s.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children:
                  "No completed trips with fares recorded yet. Once you stop trips with a fare, they will appear here as payments.",
              }),
          ],
        });
      }
    },
    542: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return d;
        },
        BZ: function () {
          return i;
        },
        Nj: function () {
          return n;
        },
        GX: function () {
          return c;
        },
        Yf: function () {
          return o;
        },
        eg: function () {
          return x;
        },
        m5: function () {
          return u;
        },
      });
      var s = a(8472);
      let r = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (r && (s.Z.defaults.baseURL = r),
        (s.Z.defaults.withCredentials = !0),
        s.Z.interceptors.request.use((e) => {
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
      var l = s.Z,
        d = l;
      let n = async () => {
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
        o = async () => {
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
        i = async () => {
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
        x = async (e) => {
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
        u = async (e) => {
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
      return e((e.s = 7116));
    }),
      (_N_E = e.O()));
  },
]);
