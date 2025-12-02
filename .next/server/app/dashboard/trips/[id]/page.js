(() => {
  var e = {};
  ((e.id = 32),
    (e.ids = [32]),
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
      1366: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => i.a,
            __next_app__: () => u,
            originalPathname: () => p,
            pages: () => c,
            routeModule: () => x,
            tree: () => o,
          }),
          s(1052),
          s(3321),
          s(4481),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var r = s(3191),
          a = s(8716),
          l = s(7922),
          i = s.n(l),
          n = s(5231),
          d = {};
        for (let e in n)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "originalPathname",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (d[e] = () => n[e]);
        s.d(t, d);
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
                        "[id]",
                        {
                          children: [
                            "__PAGE__",
                            {},
                            {
                              page: [
                                () => Promise.resolve().then(s.bind(s, 1052)),
                                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\trips\\[id]\\page.tsx",
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
          c = [
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\trips\\[id]\\page.tsx",
          ],
          p = "/dashboard/trips/[id]/page",
          u = { require: s, loadChunk: () => Promise.resolve() },
          x = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/dashboard/trips/[id]/page",
              pathname: "/dashboard/trips/[id]",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: o },
          });
      },
      8385: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 7534));
      },
      7534: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => o }));
        var r = s(326),
          a = s(7577),
          l = s(5047),
          i = s(7772),
          n = s(4545);
        let d =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://radaa-1.onrender.com/api";
        function o() {
          let e = (0, l.useParams)(),
            t = e?.id,
            { addNotification: s } = (0, i.z)(),
            o = (0, n.N3)("trip_ui_v1", !1),
            [c, p] = (0, a.useState)(null),
            [u, x] = (0, a.useState)(null),
            [m, h] = (0, a.useState)(!0),
            [b, g] = (0, a.useState)(null),
            [f, y] = (0, a.useState)(""),
            [j, v] = (0, a.useState)(""),
            [N, w] = (0, a.useState)(""),
            [q, k] = (0, a.useState)("KES"),
            [S, P] = (0, a.useState)(!1),
            [_, C] = (0, a.useState)(null),
            [T, R] = (0, a.useState)(null),
            [U, E] = (0, a.useState)(null),
            [D, F] = (0, a.useState)(!1),
            $ = async (e) => {
              if ((e.preventDefault(), t)) {
                (P(!0), C(null));
                try {
                  let e = await fetch(`${d}/trips/${t}/stop`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        lat: f,
                        lng: j,
                        fare: N,
                        currency: q,
                      }),
                    }),
                    r = await e.json().catch(() => null);
                  if (!e.ok) {
                    let e =
                      (r && "object" == typeof r && (r.message || r.error)) ||
                      "Failed to stop trip";
                    throw Error(e);
                  }
                  (x(r),
                    C("Trip stopped and fare recorded successfully"),
                    s({
                      type: "trip",
                      title: "Trip completed",
                      message:
                        (r.matatu?.plate || "Trip") +
                        (null != r.fare
                          ? ` completed with fare ${r.fare}`
                          : " completed."),
                    }));
                } catch (e) {
                  C(e instanceof Error ? e.message : "Failed to stop trip");
                } finally {
                  P(!1);
                }
              }
            },
            A = u?.startTime ? new Date(u.startTime) : null,
            G = u?.endTime ? new Date(u.endTime) : null,
            L = o && !m && !b && !!u && "completed" === u.status,
            M = (e) => {
              o && (E(e), F(!0));
            };
          return (0, r.jsxs)("div", {
            className: "space-y-6",
            children: [
              m &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                  children: "Loading trip details...",
                }),
              b &&
                !m &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                  children: b,
                }),
              !m &&
                !b &&
                u &&
                (0, r.jsxs)(r.Fragment, {
                  children: [
                    (0, r.jsxs)("header", {
                      className: "space-y-1",
                      children: [
                        r.jsx("h1", {
                          className: "text-2xl font-semibold tracking-tight",
                          children: "Trip details",
                        }),
                        (0, r.jsxs)("p", {
                          className: "text-xs text-slate-300",
                          children: [
                            "Matatu ",
                            u.matatu?.plate || "Unknown",
                            " \xb7 ",
                            u.matatu?.route || "Route not set",
                          ],
                        }),
                        o &&
                          (0, r.jsxs)("div", {
                            className:
                              "mt-2 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[10px] text-slate-200",
                            children: [
                              r.jsx("span", {
                                className:
                                  "ongoing" === u.status
                                    ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                                    : "h-1.5 w-1.5 rounded-full bg-slate-500",
                              }),
                              (0, r.jsxs)("span", {
                                className: "capitalize",
                                children: ["Status: ", u.status],
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
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "Status",
                            }),
                            r.jsx("div", {
                              className: "mt-1 text-slate-100 capitalize",
                              children: u.status,
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                          children: [
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "Start time",
                            }),
                            r.jsx("div", {
                              className: "mt-1 text-slate-100",
                              children: A ? A.toLocaleString() : "—",
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                          children: [
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "End time",
                            }),
                            r.jsx("div", {
                              className: "mt-1 text-slate-100",
                              children: G ? G.toLocaleString() : "—",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, r.jsxs)("section", {
                      className:
                        "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                      children: [
                        r.jsx("div", {
                          className: "flex items-center justify-between",
                          children: (0, r.jsxs)("div", {
                            children: [
                              r.jsx("h2", {
                                className:
                                  "text-sm font-semibold text-slate-100",
                                children: "Fare and completion",
                              }),
                              r.jsx("p", {
                                className: "text-[11px] text-slate-400",
                                children:
                                  "If this trip is still ongoing, you can stop it and record the fare amount.",
                              }),
                            ],
                          }),
                        }),
                        _ &&
                          r.jsx("div", {
                            className:
                              "rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-200",
                            children: _,
                          }),
                        "ongoing" === u.status
                          ? (0, r.jsxs)("form", {
                              onSubmit: $,
                              className:
                                "grid gap-3 md:grid-cols-[repeat(4,minmax(0,1fr)),auto]",
                              children: [
                                o &&
                                  (0, r.jsxs)("div", {
                                    className: "space-y-1 md:col-span-4",
                                    children: [
                                      r.jsx("button", {
                                        type: "button",
                                        onClick: () => {
                                          R(
                                            "Geolocation is not available in this browser.",
                                          );
                                        },
                                        className:
                                          "inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/15 px-3 py-1.5 text-[11px] font-medium text-sky-100 shadow-sm transition hover:border-sky-400 hover:bg-sky-600/25",
                                        children:
                                          "Use my current location for end point",
                                      }),
                                      T &&
                                        r.jsx("p", {
                                          className:
                                            "text-[11px] text-slate-400",
                                          children: T,
                                        }),
                                    ],
                                  }),
                                (0, r.jsxs)("div", {
                                  className: "space-y-1",
                                  children: [
                                    r.jsx("label", {
                                      htmlFor: "lat",
                                      className:
                                        "text-[11px] font-medium text-slate-100",
                                      children: "End latitude",
                                    }),
                                    r.jsx("input", {
                                      id: "lat",
                                      type: "number",
                                      step: "0.0001",
                                      required: !0,
                                      value: f,
                                      onChange: (e) => y(e.target.value),
                                      className:
                                        "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                      placeholder: "-1.2864",
                                    }),
                                  ],
                                }),
                                (0, r.jsxs)("div", {
                                  className: "space-y-1",
                                  children: [
                                    r.jsx("label", {
                                      htmlFor: "lng",
                                      className:
                                        "text-[11px] font-medium text-slate-100",
                                      children: "End longitude",
                                    }),
                                    r.jsx("input", {
                                      id: "lng",
                                      type: "number",
                                      step: "0.0001",
                                      required: !0,
                                      value: j,
                                      onChange: (e) => v(e.target.value),
                                      className:
                                        "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                      placeholder: "36.8219",
                                    }),
                                  ],
                                }),
                                (0, r.jsxs)("div", {
                                  className: "space-y-1",
                                  children: [
                                    r.jsx("label", {
                                      htmlFor: "fare",
                                      className:
                                        "text-[11px] font-medium text-slate-100",
                                      children: "Fare amount",
                                    }),
                                    r.jsx("input", {
                                      id: "fare",
                                      type: "number",
                                      step: "1",
                                      min: "0",
                                      required: !0,
                                      value: N,
                                      onChange: (e) => w(e.target.value),
                                      className:
                                        "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                      placeholder: "80",
                                    }),
                                  ],
                                }),
                                (0, r.jsxs)("div", {
                                  className: "space-y-1",
                                  children: [
                                    r.jsx("label", {
                                      htmlFor: "currency",
                                      className:
                                        "text-[11px] font-medium text-slate-100",
                                      children: "Currency",
                                    }),
                                    r.jsx("input", {
                                      id: "currency",
                                      type: "text",
                                      value: q,
                                      onChange: (e) => k(e.target.value),
                                      className:
                                        "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                    }),
                                  ],
                                }),
                                r.jsx("div", {
                                  className: "flex items-end",
                                  children: r.jsx("button", {
                                    type: "submit",
                                    disabled: S,
                                    className:
                                      "inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                                    children: S
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
                                null != u.fare ? `${u.fare} ` : "",
                                u.currency ||
                                  (null != u.fare ? "KES" : "") ||
                                  "—",
                                ".",
                              ],
                            }),
                      ],
                    }),
                    L &&
                      (0, r.jsxs)("section", {
                        className:
                          "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                        children: [
                          (0, r.jsxs)("div", {
                            className: "flex items-center justify-between",
                            children: [
                              (0, r.jsxs)("div", {
                                children: [
                                  r.jsx("h2", {
                                    className:
                                      "text-sm font-semibold text-slate-100",
                                    children: "Rate this trip",
                                  }),
                                  r.jsx("p", {
                                    className: "text-[11px] text-slate-400",
                                    children:
                                      "How was your ride? This rating helps us tune future experiments and UX.",
                                  }),
                                ],
                              }),
                              D &&
                                null != U &&
                                (0, r.jsxs)("span", {
                                  className:
                                    "rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-300",
                                  children: ["Thanks for rating ", U, "/5"],
                                }),
                            ],
                          }),
                          r.jsx("div", {
                            className: "flex items-center gap-2",
                            children: [1, 2, 3, 4, 5].map((e) => {
                              let t = null != U && e <= U;
                              return r.jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => M(e),
                                  className: `flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${t ? "border-amber-400 bg-amber-500/20 text-amber-300" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800"}`,
                                  "aria-label": `Rate this trip ${e} star${e > 1 ? "s" : ""}`,
                                  children: r.jsx("span", { children: "★" }),
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
      1052: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => i, __esModule: () => l, default: () => n }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\trips\[id]\page.tsx`,
          ),
          { __esModule: l, $$typeof: i } = a;
        a.default;
        let n = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\trips\[id]\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462, 754], () => s(1366));
  module.exports = r;
})();
