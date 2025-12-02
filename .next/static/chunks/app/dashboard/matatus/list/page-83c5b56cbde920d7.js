(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [159],
  {
    9555: function (e, t, s) {
      Promise.resolve().then(s.bind(s, 6347));
    },
    6347: function (e, t, s) {
      "use strict";
      (s.r(t),
        s.d(t, {
          default: function () {
            return n;
          },
        }));
      var a = s(7437),
        l = s(2265),
        r = s(7138);
      function n() {
        let [e, t] = (0, l.useState)([]),
          [s, n] = (0, l.useState)(!0),
          [d, i] = (0, l.useState)(null);
        return (
          (0, l.useEffect)(() => {
            (async () => {
              (n(!0), i(null));
              try {
                let e = await fetch(
                  "".concat(
                    "https://radaa-1.onrender.com/api",
                    "/matatus/live",
                  ),
                );
                if (!e.ok) {
                  let t = await e.text();
                  throw Error(t || "Failed to load matatus");
                }
                let s = await e.json();
                t(s);
              } catch (e) {
                i(e instanceof Error ? e.message : "Failed to load matatus");
              } finally {
                n(!1);
              }
            })();
          }, []),
          (0, a.jsxs)("div", {
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
                        children: "Matatus",
                      }),
                      (0, a.jsx)("p", {
                        className: "text-xs text-slate-300",
                        children:
                          "View all matatus that are currently online. Register new vehicles and drill into individual records.",
                      }),
                    ],
                  }),
                  (0, a.jsx)(r.default, {
                    href: "/dashboard/matatus/create",
                    className:
                      "inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500",
                    children: "Register matatu",
                  }),
                ],
              }),
              s &&
                (0, a.jsx)("div", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                  children: "Loading matatus...",
                }),
              d &&
                (0, a.jsx)("div", {
                  className:
                    "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                  children: d,
                }),
              !s &&
                !d &&
                0 === e.length &&
                (0, a.jsx)("div", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                  children:
                    "No matatus are currently online. As vehicles start sending location updates, they will appear here.",
                }),
              !s &&
                !d &&
                e.length > 0 &&
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
                              children: "Plate",
                            }),
                            (0, a.jsx)("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Route",
                            }),
                            (0, a.jsx)("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Sacco",
                            }),
                            (0, a.jsx)("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Driver",
                            }),
                            (0, a.jsx)("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Status",
                            }),
                            (0, a.jsx)("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Last location",
                            }),
                            (0, a.jsx)("th", {
                              className: "px-3 py-2 text-right font-medium",
                              children: "Actions",
                            }),
                          ],
                        }),
                      }),
                      (0, a.jsx)("tbody", {
                        children: e.map((e) => {
                          var t, s;
                          return (0, a.jsxs)(
                            "tr",
                            {
                              className: "border-t border-slate-800/80",
                              children: [
                                (0, a.jsx)("td", {
                                  className: "px-3 py-2 text-slate-100",
                                  children: e.plate,
                                }),
                                (0, a.jsx)("td", {
                                  className: "px-3 py-2 text-slate-200",
                                  children: e.route,
                                }),
                                (0, a.jsx)("td", {
                                  className: "px-3 py-2 text-slate-300",
                                  children: e.sacco || "—",
                                }),
                                (0, a.jsx)("td", {
                                  className: "px-3 py-2 text-slate-300",
                                  children: e.driverName
                                    ? (0, a.jsxs)("span", {
                                        children: [
                                          e.driverName,
                                          e.driverPhone
                                            ? (0, a.jsxs)("span", {
                                                className: "text-slate-500",
                                                children: [
                                                  " \xb7 ",
                                                  e.driverPhone,
                                                ],
                                              })
                                            : null,
                                        ],
                                      })
                                    : "—",
                                }),
                                (0, a.jsx)("td", {
                                  className: "px-3 py-2 text-slate-300",
                                  children: e.isOnline
                                    ? (0, a.jsxs)("span", {
                                        className:
                                          "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300",
                                        children: [
                                          (0, a.jsx)("span", {
                                            className:
                                              "h-1.5 w-1.5 rounded-full bg-emerald-400",
                                          }),
                                          " Online",
                                        ],
                                      })
                                    : (0, a.jsx)("span", {
                                        className:
                                          "inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300",
                                        children: "Offline",
                                      }),
                                }),
                                (0, a.jsx)("td", {
                                  className: "px-3 py-2 text-slate-300",
                                  children:
                                    (null === (t = e.location) || void 0 === t
                                      ? void 0
                                      : t.lat) != null &&
                                    (null === (s = e.location) || void 0 === s
                                      ? void 0
                                      : s.lng) != null
                                      ? ""
                                          .concat(
                                            e.location.lat.toFixed(4),
                                            ", ",
                                          )
                                          .concat(e.location.lng.toFixed(4))
                                      : "—",
                                }),
                                (0, a.jsx)("td", {
                                  className: "px-3 py-2 text-right",
                                  children: (0, a.jsx)(r.default, {
                                    href: "/dashboard/matatus/".concat(e._id),
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
          })
        );
      }
    },
  },
  function (e) {
    (e.O(0, [138, 971, 23, 744], function () {
      return e((e.s = 9555));
    }),
      (_N_E = e.O()));
  },
]);
