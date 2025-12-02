(() => {
  var e = {};
  ((e.id = 702),
    (e.ids = [702]),
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
      9803: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => i.a,
            __next_app__: () => p,
            originalPathname: () => x,
            pages: () => c,
            routeModule: () => u,
            tree: () => o,
          }),
          s(9521),
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
                    "__PAGE__",
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(s.bind(s, 9521)),
                        "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\page.tsx",
                      ],
                    },
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
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\dashboard\\page.tsx",
          ],
          x = "/dashboard/page",
          p = { require: s, loadChunk: () => Promise.resolve() },
          u = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/dashboard/page",
              pathname: "/dashboard",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: o },
          });
      },
      861: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 7581));
      },
      7581: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => n }));
        var r = s(326),
          a = s(7577),
          l = s(434),
          i = s(732);
        (s(8699), s(6334));
        var d = s(9285);
        function n() {
          let { user: e, token: t, logout: s } = (0, i.a)(),
            [n, o] = (0, a.useState)(null),
            [c, x] = (0, a.useState)(!0),
            [p, u] = (0, a.useState)(null),
            [m, h] = (0, a.useState)(null),
            [b, f] = (0, a.useState)(!1),
            y = n ?? e;
          return (0, r.jsxs)("div", {
            className: "space-y-6",
            children: [
              (0, r.jsxs)("header", {
                className:
                  "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                children: [
                  (0, r.jsxs)("div", {
                    children: [
                      (0, r.jsxs)("h1", {
                        className: "text-2xl font-bold tracking-tight",
                        children: ["Welcome back", y ? ", " : "", y?.username],
                      }),
                      r.jsx("p", {
                        className: "text-xs text-slate-300",
                        children:
                          "Your central hub for matatus, trips, loyalty, and payments.",
                      }),
                    ],
                  }),
                  r.jsx("button", {
                    type: "button",
                    onClick: s,
                    className:
                      "inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm transition hover:border-red-500/60 hover:bg-red-600/10 hover:text-red-200",
                    children: "Log out",
                  }),
                ],
              }),
              (0, r.jsxs)("section", {
                className: "radaa-card space-y-2 p-3 text-xs",
                children: [
                  r.jsx("div", {
                    className: "flex items-center justify-between gap-2",
                    children: r.jsx("h2", {
                      className:
                        "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                      children: "Quick actions",
                    }),
                  }),
                  (0, r.jsxs)("div", {
                    className: "flex flex-wrap gap-2 text-[11px]",
                    children: [
                      r.jsx(l.default, {
                        href: "/map",
                        className:
                          "inline-flex flex-none items-center justify-center rounded-md border border-sky-600/40 bg-sky-600/15 px-3 py-1.5 font-medium text-sky-200 transition hover:border-sky-400/70 hover:bg-sky-600/25",
                        children: "Open live map",
                      }),
                      r.jsx(l.default, {
                        href: "/dashboard/matatus/list",
                        className:
                          "inline-flex flex-none items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90",
                        children: "View matatus",
                      }),
                      r.jsx(l.default, {
                        href: "/dashboard/trips/list",
                        className:
                          "inline-flex flex-none items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90",
                        children: "View trips",
                      }),
                      r.jsx(l.default, {
                        href: "/payments",
                        className:
                          "inline-flex flex-none items-center justify-center rounded-md border border-emerald-600/40 bg-emerald-600/10 px-3 py-1.5 font-medium text-emerald-200 transition hover:border-emerald-400/70 hover:bg-emerald-600/20",
                        children: "Payments & wallet",
                      }),
                      r.jsx(d.Z, {}),
                    ],
                  }),
                ],
              }),
              c &&
                r.jsx("div", {
                  className: "radaa-card p-4 text-xs text-slate-300",
                  children: "Loading your profile...",
                }),
              p &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                  children: p,
                }),
              y &&
                !c &&
                !p &&
                (0, r.jsxs)(r.Fragment, {
                  children: [
                    (0, r.jsxs)("section", {
                      className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                      children: [
                        (0, r.jsxs)("div", {
                          className: "radaa-card p-4 text-xs",
                          children: [
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "Email",
                            }),
                            r.jsx("div", {
                              className:
                                "mt-1 text-sm font-semibold text-slate-100",
                              children: y.email,
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "radaa-card p-4 text-xs",
                          children: [
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "Handle",
                            }),
                            r.jsx("div", {
                              className:
                                "mt-1 text-sm font-semibold text-slate-100",
                              children: y.handle || "Not set",
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                          children: [
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "Joined",
                            }),
                            r.jsx("div", {
                              className:
                                "mt-1 text-sm font-semibold text-slate-100",
                              children: y.createdAt
                                ? new Date(y.createdAt).toLocaleDateString()
                                : "—",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, r.jsxs)("section", {
                      className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                      children: [
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                          children: [
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "Active matatus",
                            }),
                            r.jsx("div", {
                              className:
                                "mt-1 text-lg font-semibold text-sky-400",
                              children: b ? "—" : (m?.activeMatatus ?? 0),
                            }),
                            r.jsx("p", {
                              className: "mt-1 text-[11px] text-slate-400",
                              children: "Based on current live map data.",
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                          children: [
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "Wallet summary",
                            }),
                            (0, r.jsxs)("div", {
                              className:
                                "mt-1 text-lg font-semibold text-emerald-400",
                              children: ["KES ", m?.loyalty?.balance ?? 0],
                            }),
                            (0, r.jsxs)("p", {
                              className: "mt-1 text-[11px] text-slate-400",
                              children: [
                                "Loyalty points: ",
                                m?.loyalty?.loyaltyPoints ?? 0,
                              ],
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className:
                            "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                          children: [
                            r.jsx("div", {
                              className: "text-slate-400",
                              children: "Trip stats",
                            }),
                            (0, r.jsxs)("div", {
                              className:
                                "mt-1 text-sm font-semibold text-slate-100",
                              children: [
                                m?.loyalty?.ridesTaken ?? 0,
                                " rides taken",
                              ],
                            }),
                            (0, r.jsxs)("div", {
                              className: "mt-1 text-xs text-slate-300",
                              children: [
                                "Paid rides: ",
                                m?.loyalty?.ridesPaid ?? 0,
                              ],
                            }),
                            r.jsx("div", {
                              className:
                                "mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800",
                              children: r.jsx("div", {
                                className: "h-full rounded-full bg-sky-500",
                                style: {
                                  width: `${Math.max(0, Math.min(100, ((m?.loyalty?.loyalty?.paidRidesCount ?? 0) / 10) * 100))}%`,
                                },
                              }),
                            }),
                            (0, r.jsxs)("p", {
                              className: "mt-1 text-[11px] text-slate-400",
                              children: [
                                m?.loyalty?.loyalty?.paidRidesCount ?? 0,
                                "/10 paid rides towards a free ride.",
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, r.jsxs)("section", {
                      className: "grid gap-4 lg:grid-cols-[2fr,1fr]",
                      children: [
                        (0, r.jsxs)("div", {
                          className: "radaa-card p-4 text-xs",
                          children: [
                            (0, r.jsxs)("div", {
                              className: "flex items-center justify-between",
                              children: [
                                (0, r.jsxs)("div", {
                                  children: [
                                    r.jsx("div", {
                                      className:
                                        "text-sm font-semibold text-slate-100",
                                      children: "Live map preview",
                                    }),
                                    r.jsx("div", {
                                      className: "text-[11px] text-slate-400",
                                      children:
                                        "Quick glance at matatus currently online. Open the full map for details.",
                                    }),
                                  ],
                                }),
                                r.jsx("a", {
                                  href: "/map",
                                  className:
                                    "text-[11px] font-medium text-sky-400 hover:text-sky-300",
                                  children: "Open map",
                                }),
                              ],
                            }),
                            (0, r.jsxs)("div", {
                              className:
                                "mt-3 grid grid-cols-3 gap-2 text-[10px]",
                              children: [
                                b &&
                                  r.jsx("div", {
                                    className:
                                      "col-span-3 h-16 animate-pulse rounded-lg bg-slate-800/60",
                                  }),
                                !b &&
                                  m?.liveSample.length === 0 &&
                                  r.jsx("p", {
                                    className: "col-span-3 text-slate-400",
                                    children: "No live matatus at the moment.",
                                  }),
                                !b &&
                                  m?.liveSample.map((e) =>
                                    r.jsx(
                                      "div",
                                      {
                                        className:
                                          "flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-2",
                                        children: r.jsxs("div", {
                                          children: [
                                            r.jsx("div", {
                                              className:
                                                "text-[11px] font-semibold text-slate-100",
                                              children:
                                                e.plate ||
                                                e.numberPlate ||
                                                e.id.slice(0, 4),
                                            }),
                                            r.jsx("div", {
                                              className:
                                                "text-[10px] text-slate-400",
                                              children: e.route ?? "Route TBD",
                                            }),
                                          ],
                                        }),
                                      },
                                      e.id,
                                    ),
                                  ),
                              ],
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "space-y-3 radaa-card p-4 text-xs",
                          children: [
                            (0, r.jsxs)("div", {
                              className: "flex items-center justify-between",
                              children: [
                                (0, r.jsxs)("div", {
                                  children: [
                                    r.jsx("div", {
                                      className:
                                        "text-sm font-semibold text-slate-100",
                                      children: "Your active trips",
                                    }),
                                    r.jsx("div", {
                                      className: "text-[11px] text-slate-400",
                                      children:
                                        "When a trip is live, it will appear here with quick actions.",
                                    }),
                                  ],
                                }),
                                r.jsx("span", {
                                  className:
                                    "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200",
                                  children: 0,
                                }),
                              ],
                            }),
                            r.jsx("div", {
                              className:
                                "rounded-md border border-dashed border-slate-700 bg-slate-900/60 px-3 py-4 text-[11px] text-slate-400",
                              children:
                                "No active trips right now. Start a ride from your matatu or trips section.",
                            }),
                            r.jsx("a", {
                              href: "/dashboard/trips/list",
                              className:
                                "inline-flex items-center text-[11px] font-medium text-sky-400 hover:text-sky-300",
                              children: "View all trips",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              !c &&
                !y &&
                !p &&
                r.jsx("div", {
                  className:
                    "rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100",
                  children:
                    "We couldn't find your profile details. Try signing out and back in again.",
                }),
            ],
          });
        }
      },
      9285: (e, t, s) => {
        "use strict";
        s.d(t, { Z: () => n });
        var r = s(326),
          a = s(7577),
          l = s(732),
          i = s(7772);
        s(4951);
        var d = s(676);
        function n() {
          let { token: e } = (0, l.a)(),
            { addNotification: t } = (0, i.z)(),
            [s, n] = (0, a.useState)(!1),
            { primaryButtonClass: o } = (0, d.F)();
          return r.jsx("button", {
            type: "button",
            onClick: () => {
              if (!e) {
                t({
                  type: "system",
                  title: "Sign in required",
                  message: "You need to be signed in to request a ride.",
                });
                return;
              }
              t({
                type: "system",
                title: "Location unavailable",
                message: "Geolocation is not available in this browser.",
              });
            },
            disabled: s,
            className: `${o} flex-none text-[11px] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60`,
            children: s ? "Requesting ride..." : "Request a ride",
          });
        }
      },
      4951: (e, t, s) => {
        "use strict";
        s.d(t, { jc: () => l, nW: () => i });
        var r = s(6334);
        async function a(e, t = {}) {
          let s;
          let { method: a = "GET", body: l, token: i } = t,
            d = {};
          i && (d.Authorization = `Bearer ${i}`);
          for (let t = 1; t <= 3; t += 1)
            try {
              let t = (
                await r.ZP.request({ url: e, method: a, data: l, headers: d })
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
            } catch (l) {
              ((s = l), console.error("API ERROR:", l?.response?.data || l));
              let e = l?.response?.status,
                r = l?.response?.data,
                a =
                  (r && "object" == typeof r && (r.message || r.error)) ||
                  l?.message ||
                  "Request failed";
              if (e && e >= 500 && t < 3) {
                s = Error(a);
                continue;
              }
              throw Error(a);
            }
          throw s instanceof Error ? s : Error("Request failed");
        }
        async function l(e, t) {
          return a("/rides/request", { method: "POST", body: e, token: t });
        }
        async function i(e, t) {
          return a(`/rides/${e}/accept`, { method: "POST", token: t });
        }
      },
      9521: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => i, __esModule: () => l, default: () => d }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\page.tsx`,
          ),
          { __esModule: l, $$typeof: i } = a;
        a.default;
        let d = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\dashboard\page.tsx#default`,
        );
      },
    }));
  var t = require("../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462, 754], () => s(9803));
  module.exports = r;
})();
