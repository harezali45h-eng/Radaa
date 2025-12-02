(() => {
  var e = {};
  ((e.id = 894),
    (e.ids = [894]),
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
      6831: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => o.a,
            __next_app__: () => u,
            originalPathname: () => p,
            pages: () => c,
            routeModule: () => x,
            tree: () => n,
          }),
          s(8062),
          s(3321),
          s(4481),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var r = s(3191),
          a = s(8716),
          i = s(7922),
          o = s.n(i),
          l = s(5231),
          d = {};
        for (let e in l)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "originalPathname",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (d[e] = () => l[e]);
        s.d(t, d);
        let n = [
            "",
            {
              children: [
                "dashboard",
                {
                  children: [
                    "trips",
                    {
                      children: [
                        "create",
                        {
                          children: [
                            "__PAGE__",
                            {},
                            {
                              page: [
                                () => Promise.resolve().then(s.bind(s, 8062)),
                                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\trips\\create\\page.tsx",
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
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\trips\\create\\page.tsx",
          ],
          p = "/dashboard/trips/create/page",
          u = { require: s, loadChunk: () => Promise.resolve() },
          x = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/dashboard/trips/create/page",
              pathname: "/dashboard/trips/create",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: n },
          });
      },
      4914: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 8537));
      },
      8537: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => d }));
        var r = s(326),
          a = s(7577),
          i = s(5047),
          o = s(4545);
        let l =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://radaa-1.onrender.com/api";
        function d() {
          let e = (0, i.useRouter)(),
            [t, s] = (0, a.useState)(null),
            [d, n] = (0, a.useState)(""),
            [c, p] = (0, a.useState)(""),
            [u, x] = (0, a.useState)(""),
            [m, h] = (0, a.useState)(!1),
            [b, g] = (0, a.useState)(null),
            [y, f] = (0, a.useState)(null),
            [v, j] = (0, a.useState)(null),
            N = (0, o.N3)("trip_ui_v1", !1),
            k = async (s) => {
              if ((s.preventDefault(), t)) {
                (g(null), f(null), h(!0));
                try {
                  let s = await fetch(`${l}/trips/start`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId: t,
                        matatuId: d,
                        lat: c,
                        lng: u,
                      }),
                    }),
                    r = await s.json().catch(() => null);
                  if (!s.ok) {
                    let e =
                      (r && "object" == typeof r && (r.message || r.error)) ||
                      "Failed to start trip";
                    throw Error(e);
                  }
                  (f("Trip started successfully"),
                    r && r._id && e.push(`/dashboard/trips/${r._id}`));
                } catch (e) {
                  g(e instanceof Error ? e.message : "Failed to start trip");
                } finally {
                  h(!1);
                }
              }
            },
            q = m || !t;
          return (0, r.jsxs)("div", {
            className: "space-y-6",
            children: [
              (0, r.jsxs)("header", {
                className: "space-y-2",
                children: [
                  r.jsx("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "Start a new trip",
                  }),
                  r.jsx("p", {
                    className: "text-xs text-slate-300",
                    children:
                      "Record a new trip by linking a user to a matatu and initial coordinates. You can stop the trip later with the final fare and drop-off location.",
                  }),
                ],
              }),
              N &&
                (0, r.jsxs)("section", {
                  className:
                    "grid gap-2 text-[11px] text-slate-300 md:grid-cols-3",
                  children: [
                    (0, r.jsxs)("div", {
                      className:
                        "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                      children: [
                        r.jsx("div", {
                          className: "text-slate-400",
                          children: "Step 1",
                        }),
                        r.jsx("div", {
                          className: "mt-0.5 font-semibold text-slate-50",
                          children: "Pick a matatu",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className:
                        "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                      children: [
                        r.jsx("div", {
                          className: "text-slate-400",
                          children: "Step 2",
                        }),
                        r.jsx("div", {
                          className: "mt-0.5 font-semibold text-slate-50",
                          children: "Set start location",
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className:
                        "rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2",
                      children: [
                        r.jsx("div", {
                          className: "text-slate-400",
                          children: "Step 3",
                        }),
                        r.jsx("div", {
                          className: "mt-0.5 font-semibold text-slate-50",
                          children: "Start trip",
                        }),
                      ],
                    }),
                  ],
                }),
              !t &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100",
                  children:
                    "No user ID found. Make sure you are logged in via the auth screens before creating trips.",
                }),
              b &&
                r.jsx("div", {
                  className:
                    "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200",
                  children: b,
                }),
              y &&
                r.jsx("div", {
                  className:
                    "rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200",
                  children: y,
                }),
              (0, r.jsxs)("form", {
                onSubmit: k,
                className:
                  "space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                children: [
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      r.jsx("label", {
                        htmlFor: "matatuId",
                        className: "text-xs font-medium text-slate-100",
                        children: "Matatu ID",
                      }),
                      r.jsx("input", {
                        id: "matatuId",
                        type: "text",
                        required: !0,
                        value: d,
                        onChange: (e) => n(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "Paste a matatu MongoDB ID",
                      }),
                      r.jsx("p", {
                        className: "text-[11px] text-slate-500",
                        children:
                          "Use the ID from the Matatus list or backend logs while wiring things up.",
                      }),
                    ],
                  }),
                  N &&
                    (0, r.jsxs)("div", {
                      className: "space-y-1",
                      children: [
                        r.jsx("button", {
                          type: "button",
                          onClick: () => {
                            j("Geolocation is not available in this browser.");
                          },
                          className:
                            "inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/15 px-3 py-1.5 text-[11px] font-medium text-sky-100 shadow-sm transition hover:border-sky-400 hover:bg-sky-600/25",
                          children: "Use my current location",
                        }),
                        v &&
                          r.jsx("p", {
                            className: "text-[11px] text-slate-400",
                            children: v,
                          }),
                      ],
                    }),
                  (0, r.jsxs)("div", {
                    className: "grid gap-4 md:grid-cols-2",
                    children: [
                      (0, r.jsxs)("div", {
                        className: "space-y-1",
                        children: [
                          r.jsx("label", {
                            htmlFor: "lat",
                            className: "text-xs font-medium text-slate-100",
                            children: "Start latitude",
                          }),
                          r.jsx("input", {
                            id: "lat",
                            type: "number",
                            step: "0.0001",
                            required: !0,
                            value: c,
                            onChange: (e) => p(e.target.value),
                            className:
                              "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                            placeholder: "-1.2864",
                          }),
                        ],
                      }),
                      (0, r.jsxs)("div", {
                        className: "space-y-1",
                        children: [
                          r.jsx("label", {
                            htmlFor: "lng",
                            className: "text-xs font-medium text-slate-100",
                            children: "Start longitude",
                          }),
                          r.jsx("input", {
                            id: "lng",
                            type: "number",
                            step: "0.0001",
                            required: !0,
                            value: u,
                            onChange: (e) => x(e.target.value),
                            className:
                              "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                            placeholder: "36.8219",
                          }),
                        ],
                      }),
                    ],
                  }),
                  r.jsx("button", {
                    type: "submit",
                    disabled: q,
                    className:
                      "inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                    children: q
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
      8062: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => o, __esModule: () => i, default: () => l }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\trips\create\page.tsx`,
          ),
          { __esModule: i, $$typeof: o } = a;
        a.default;
        let l = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\trips\create\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462, 754], () => s(6831));
  module.exports = r;
})();
