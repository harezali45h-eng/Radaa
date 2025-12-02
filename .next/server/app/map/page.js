(() => {
  var e = {};
  ((e.id = 883),
    (e.ids = [883]),
    (e.modules = {
      7849: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/action-async-storage.external");
      },
      2934: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/action-async-storage.external.js");
      },
      5403: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/request-async-storage.external");
      },
      4580: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/request-async-storage.external.js");
      },
      4749: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/static-generation-async-storage.external");
      },
      5869: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/static-generation-async-storage.external.js");
      },
      399: (e) => {
        "use strict";
        e.exports = require("next/dist/compiled/next-server/app-page.runtime.prod.js");
      },
      9491: (e) => {
        "use strict";
        e.exports = require("assert");
      },
      4300: (e) => {
        "use strict";
        e.exports = require("buffer");
      },
      2081: (e) => {
        "use strict";
        e.exports = require("child_process");
      },
      6113: (e) => {
        "use strict";
        e.exports = require("crypto");
      },
      2361: (e) => {
        "use strict";
        e.exports = require("events");
      },
      7147: (e) => {
        "use strict";
        e.exports = require("fs");
      },
      3685: (e) => {
        "use strict";
        e.exports = require("http");
      },
      5158: (e) => {
        "use strict";
        e.exports = require("http2");
      },
      5687: (e) => {
        "use strict";
        e.exports = require("https");
      },
      1808: (e) => {
        "use strict";
        e.exports = require("net");
      },
      2037: (e) => {
        "use strict";
        e.exports = require("os");
      },
      1017: (e) => {
        "use strict";
        e.exports = require("path");
      },
      2781: (e) => {
        "use strict";
        e.exports = require("stream");
      },
      4404: (e) => {
        "use strict";
        e.exports = require("tls");
      },
      6224: (e) => {
        "use strict";
        e.exports = require("tty");
      },
      7310: (e) => {
        "use strict";
        e.exports = require("url");
      },
      3837: (e) => {
        "use strict";
        e.exports = require("util");
      },
      9796: (e) => {
        "use strict";
        e.exports = require("zlib");
      },
      6190: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => n.a,
            __next_app__: () => m,
            originalPathname: () => x,
            pages: () => c,
            routeModule: () => u,
            tree: () => o,
          }),
          s(2185),
          s(9406),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var a = s(3191),
          r = s(8716),
          l = s(7922),
          n = s.n(l),
          i = s(5231),
          d = {};
        for (let e in i)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "originalPathname",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (d[e] = () => i[e]);
        s.d(t, d);
        let o = [
            "",
            {
              children: [
                "map",
                {
                  children: [
                    "__PAGE__",
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(s.bind(s, 2185)),
                        "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\map\\page.tsx",
                      ],
                    },
                  ],
                },
                {
                  layout: [
                    () => Promise.resolve().then(s.bind(s, 9406)),
                    "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\map\\layout.tsx",
                  ],
                },
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(s.bind(s, 1799)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\layout.tsx",
              ],
              error: [
                () => Promise.resolve().then(s.bind(s, 6083)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\error.tsx",
              ],
              loading: [
                () => Promise.resolve().then(s.bind(s, 9644)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\loading.tsx",
              ],
              "not-found": [
                () => Promise.resolve().then(s.t.bind(s, 5866, 23)),
                "next/dist/client/components/not-found-error",
              ],
            },
          ],
          c = [
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\map\\page.tsx",
          ],
          x = "/map/page",
          m = { require: s, loadChunk: () => Promise.resolve() },
          u = new a.AppPageRouteModule({
            definition: {
              kind: r.x.APP_PAGE,
              page: "/map/page",
              pathname: "/map",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: o },
          });
      },
      1867: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 8608));
      },
      9150: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 8333));
      },
      8608: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => o }));
        var a = s(326),
          r = s(7577),
          l = s(1264);
        s(6334);
        var n = s(7039),
          i = s(457),
          d = s(4545);
        function o() {
          let { connect: e, on: t, off: s } = (0, l.s)(),
            { driverOnline: o, setDriverOnline: c } = (0, i.r)(),
            x = (0, d.N3)("ui_revamp_v1", !1),
            [m, u] = (0, r.useState)([]),
            [p, h] = (0, r.useState)([]),
            [f, b] = (0, r.useState)(null),
            [g, j] = (0, r.useState)({}),
            [v, N] = (0, r.useState)(null),
            [y, k] = (0, r.useState)(null),
            [w, M] = (0, r.useState)(!0),
            [P, C] = (0, r.useState)(null),
            [S, _] = (0, r.useState)(""),
            [q, L] = (0, r.useState)([]),
            [U, D] = (0, r.useState)(!1),
            [R, A] = (0, r.useState)(null),
            [$, T] = (0, r.useState)([]),
            [E, F] = (0, r.useState)(!1),
            O = (0, r.useMemo)(() => {
              let e = [];
              if (
                (m.forEach((t) => {
                  t.location &&
                    "number" == typeof t.location.lat &&
                    "number" == typeof t.location.lng &&
                    e.push(t.location);
                }),
                p.forEach((t) => {
                  t.location &&
                    "number" == typeof t.location.lat &&
                    "number" == typeof t.location.lng &&
                    e.push(t.location);
                }),
                v && e.push(v),
                0 === e.length)
              )
                return null;
              let t = e[0].lat,
                s = e[0].lat,
                a = e[0].lng,
                r = e[0].lng;
              return (
                e.forEach((e) => {
                  (e.lat < t && (t = e.lat),
                    e.lat > s && (s = e.lat),
                    e.lng < a && (a = e.lng),
                    e.lng > r && (r = e.lng));
                }),
                { minLat: t, maxLat: s, minLng: a, maxLng: r }
              );
            }, [m, p, v]),
            W = (0, r.useMemo)(() => null !== O, [O]),
            z = (0, r.useCallback)(
              (e) => {
                if (!e || !O) return { left: "50%", top: "50%" };
                let t = Math.max(O.maxLat - O.minLat, 1e-4),
                  s = Math.max(O.maxLng - O.minLng, 1e-4),
                  a = ((e.lng - O.minLng) / s) * 100,
                  r = 100 - ((e.lat - O.minLat) / t) * 100;
                return {
                  left: `${Math.min(100, Math.max(0, a))}%`,
                  top: `${Math.min(100, Math.max(0, r))}%`,
                };
              },
              [O],
            ),
            G = (0, r.useMemo)(() => m.find((e) => e.id === f) || null, [m, f]),
            I = (0, r.useMemo)(() => {
              if (!G || !G.mainPhotoUrl) return null;
              let e = G.mainPhotoUrl;
              return e.startsWith("http")
                ? e
                : `https://radaa-1.onrender.com/api${e}`;
            }, [G]),
            B = (0, r.useMemo)(() => {
              if (!R || 0 === $.length) return m;
              let e = new Map();
              return (
                m.forEach((t) => {
                  e.set(t.id, t);
                }),
                $.map((t) => {
                  let s = e.get(t.id) || null,
                    a = t.location || s?.location || null;
                  return { ...s, ...t, location: a };
                })
              );
            }, [m, $, R]),
            Z = (0, r.useMemo)(
              () =>
                B.map((e) => ({ ...e, isTracked: null != P && e.id === P })),
              [B, P],
            ),
            H = (0, r.useMemo)(() => {
              if (!G || !G.location || !v) return null;
              let e = (function (e, t) {
                let s = ((t.lat - e.lat) * Math.PI) / 180,
                  a = ((t.lng - e.lng) * Math.PI) / 180,
                  r = (e.lat * Math.PI) / 180,
                  l = (t.lat * Math.PI) / 180,
                  n = Math.sin(s / 2),
                  i = Math.sin(a / 2),
                  d = n * n + Math.cos(r) * Math.cos(l) * i * i;
                return 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d)) * 6371e3;
              })(v, G.location);
              return { distanceMeters: e, etaMinutes: (e / 1e3 / 25) * 60 };
            }, [G, v]),
            V = (0, r.useCallback)((e) => {
              b(e);
            }, []),
            X = () => {
              k("Geolocation is not available in this browser.");
            },
            K = Z.length,
            J = p.length;
          return x
            ? (0, a.jsxs)("div", {
                className: "space-y-4",
                children: [
                  (0, a.jsxs)("header", {
                    className:
                      "flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between",
                    children: [
                      (0, a.jsxs)("div", {
                        children: [
                          a.jsx("h1", {
                            className: "text-lg font-semibold",
                            children: "Live Matatu Map",
                          }),
                          a.jsx("p", {
                            className: "text-xs text-slate-300",
                            children:
                              "See matatus moving in real time and tap a card below to track your ride.",
                          }),
                        ],
                      }),
                      (0, a.jsxs)("div", {
                        className:
                          "mt-2 flex flex-col items-stretch gap-2 text-[10px] text-slate-400 md:mt-0 md:flex-row md:items-center",
                        children: [
                          (0, a.jsxs)("div", {
                            className: "flex items-center gap-2",
                            children: [
                              (0, a.jsxs)("span", {
                                className:
                                  "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300",
                                children: [
                                  a.jsx("span", {
                                    className:
                                      "mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400",
                                  }),
                                  "Live now",
                                ],
                              }),
                              (0, a.jsxs)("span", {
                                children: [
                                  K,
                                  " matatus \xb7 ",
                                  J,
                                  " nearby riders",
                                ],
                              }),
                            ],
                          }),
                          (0, a.jsxs)("div", {
                            className:
                              "flex items-center gap-2 md:min-w-[240px]",
                            children: [
                              a.jsx("input", {
                                type: "text",
                                value: S,
                                onChange: (e) => {
                                  (_(e.target.value), A(null));
                                },
                                className:
                                  "w-full rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[10px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                placeholder: "Filter by route…",
                              }),
                              U &&
                                a.jsx("span", {
                                  className: "text-[10px] text-slate-400",
                                  children: "Searching…",
                                }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, a.jsxs)("section", {
                    className:
                      "relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950",
                    children: [
                      a.jsx("div", {
                        className: "p-4 pb-3",
                        children: a.jsx(n.Z, {
                          matatus: Z,
                          passengers: p,
                          userLocation: v,
                          displayPositions: g,
                          project: z,
                          onCenterOnMe: X,
                          onSelectMatatu: V,
                          isLoading: w,
                          hasAnyLocation: W,
                          driverMode: o,
                        }),
                      }),
                      a.jsx("div", {
                        className:
                          "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent",
                      }),
                    ],
                  }),
                  (0, a.jsxs)("section", {
                    className:
                      "space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4",
                    children: [
                      (0, a.jsxs)("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                          (0, a.jsxs)("div", {
                            children: [
                              a.jsx("h2", {
                                className: "text-sm font-semibold",
                                children: "Matatus on this map",
                              }),
                              a.jsx("p", {
                                className: "text-[11px] text-slate-400",
                                children:
                                  "Tap a card to focus the marker and start tracking it.",
                              }),
                            ],
                          }),
                          H &&
                            (0, a.jsxs)("div", {
                              className:
                                "rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[10px] text-slate-200",
                              children: [
                                "~",
                                Math.round(H.etaMinutes),
                                " min away",
                              ],
                            }),
                          q.length > 0 &&
                            a.jsx("div", {
                              className: "mt-2 flex flex-wrap gap-1",
                              children: q.map((e) =>
                                a.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => {
                                      (A(e), _(e.name));
                                    },
                                    className: `rounded-full border px-2 py-0.5 text-[10px] transition ${R && R._id === e._id ? "border-sky-500 bg-sky-500/10 text-sky-200" : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"}`,
                                    children: e.name,
                                  },
                                  e._id,
                                ),
                              ),
                            }),
                        ],
                      }),
                      (0, a.jsxs)("div", {
                        className: "grid gap-3 md:grid-cols-2",
                        children: [
                          Z.map((e) => {
                            let t = G && G.id === e.id,
                              s = P && P === e.id;
                            return (0, a.jsxs)(
                              "button",
                              {
                                type: "button",
                                onClick: () => b(e.id),
                                className: `flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${t || s ? "border-sky-500 bg-sky-500/10" : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"}`,
                                children: [
                                  (0, a.jsxs)("div", {
                                    children: [
                                      (0, a.jsxs)("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          a.jsx("span", {
                                            className:
                                              "text-[11px] font-semibold",
                                            children:
                                              e.plate ||
                                              e.numberPlate ||
                                              "Unknown plate",
                                          }),
                                          e.route &&
                                            a.jsx("span", {
                                              className:
                                                "rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-200",
                                              children: e.route,
                                            }),
                                        ],
                                      }),
                                      e.sacco &&
                                        a.jsx("p", {
                                          className:
                                            "mt-0.5 text-[10px] text-slate-400",
                                          children: e.sacco,
                                        }),
                                      e.rating &&
                                        e.rating.count > 0 &&
                                        (0, a.jsxs)("p", {
                                          className:
                                            "mt-0.5 text-[10px] text-amber-300",
                                          children: [
                                            e.rating.avgRating.toFixed(1),
                                            " ★ \xb7 ",
                                            e.rating.count,
                                            " rides rated",
                                          ],
                                        }),
                                    ],
                                  }),
                                  (0, a.jsxs)("div", {
                                    className: "flex flex-col items-end gap-1",
                                    children: [
                                      a.jsx("span", {
                                        className: "text-[10px] text-slate-400",
                                        children: e.location
                                          ? "Online"
                                          : "Offline",
                                      }),
                                      e.isTracked &&
                                        a.jsx("span", {
                                          className:
                                            "rounded-full bg-sky-500/10 px-2 py-0.5 text-[9px] text-sky-300",
                                          children: "Tracking",
                                        }),
                                    ],
                                  }),
                                ],
                              },
                              e.id,
                            );
                          }),
                          0 === Z.length &&
                            a.jsx("p", {
                              className:
                                "col-span-full text-[11px] text-slate-500",
                              children:
                                "No matatus are online yet. They'll appear here once they come online.",
                            }),
                        ],
                      }),
                      G &&
                        (0, a.jsxs)("div", {
                          className:
                            "mt-3 grid gap-3 md:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]",
                          children: [
                            (0, a.jsxs)("div", {
                              className: "space-y-2 text-xs text-slate-200",
                              children: [
                                I &&
                                  a.jsx("div", {
                                    className:
                                      "overflow-hidden rounded-md border border-slate-800",
                                    children: a.jsx("img", {
                                      src: I,
                                      alt: "Matatu photo",
                                      className: "h-32 w-full object-cover",
                                    }),
                                  }),
                                (0, a.jsxs)("div", {
                                  children: [
                                    a.jsx("span", {
                                      className: "text-slate-400",
                                      children: "Plate: ",
                                    }),
                                    G.plate || G.numberPlate || "Unknown",
                                  ],
                                }),
                                (0, a.jsxs)("div", {
                                  children: [
                                    a.jsx("span", {
                                      className: "text-slate-400",
                                      children: "Route: ",
                                    }),
                                    G.route || "—",
                                  ],
                                }),
                                G.driverName &&
                                  (0, a.jsxs)("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                      a.jsx("div", {
                                        className:
                                          "flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100",
                                        children: G.driverName
                                          .charAt(0)
                                          .toUpperCase(),
                                      }),
                                      (0, a.jsxs)("div", {
                                        children: [
                                          a.jsx("span", {
                                            className: "text-slate-400",
                                            children: "Driver: ",
                                          }),
                                          G.driverName,
                                          G.driverPhone &&
                                            (0, a.jsxs)("span", {
                                              className: "text-slate-500",
                                              children: [
                                                " \xb7 ",
                                                G.driverPhone,
                                              ],
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                G.sacco &&
                                  (0, a.jsxs)("div", {
                                    children: [
                                      a.jsx("span", {
                                        className: "text-slate-400",
                                        children: "SACCO: ",
                                      }),
                                      G.sacco,
                                    ],
                                  }),
                                G.rating &&
                                  (0, a.jsxs)("div", {
                                    children: [
                                      a.jsx("span", {
                                        className: "text-slate-400",
                                        children: "Rating: ",
                                      }),
                                      G.rating.avgRating.toFixed(1),
                                      " ★ (",
                                      G.rating.count,
                                      ")",
                                    ],
                                  }),
                              ],
                            }),
                            (0, a.jsxs)("div", {
                              className: "space-y-2 text-[11px] text-slate-300",
                              children: [
                                H &&
                                  (0, a.jsxs)(a.Fragment, {
                                    children: [
                                      (0, a.jsxs)("div", {
                                        children: [
                                          a.jsx("span", {
                                            className: "text-slate-400",
                                            children: "Distance from you: ",
                                          }),
                                          (H.distanceMeters / 1e3).toFixed(1),
                                          " km",
                                        ],
                                      }),
                                      (0, a.jsxs)("div", {
                                        children: [
                                          a.jsx("span", {
                                            className: "text-slate-400",
                                            children: "ETA (25 km/h): ",
                                          }),
                                          Math.round(H.etaMinutes),
                                          " min",
                                        ],
                                      }),
                                    ],
                                  }),
                                a.jsx("button", {
                                  type: "button",
                                  onClick: () =>
                                    C((e) =>
                                      G ? (e === G.id ? null : G.id) : e,
                                    ),
                                  className:
                                    "mt-1 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500",
                                  children:
                                    P === G.id
                                      ? "Stop tracking"
                                      : "Track this matatu",
                                }),
                              ],
                            }),
                          ],
                        }),
                    ],
                  }),
                  y &&
                    a.jsx("p", {
                      className: "text-[11px] text-amber-300",
                      children: y,
                    }),
                ],
              })
            : (0, a.jsxs)("div", {
                className: "grid gap-4 md:grid-cols-[2fr,1fr]",
                children: [
                  (0, a.jsxs)("div", {
                    className:
                      "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                    children: [
                      a.jsx("h1", {
                        className: "text-lg font-semibold",
                        children: "Live Matatu Map",
                      }),
                      a.jsx("p", {
                        className: "mt-1 text-xs text-slate-300",
                        children:
                          "Live view of matatus and nearby passengers. Positions are updated in real time.",
                      }),
                      (0, a.jsxs)("div", {
                        className:
                          "mt-3 flex items-center justify-between text-[11px]",
                        children: [
                          (0, a.jsxs)("div", {
                            className:
                              "inline-flex rounded-md border border-slate-700 bg-slate-950/60 p-0.5",
                            children: [
                              a.jsx("button", {
                                type: "button",
                                onClick: () => c(!1),
                                className: `rounded-sm px-2 py-0.5 text-[11px] ${o ? "text-slate-400 hover:text-slate-100" : "bg-slate-800 text-slate-100"}`,
                                children: "Passenger",
                              }),
                              a.jsx("button", {
                                type: "button",
                                onClick: () => c(!0),
                                className: `ml-1 rounded-sm px-2 py-0.5 text-[11px] ${o ? "bg-emerald-600/70 text-emerald-50" : "text-slate-400 hover:text-slate-100"}`,
                                children: "Driver",
                              }),
                            ],
                          }),
                          (0, a.jsxs)("span", {
                            className: "text-[10px] text-slate-400",
                            children: ["Mode: ", o ? "Driver" : "Passenger"],
                          }),
                        ],
                      }),
                      (0, a.jsxs)("div", {
                        className: "mt-3 flex items-center gap-2 text-[11px]",
                        children: [
                          a.jsx("input", {
                            type: "text",
                            value: S,
                            onChange: (e) => {
                              (_(e.target.value), A(null));
                            },
                            className:
                              "w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                            placeholder: "Search routes, e.g. CBD – Westlands",
                          }),
                          U &&
                            a.jsx("span", {
                              className: "text-[10px] text-slate-400",
                              children: "Searching…",
                            }),
                        ],
                      }),
                      q.length > 0 &&
                        a.jsx("div", {
                          className: "mt-2 flex flex-wrap gap-1 text-[10px]",
                          children: q.map((e) =>
                            a.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  (A(e), _(e.name));
                                },
                                className: `rounded-full border px-2 py-0.5 transition ${R && R._id === e._id ? "border-sky-500 bg-sky-500/10 text-sky-200" : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"}`,
                                children: e.name,
                              },
                              e._id,
                            ),
                          ),
                        }),
                      a.jsx(n.Z, {
                        matatus: Z,
                        passengers: p,
                        userLocation: v,
                        displayPositions: g,
                        project: z,
                        onCenterOnMe: X,
                        onSelectMatatu: V,
                        isLoading: w,
                        hasAnyLocation: W,
                        driverMode: o,
                      }),
                      y &&
                        a.jsx("p", {
                          className: "mt-2 text-[11px] text-amber-300",
                          children: y,
                        }),
                    ],
                  }),
                  (0, a.jsxs)("aside", {
                    className:
                      "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                    children: [
                      a.jsx("h2", {
                        className: "text-base font-semibold",
                        children: "Matatu details",
                      }),
                      G
                        ? (0, a.jsxs)("div", {
                            className: "space-y-2 text-xs text-slate-200",
                            children: [
                              I &&
                                a.jsx("div", {
                                  className:
                                    "overflow-hidden rounded-md border border-slate-800",
                                  children: a.jsx("img", {
                                    src: I,
                                    alt: "Matatu photo",
                                    className: "h-28 w-full object-cover",
                                  }),
                                }),
                              (0, a.jsxs)("div", {
                                children: [
                                  a.jsx("span", {
                                    className: "text-slate-400",
                                    children: "Plate: ",
                                  }),
                                  G.plate || G.numberPlate || "Unknown",
                                ],
                              }),
                              (0, a.jsxs)("div", {
                                children: [
                                  a.jsx("span", {
                                    className: "text-slate-400",
                                    children: "Route: ",
                                  }),
                                  G.route || "—",
                                ],
                              }),
                              G.driverName &&
                                (0, a.jsxs)("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    a.jsx("div", {
                                      className:
                                        "flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100",
                                      children: G.driverName
                                        .charAt(0)
                                        .toUpperCase(),
                                    }),
                                    (0, a.jsxs)("div", {
                                      children: [
                                        a.jsx("span", {
                                          className: "text-slate-400",
                                          children: "Driver: ",
                                        }),
                                        G.driverName,
                                        G.driverPhone &&
                                          (0, a.jsxs)("span", {
                                            className: "text-slate-500",
                                            children: [" \xb7 ", G.driverPhone],
                                          }),
                                      ],
                                    }),
                                  ],
                                }),
                              G.sacco &&
                                (0, a.jsxs)("div", {
                                  children: [
                                    a.jsx("span", {
                                      className: "text-slate-400",
                                      children: "SACCO: ",
                                    }),
                                    G.sacco,
                                  ],
                                }),
                              G.rating &&
                                (0, a.jsxs)("div", {
                                  children: [
                                    a.jsx("span", {
                                      className: "text-slate-400",
                                      children: "Rating: ",
                                    }),
                                    G.rating.avgRating.toFixed(1),
                                    " ★ (",
                                    G.rating.count,
                                    ")",
                                  ],
                                }),
                              (0, a.jsxs)("div", {
                                children: [
                                  a.jsx("span", {
                                    className: "text-slate-400",
                                    children: "Lat: ",
                                  }),
                                  G.location?.lat ?? "—",
                                ],
                              }),
                              (0, a.jsxs)("div", {
                                children: [
                                  a.jsx("span", {
                                    className: "text-slate-400",
                                    children: "Lng: ",
                                  }),
                                  G.location?.lng ?? "—",
                                ],
                              }),
                              H &&
                                (0, a.jsxs)(a.Fragment, {
                                  children: [
                                    (0, a.jsxs)("div", {
                                      children: [
                                        a.jsx("span", {
                                          className: "text-slate-400",
                                          children: "Distance from you: ",
                                        }),
                                        (H.distanceMeters / 1e3).toFixed(1),
                                        " km",
                                      ],
                                    }),
                                    (0, a.jsxs)("div", {
                                      children: [
                                        a.jsx("span", {
                                          className: "text-slate-400",
                                          children: "ETA (25 km/h): ",
                                        }),
                                        Math.round(H.etaMinutes),
                                        " min",
                                      ],
                                    }),
                                  ],
                                }),
                              a.jsx("button", {
                                type: "button",
                                onClick: () =>
                                  C((e) =>
                                    G ? (e === G.id ? null : G.id) : e,
                                  ),
                                className:
                                  "mt-2 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500",
                                children:
                                  P === G.id
                                    ? "Stop tracking"
                                    : "Track this matatu",
                              }),
                            ],
                          })
                        : a.jsx("p", {
                            className: "text-xs text-slate-400",
                            children: "Select a matatu marker on the map.",
                          }),
                    ],
                  }),
                ],
              });
        }
      },
      8333: (e, t, s) => {
        "use strict";
        s.d(t, { AppShell: () => u });
        var a = s(326),
          r = s(7577),
          l = s(434),
          n = s(5047),
          i = s(732),
          d = s(7772),
          o = s(457),
          c = s(676);
        function x() {
          let e = (0, n.useRouter)(),
            { activeMode: t } = (0, o.r)(),
            { primaryButtonClass: s } = (0, c.F)();
          return (0, a.jsxs)("button", {
            type: "button",
            onClick: () => {
              let s = "driver" === t ? "/dashboard/driver/live" : "/dashboard";
              (console.log("[mode] back-to-dashboard", {
                activeMode: t,
                target: s,
              }),
                e.push(s));
            },
            className: `${s} gap-1 text-xs`,
            children: [
              a.jsx("span", { className: "mr-1", children: "←" }),
              "Back to Dashboard",
            ],
          });
        }
        var m = s(1264);
        function u({ children: e }) {
          let t = (0, n.usePathname)(),
            { user: s, token: u, logout: p } = (0, i.a)(),
            { notifications: h, unreadCount: f, markAllAsRead: b } = (0, d.z)(),
            [g, j] = (0, r.useState)(!1),
            { connect: v } = (0, m.s)(),
            { driverOnline: N, setDriverOnline: y, activeMode: k } = (0, o.r)(),
            { headerBgClass: w } = (0, c.F)(),
            M = "/dashboard" === t,
            P = t.startsWith("/dashboard/"),
            C = t.startsWith("/auth"),
            S = "/" !== t && !C && !M,
            _ = s?.role,
            q = "admin" === _,
            L = "driver" === _,
            U = q
              ? "/dashboard/sacco"
              : L && "driver" === k
                ? "/dashboard/driver/live"
                : "/dashboard",
            D =
              L && "driver" === k
                ? "/dashboard/driver/live"
                : "/dashboard/passenger/live";
          return (0, a.jsxs)("div", {
            className: "flex min-h-screen flex-col",
            children: [
              a.jsx("header", {
                className: w,
                children: (0, a.jsxs)("div", {
                  className:
                    "radaa-shell flex items-center justify-between py-3",
                  children: [
                    a.jsx(l.default, {
                      href: U,
                      className: "text-lg font-semibold tracking-tight",
                      children: "Radaa",
                    }),
                    (0, a.jsxs)("nav", {
                      className:
                        "flex items-center gap-4 text-sm text-slate-300",
                      children: [
                        (0, a.jsxs)("div", {
                          className: "hidden items-center gap-3 md:flex",
                          children: [
                            a.jsx(l.default, {
                              href: U,
                              className: "hover:text-white",
                              children: "Home",
                            }),
                            a.jsx(l.default, {
                              href: D,
                              className: "hover:text-white",
                              children: "Live",
                            }),
                            a.jsx(l.default, {
                              href: "/dashboard/trips/list",
                              className: "hover:text-white",
                              children: "Trips",
                            }),
                            a.jsx(l.default, {
                              href: "/profile",
                              className: "hover:text-white",
                              children: "Profile",
                            }),
                            q &&
                              a.jsx(l.default, {
                                href: "/dashboard/sacco",
                                className: "hover:text-white",
                                children: "SACCO",
                              }),
                          ],
                        }),
                        (M || P) &&
                          L &&
                          (0, a.jsxs)("button", {
                            type: "button",
                            onClick: () => {
                              let e = !N;
                              (console.log(
                                "[mode] header toggle ->",
                                e ? "driver" : "passenger",
                              ),
                                y(e));
                            },
                            className: `inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium shadow-sm transition ${N ? "border-emerald-500/80 bg-emerald-600/20 text-emerald-200" : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"}`,
                            children: [
                              a.jsx("span", {
                                className: `mr-1 h-1.5 w-1.5 rounded-full ${N ? "bg-emerald-400" : "bg-slate-500"}`,
                              }),
                              "Driver Mode",
                            ],
                          }),
                        (0, a.jsxs)("div", {
                          className: "relative",
                          children: [
                            (0, a.jsxs)("button", {
                              type: "button",
                              onClick: () => {
                                let e = !g;
                                (j(e), e && b());
                              },
                              className:
                                "relative inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-200 shadow-sm transition hover:border-sky-500/70 hover:text-sky-200",
                              children: [
                                a.jsx("span", {
                                  className:
                                    "mr-1 h-1.5 w-1.5 rounded-full bg-sky-400",
                                }),
                                "Notifications",
                                f > 0 &&
                                  a.jsx("span", {
                                    className:
                                      "ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white",
                                    children: f,
                                  }),
                              ],
                            }),
                            g &&
                              (0, a.jsxs)("div", {
                                className:
                                  "absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-md border border-slate-800 bg-slate-950 text-[11px] shadow-lg",
                                children: [
                                  a.jsx("div", {
                                    className:
                                      "border-b border-slate-800 px-3 py-2 text-xs font-semibold text-slate-200",
                                    children: "Notifications",
                                  }),
                                  0 === h.length
                                    ? a.jsx("div", {
                                        className: "px-3 py-3 text-slate-400",
                                        children: "No notifications yet.",
                                      })
                                    : a.jsx("ul", {
                                        className:
                                          "max-h-64 divide-y divide-slate-800 overflow-auto",
                                        children: h.map((e) =>
                                          (0, a.jsxs)(
                                            "li",
                                            {
                                              className:
                                                "px-3 py-2 hover:bg-slate-900/80",
                                              children: [
                                                (0, a.jsxs)("div", {
                                                  className:
                                                    "flex items-start justify-between gap-2",
                                                  children: [
                                                    (0, a.jsxs)("div", {
                                                      children: [
                                                        a.jsx("div", {
                                                          className:
                                                            "text-[11px] font-semibold text-slate-100",
                                                          children: e.title,
                                                        }),
                                                        a.jsx("div", {
                                                          className:
                                                            "mt-0.5 text-[11px] text-slate-300",
                                                          children: e.message,
                                                        }),
                                                      ],
                                                    }),
                                                    !e.read &&
                                                      a.jsx("span", {
                                                        className:
                                                          "mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-400",
                                                      }),
                                                  ],
                                                }),
                                                a.jsx("div", {
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
                        a.jsx("button", {
                          type: "button",
                          onClick: p,
                          className:
                            "text-xs font-medium text-slate-300 hover:text-red-300",
                          children: "Logout",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              a.jsx("main", {
                className: "flex-1",
                children: (0, a.jsxs)("div", {
                  className: "mx-auto max-w-6xl px-4 py-6",
                  children: [
                    S &&
                      a.jsx("div", {
                        className: "mb-4 flex justify-end",
                        children: a.jsx(x, {}),
                      }),
                    e,
                  ],
                }),
              }),
              (M || P) &&
                L &&
                a.jsx("nav", {
                  className:
                    "fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-950/90 px-4 py-2 text-[11px] text-slate-200 md:hidden",
                  children: (0, a.jsxs)("div", {
                    className:
                      "mx-auto flex max-w-md items-center justify-between",
                    children: [
                      a.jsx(l.default, {
                        href: U,
                        className:
                          "flex flex-1 flex-col items-center px-2 py-1",
                        children: a.jsx("span", {
                          className: "text-[11px]",
                          children: "Home",
                        }),
                      }),
                      a.jsx(l.default, {
                        href: D,
                        className:
                          "flex flex-1 flex-col items-center px-2 py-1",
                        children: a.jsx("span", {
                          className: "text-[11px]",
                          children: "Live",
                        }),
                      }),
                      a.jsx(l.default, {
                        href: "/dashboard/trips/list",
                        className:
                          "flex flex-1 flex-col items-center px-2 py-1",
                        children: a.jsx("span", {
                          className: "text-[11px]",
                          children: "Trips",
                        }),
                      }),
                      a.jsx(l.default, {
                        href: "/profile",
                        className:
                          "flex flex-1 flex-col items-center px-2 py-1",
                        children: a.jsx("span", {
                          className: "text-[11px]",
                          children: "Profile",
                        }),
                      }),
                      q &&
                        a.jsx(l.default, {
                          href: "/dashboard/sacco",
                          className:
                            "flex flex-1 flex-col items-center px-2 py-1",
                          children: a.jsx("span", {
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
      7039: (e, t, s) => {
        "use strict";
        s.d(t, { Z: () => d });
        var a = s(326),
          r = s(7577),
          l = s(4545);
        let n = function ({ matatu: e, status: t, style: s, onSelect: n }) {
            let i = (function (e) {
                if (!e) return "Matatu";
                if (e.plate && e.plate.trim().length > 0) return e.plate.trim();
                if (e.numberPlate && e.numberPlate.trim().length > 0)
                  return e.numberPlate.trim();
                if (e.route && e.route.trim().length > 0) return e.route.trim();
                if (e.sacco && e.sacco.trim().length > 0) return e.sacco.trim();
                let t = e.id || e._id;
                return t ? String(t).slice(0, 6) : "Matatu";
              })(e),
              d = (0, l.N3)("map_photos_v1", !1),
              o = (0, r.useMemo)(() => {
                if (!d || !e.mainPhotoUrl) return null;
                let t = e.mainPhotoUrl;
                if (t.startsWith("http")) return t;
                let s =
                  process.env.NEXT_PUBLIC_BACKEND_URL ||
                  "http://localhost:5000";
                return `${s}${t}`;
              }, [d, e.mainPhotoUrl]);
            return (0, a.jsxs)("button", {
              type: "button",
              onClick: n,
              className: `absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold shadow ${(function (
                e,
              ) {
                switch (e) {
                  case "driver":
                    return "bg-sky-400 text-slate-950 border-sky-300";
                  case "online":
                    return "bg-emerald-400 text-slate-950 border-emerald-300";
                  default:
                    return "bg-slate-600 text-slate-50 border-slate-400";
                }
              })(t)}`,
              style: s,
              "aria-label": i,
              children: [
                o &&
                  a.jsx("span", {
                    className:
                      "mr-1 inline-block h-4 w-4 overflow-hidden rounded-full border border-slate-900 bg-slate-900",
                    "aria-hidden": "true",
                    children: a.jsx("img", {
                      src: o,
                      alt: "",
                      className: "h-full w-full object-cover",
                    }),
                  }),
                a.jsx("span", { "aria-hidden": "true", children: i }),
              ],
            });
          },
          i = function ({ style: e }) {
            return a.jsx("div", {
              className:
                "absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow",
              style: e,
            });
          };
        function d({
          matatus: e,
          passengers: t,
          userLocation: s,
          displayPositions: r,
          project: l,
          onCenterOnMe: d,
          onSelectMatatu: o,
          isLoading: c,
          hasAnyLocation: x,
          driverMode: m,
          showCenterOnMe: u = !0,
        }) {
          let p = !c && !x;
          return (0, a.jsxs)("div", {
            className:
              "relative mt-4 h-80 overflow-hidden rounded-lg bg-slate-950",
            children: [
              c &&
                a.jsx("div", {
                  className:
                    "absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900",
                  children: a.jsx("div", {
                    className:
                      "absolute inset-4 rounded-lg border border-slate-800/60",
                  }),
                }),
              !c &&
                p &&
                a.jsx("div", {
                  className:
                    "flex h-full items-center justify-center text-xs text-slate-500",
                  children: "Waiting for live location data...",
                }),
              !c &&
                !p &&
                (0, a.jsxs)(a.Fragment, {
                  children: [
                    e.map((e) => {
                      let t = r[e.id] ?? e.location ?? null;
                      if (!t) return null;
                      let s = l(t),
                        i =
                          m || e.isTracked
                            ? "driver"
                            : e.location
                              ? "online"
                              : "offline";
                      return a.jsx(
                        n,
                        {
                          matatu: e,
                          status: i,
                          style: s,
                          onSelect: () => o(e.id),
                        },
                        e.id,
                      );
                    }),
                    t.map((e) => {
                      let t = l(e.location);
                      return a.jsx(i, { style: t }, e.id);
                    }),
                    s &&
                      a.jsx("div", {
                        className:
                          "absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-500 shadow-lg",
                        style: l(s),
                      }),
                  ],
                }),
              u &&
                a.jsx("button", {
                  type: "button",
                  onClick: d,
                  className:
                    "absolute bottom-3 right-3 z-10 inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/20 px-2.5 py-1 text-[10px] font-medium text-sky-100 shadow hover:border-sky-400 hover:bg-sky-600/30",
                  children: "Center on me",
                }),
            ],
          });
        }
      },
      9406: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => l }));
        var a = s(9510),
          r = s(8213);
        function l({ children: e }) {
          return a.jsx(r.V, { children: e });
        }
      },
      2185: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => n, __esModule: () => l, default: () => i }));
        var a = s(8570);
        let r = (0, a.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\map\page.tsx`,
          ),
          { __esModule: l, $$typeof: n } = r;
        r.default;
        let i = (0, a.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\map\page.tsx#default`,
        );
      },
      8213: (e, t, s) => {
        "use strict";
        s.d(t, { V: () => i });
        var a = s(8570);
        let r = (0, a.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\components\layout\AppShell.tsx`,
          ),
          { __esModule: l, $$typeof: n } = r;
        r.default;
        let i = (0, a.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\components\layout\AppShell.tsx#AppShell`,
        );
      },
    }));
  var t = require("../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    a = t.X(0, [489, 496, 462], () => s(6190));
  module.exports = a;
})();
