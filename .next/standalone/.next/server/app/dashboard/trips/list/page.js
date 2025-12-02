(() => {
  var e = {};
  ((e.id = 765),
    (e.ids = [765]),
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
      8201: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => l.a,
            __next_app__: () => c,
            originalPathname: () => p,
            pages: () => x,
            routeModule: () => u,
            tree: () => o,
          }),
          s(9118),
          s(3321),
          s(4481),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var r = s(3191),
          a = s(8716),
          i = s(7922),
          l = s.n(i),
          d = s(5231),
          n = {};
        for (let e in d)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "originalPathname",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (n[e] = () => d[e]);
        s.d(t, n);
        let o = [
            "",
            {
              children: [
                "dashboard",
                {
                  children: [
                    "trips",
                    {
                      children: [
                        "list",
                        {
                          children: [
                            "__PAGE__",
                            {},
                            {
                              page: [
                                () => Promise.resolve().then(s.bind(s, 9118)),
                                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\trips\\list\\page.tsx",
                              ],
                            },
                          ],
                        },
                        {},
                      ],
                    },
                    {},
                  ],
                },
                {
                  layout: [
                    () => Promise.resolve().then(s.bind(s, 3321)),
                    "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\layout.tsx",
                  ],
                  loading: [
                    () => Promise.resolve().then(s.bind(s, 4481)),
                    "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\loading.tsx",
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
          x = [
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\trips\\list\\page.tsx",
          ],
          p = "/dashboard/trips/list/page",
          c = { require: s, loadChunk: () => Promise.resolve() },
          u = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/dashboard/trips/list/page",
              pathname: "/dashboard/trips/list",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: o },
          });
      },
      5772: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 9554));
      },
      9554: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => d }));
        var r = s(326),
          a = s(7577),
          i = s(434),
          l = s(4545);
        function d() {
          let [e, t] = (0, a.useState)(null),
            [s, d] = (0, a.useState)([]),
            [n, o] = (0, a.useState)(!0),
            [x, p] = (0, a.useState)(null),
            c = (0, l.N3)("trip_ui_v1", !1),
            u = s.length,
            m = s.filter((e) => "completed" === e.status).length,
            h = s.filter((e) => "ongoing" === e.status).length,
            b = s.reduce((e, t) => {
              let s = t.endTime || t.startTime;
              if (!s) return e;
              let r = new Date(s);
              return !e || r > e ? r : e;
            }, null);
          return (0, r.jsxs)("div", {
            className: "space-y-6",
            children: [
              (0, r.jsxs)("header", {
                className:
                  "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                children: [
                  (0, r.jsxs)("div", {
                    children: [
                      r.jsx("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: "Trips",
                      }),
                      r.jsx("p", {
                        className: "text-xs text-slate-300",
                        children:
                          "Browse your trip history. Each completed trip is tied to a fare payment and loyalty update.",
                      }),
                    ],
                  }),
                  r.jsx(i.default, {
                    href: "/dashboard/trips/create",
                    className:
                      "inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500",
                    children: "Start new trip",
                  }),
                ],
              }),
              c &&
                !n &&
                !x &&
                u > 0 &&
                (0, r.jsxs)("section", {
                  className:
                    "grid gap-3 text-[11px] text-slate-200 md:grid-cols-3",
                  children: [
                    (0, r.jsxs)("div", {
                      className:
                        "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                      children: [
                        r.jsx("div", {
                          className: "text-slate-400",
                          children: "Total trips",
                        }),
                        r.jsx("div", {
                          className:
                            "mt-0.5 text-sm font-semibold text-slate-50",
                          children: u,
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className:
                        "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                      children: [
                        r.jsx("div", {
                          className: "text-slate-400",
                          children: "Completed",
                        }),
                        r.jsx("div", {
                          className:
                            "mt-0.5 text-sm font-semibold text-emerald-300",
                          children: m,
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className:
                        "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                      children: [
                        r.jsx("div", {
                          className: "text-slate-400",
                          children: "Ongoing",
                        }),
                        r.jsx("div", {
                          className:
                            "mt-0.5 text-sm font-semibold text-amber-300",
                          children: h,
                        }),
                        b &&
                          (0, r.jsxs)("div", {
                            className: "mt-1 text-[10px] text-slate-400",
                            children: ["Last trip: ", b.toLocaleString()],
                          }),
                      ],
                    }),
                  ],
                }),
              !e &&
                !n &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                  children:
                    "No user ID found. Make sure you are logged in via the auth screens before viewing trips.",
                }),
              n &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                  children: "Loading trips...",
                }),
              x &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                  children: x,
                }),
              !n &&
                !x &&
                0 === s.length &&
                e &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                  children:
                    "No trips found yet. Start a new trip to see it appear here.",
                }),
              !n &&
                !x &&
                s.length > 0 &&
                r.jsx("div", {
                  className:
                    "overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80",
                  children: (0, r.jsxs)("table", {
                    className: "min-w-full border-collapse text-xs",
                    children: [
                      r.jsx("thead", {
                        className: "bg-slate-900/80 text-slate-300",
                        children: (0, r.jsxs)("tr", {
                          children: [
                            r.jsx("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Matatu",
                            }),
                            r.jsx("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Route",
                            }),
                            r.jsx("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Start",
                            }),
                            r.jsx("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "End",
                            }),
                            r.jsx("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Fare",
                            }),
                            r.jsx("th", {
                              className: "px-3 py-2 text-left font-medium",
                              children: "Status",
                            }),
                            r.jsx("th", {
                              className: "px-3 py-2 text-right font-medium",
                              children: "Actions",
                            }),
                          ],
                        }),
                      }),
                      r.jsx("tbody", {
                        children: s.map((e) => {
                          let t = e.startTime ? new Date(e.startTime) : null,
                            s = e.endTime ? new Date(e.endTime) : null;
                          return (0, r.jsxs)(
                            "tr",
                            {
                              className: "border-t border-slate-800/80",
                              children: [
                                r.jsx("td", {
                                  className: "px-3 py-2 text-slate-100",
                                  children: e.matatu?.plate || "Unknown",
                                }),
                                r.jsx("td", {
                                  className: "px-3 py-2 text-slate-300",
                                  children: e.matatu?.route || "—",
                                }),
                                r.jsx("td", {
                                  className: "px-3 py-2 text-slate-300",
                                  children: t ? t.toLocaleString() : "—",
                                }),
                                r.jsx("td", {
                                  className: "px-3 py-2 text-slate-300",
                                  children: s ? s.toLocaleString() : "—",
                                }),
                                r.jsx("td", {
                                  className: "px-3 py-2 text-slate-300",
                                  children:
                                    null != e.fare
                                      ? `${e.fare} ${e.currency || "KES"}`
                                      : "—",
                                }),
                                r.jsx("td", {
                                  className:
                                    "px-3 py-2 text-slate-300 capitalize",
                                  children: e.status,
                                }),
                                r.jsx("td", {
                                  className: "px-3 py-2 text-right",
                                  children: r.jsx(i.default, {
                                    href: `/dashboard/trips/${e._id}`,
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
      9118: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => l, __esModule: () => i, default: () => d }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\trips\list\page.tsx`,
          ),
          { __esModule: i, $$typeof: l } = a;
        a.default;
        let d = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\trips\list\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462, 754], () => s(8201));
  module.exports = r;
})();
