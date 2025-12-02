(() => {
  var e = {};
  ((e.id = 916),
    (e.ids = [916]),
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
      9380: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => o.a,
            __next_app__: () => u,
            originalPathname: () => p,
            pages: () => c,
            routeModule: () => x,
            tree: () => l,
          }),
          s(2150),
          s(3321),
          s(4481),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var r = s(3191),
          a = s(8716),
          n = s(7922),
          o = s.n(n),
          d = s(5231),
          i = {};
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
            ].indexOf(e) && (i[e] = () => d[e]);
        s.d(t, i);
        let l = [
            "",
            {
              children: [
                "dashboard",
                {
                  children: [
                    "sacco",
                    {
                      children: [
                        "matatus",
                        {
                          children: [
                            "__PAGE__",
                            {},
                            {
                              page: [
                                () => Promise.resolve().then(s.bind(s, 2150)),
                                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\sacco\\matatus\\page.tsx",
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
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\sacco\\matatus\\page.tsx",
          ],
          p = "/dashboard/sacco/matatus/page",
          u = { require: s, loadChunk: () => Promise.resolve() },
          x = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/dashboard/sacco/matatus/page",
              pathname: "/dashboard/sacco/matatus",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: l },
          });
      },
      2724: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 4420));
      },
      4420: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => d }));
        var r = s(326),
          a = s(7577),
          n = s(732),
          o = s(5792);
        function d() {
          let { user: e, token: t } = (0, n.a)(),
            s = e?._id,
            [d, i] = (0, a.useState)([]),
            [l, c] = (0, a.useState)(!0),
            [p, u] = (0, a.useState)(null),
            x = e?.role === "admin",
            m = async (e, r) => {
              if (s && t)
                try {
                  let a = await (0, o.yb)(s, e, r, t);
                  i((e) => e.map((e) => (e._id === a._id ? a : e)));
                } catch (e) {
                  u(e instanceof Error ? e.message : "Unable to update matatu");
                }
            };
          return x
            ? (0, r.jsxs)("div", {
                className: "space-y-4",
                children: [
                  (0, r.jsxs)("header", {
                    className: "space-y-1",
                    children: [
                      r.jsx("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: "SACCO matatus",
                      }),
                      r.jsx("p", {
                        className: "text-xs text-slate-300",
                        children:
                          "Manage and monitor matatus registered under this SACCO.",
                      }),
                    ],
                  }),
                  p &&
                    r.jsx("div", {
                      className:
                        "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200",
                      children: p,
                    }),
                  l &&
                    r.jsx("section", {
                      className:
                        "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                      children: (0, r.jsxs)("div", {
                        className: "space-y-2",
                        children: [
                          r.jsx("div", {
                            className:
                              "h-4 w-32 animate-pulse rounded bg-slate-800/80",
                          }),
                          r.jsx("div", {
                            className:
                              "h-24 animate-pulse rounded-lg bg-slate-800/80",
                          }),
                        ],
                      }),
                    }),
                  !l &&
                    !p &&
                    0 === d.length &&
                    r.jsx("section", {
                      className:
                        "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                      children:
                        "No matatus are currently registered for this SACCO.",
                    }),
                  !l &&
                    !p &&
                    d.length > 0 &&
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
                                children: "Fleet",
                              }),
                              r.jsx("p", {
                                className: "text-[11px] text-slate-400",
                                children:
                                  "Vehicles under this SACCO and their approval status.",
                              }),
                            ],
                          }),
                        }),
                        r.jsx("div", {
                          className:
                            "overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70",
                          children: (0, r.jsxs)("table", {
                            className: "min-w-full border-collapse text-[11px]",
                            children: [
                              r.jsx("thead", {
                                className: "bg-slate-900/80 text-slate-300",
                                children: (0, r.jsxs)("tr", {
                                  children: [
                                    r.jsx("th", {
                                      className:
                                        "px-3 py-2 text-left font-medium",
                                      children: "Matatu",
                                    }),
                                    r.jsx("th", {
                                      className:
                                        "px-3 py-2 text-left font-medium",
                                      children: "Route",
                                    }),
                                    r.jsx("th", {
                                      className:
                                        "px-3 py-2 text-left font-medium",
                                      children: "Approval",
                                    }),
                                    r.jsx("th", {
                                      className:
                                        "px-3 py-2 text-right font-medium",
                                      children: "Actions",
                                    }),
                                  ],
                                }),
                              }),
                              r.jsx("tbody", {
                                children: d.map((e) =>
                                  (0, r.jsxs)(
                                    "tr",
                                    {
                                      className: "border-t border-slate-800/80",
                                      children: [
                                        r.jsx("td", {
                                          className: "px-3 py-2 text-slate-100",
                                          children:
                                            e.plate ||
                                            e.numberPlate ||
                                            e._id.slice(0, 6),
                                        }),
                                        r.jsx("td", {
                                          className: "px-3 py-2 text-slate-300",
                                          children: e.route ?? "—",
                                        }),
                                        r.jsx("td", {
                                          className: "px-3 py-2",
                                          children: r.jsx("span", {
                                            className:
                                              "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100",
                                            children:
                                              e.approvalStatus ?? "pending",
                                          }),
                                        }),
                                        r.jsx("td", {
                                          className: "px-3 py-2 text-right",
                                          children: (0, r.jsxs)("div", {
                                            className: "inline-flex gap-1",
                                            children: [
                                              r.jsx("button", {
                                                type: "button",
                                                onClick: () =>
                                                  m(e._id, "approved"),
                                                className:
                                                  "rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80",
                                                children: "Approve",
                                              }),
                                              r.jsx("button", {
                                                type: "button",
                                                onClick: () =>
                                                  m(e._id, "rejected"),
                                                className:
                                                  "rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80",
                                                children: "Reject",
                                              }),
                                            ],
                                          }),
                                        }),
                                      ],
                                    },
                                    e._id,
                                  ),
                                ),
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                ],
              })
            : r.jsx("div", {
                className: "space-y-4",
                children: (0, r.jsxs)("header", {
                  className: "space-y-1",
                  children: [
                    r.jsx("h1", {
                      className: "text-2xl font-semibold tracking-tight",
                      children: "SACCO matatus",
                    }),
                    r.jsx("p", {
                      className: "text-xs text-slate-300",
                      children:
                        "You must be signed in as a SACCO admin to view this page.",
                    }),
                  ],
                }),
              });
        }
      },
      5792: (e, t, s) => {
        "use strict";
        s.d(t, { Vh: () => d, o: () => n, v7: () => o, yb: () => i });
        var r = s(6334);
        async function a(e, t = {}) {
          let { method: s = "GET", body: a, token: n } = t,
            o = {};
          n && (o.Authorization = `Bearer ${n}`);
          try {
            let t = (
              await r.ZP.request({ url: e, method: s, data: a, headers: o })
            ).data;
            if (
              null != t &&
              t &&
              "object" == typeof t &&
              "success" in t &&
              !0 === t.success &&
              "data" in t
            )
              return t.data;
            return t;
          } catch (t) {
            let e = t?.response?.data;
            throw Error(
              (e && "object" == typeof e && (e.message || e.error)) ||
                t?.message ||
                "Request failed",
            );
          }
        }
        async function n(e, t, s, r) {
          let n = new FormData();
          return (
            n.append("file", s),
            n.append("type", t),
            a(`/sacco/${e}/docs`, { method: "POST", body: n, token: r ?? null })
          );
        }
        async function o(e, t, s, r) {
          return a(`/sacco/${e}/driver/${t}/disable`, {
            method: "POST",
            body: { enabled: s },
            token: r ?? null,
          });
        }
        async function d(e, t, s, r) {
          return a(`/sacco/${e}/driver/${t}/verification`, {
            method: "POST",
            body: { status: s },
            token: r ?? null,
          });
        }
        async function i(e, t, s, r) {
          return a(`/sacco/${e}/matatu/${t}/approval`, {
            method: "POST",
            body: { status: s },
            token: r ?? null,
          });
        }
      },
      2150: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => o, __esModule: () => n, default: () => d }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\sacco\matatus\page.tsx`,
          ),
          { __esModule: n, $$typeof: o } = a;
        a.default;
        let d = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\sacco\matatus\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462, 754], () => s(9380));
  module.exports = r;
})();
