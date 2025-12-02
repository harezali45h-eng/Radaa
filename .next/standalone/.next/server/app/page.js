(() => {
  var e = {};
  ((e.id = 931),
    (e.ids = [931]),
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
      6042: (e, t, r) => {
        "use strict";
        (r.r(t),
          r.d(t, {
            GlobalError: () => o.a,
            __next_app__: () => u,
            originalPathname: () => p,
            pages: () => c,
            routeModule: () => x,
            tree: () => d,
          }),
          r(908),
          r(1799),
          r(6083),
          r(9644),
          r(5866));
        var s = r(3191),
          a = r(8716),
          i = r(7922),
          o = r.n(i),
          n = r(5231),
          l = {};
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
            ].indexOf(e) && (l[e] = () => n[e]);
        r.d(t, l);
        let d = [
            "",
            {
              children: [
                "__PAGE__",
                {},
                {
                  page: [
                    () => Promise.resolve().then(r.bind(r, 908)),
                    "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\page.tsx",
                  ],
                },
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(r.bind(r, 1799)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\layout.tsx",
              ],
              error: [
                () => Promise.resolve().then(r.bind(r, 6083)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\error.tsx",
              ],
              loading: [
                () => Promise.resolve().then(r.bind(r, 9644)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\loading.tsx",
              ],
              "not-found": [
                () => Promise.resolve().then(r.t.bind(r, 5866, 23)),
                "next/dist/client/components/not-found-error",
              ],
            },
          ],
          c = [
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\page.tsx",
          ],
          p = "/page",
          u = { require: r, loadChunk: () => Promise.resolve() },
          x = new s.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/page",
              pathname: "/",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      5667: (e, t, r) => {
        Promise.resolve().then(r.bind(r, 8743));
      },
      8743: (e, t, r) => {
        "use strict";
        (r.r(t), r.d(t, { default: () => l }));
        var s = r(326);
        r(7577);
        var a = r(434),
          i = r(5047),
          o = r(732),
          n = r(457);
        function l() {
          let { user: e, token: t, loading: r } = (0, o.a)();
          (0, i.useRouter)();
          let { activeMode: l } = (0, n.r)();
          return e || t
            ? s.jsx("div", {
                className: "space-y-2 text-sm text-slate-300",
                children: s.jsx("p", {
                  children: "Redirecting to your dashboard...",
                }),
              })
            : (0, s.jsxs)("div", {
                className: "space-y-6",
                children: [
                  (0, s.jsxs)("section", {
                    className: "space-y-3",
                    children: [
                      s.jsx("h1", {
                        className: "text-3xl font-semibold tracking-tight",
                        children: "Welcome to Radaa",
                      }),
                      s.jsx("p", {
                        className: "max-w-2xl text-sm text-slate-300",
                        children:
                          "Track live matatus, manage your rides, and unlock free trips through the built-in loyalty program.",
                      }),
                    ],
                  }),
                  (0, s.jsxs)("section", {
                    className: "grid gap-4 md:grid-cols-3",
                    children: [
                      (0, s.jsxs)(a.default, {
                        href: "/map",
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-sky-500/80 hover:bg-slate-900",
                        children: [
                          s.jsx("h2", {
                            className: "text-base font-semibold",
                            children: "Live Matatu Map",
                          }),
                          s.jsx("p", {
                            className: "mt-1 text-xs text-slate-300",
                            children:
                              "See matatus in real time, including their latest location and basic route details.",
                          }),
                        ],
                      }),
                      (0, s.jsxs)(a.default, {
                        href: "/profile",
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-emerald-500/80 hover:bg-slate-900",
                        children: [
                          s.jsx("h2", {
                            className: "text-base font-semibold",
                            children: "Your Profile & Loyalty",
                          }),
                          s.jsx("p", {
                            className: "mt-1 text-xs text-slate-300",
                            children:
                              "View your ride history, loyalty progress, and unlocked free rides.",
                          }),
                        ],
                      }),
                      (0, s.jsxs)(a.default, {
                        href: "/payments",
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-amber-400/80 hover:bg-slate-900",
                        children: [
                          s.jsx("h2", {
                            className: "text-base font-semibold",
                            children: "Quick Payments",
                          }),
                          s.jsx("p", {
                            className: "mt-1 text-xs text-slate-300",
                            children:
                              "Initiate and verify payments via Mpesa, card, or other providers (sandboxed).",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              });
        }
      },
      908: (e, t, r) => {
        "use strict";
        (r.r(t),
          r.d(t, { $$typeof: () => o, __esModule: () => i, default: () => n }));
        var s = r(8570);
        let a = (0, s.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\page.tsx`,
          ),
          { __esModule: i, $$typeof: o } = a;
        a.default;
        let n = (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\page.tsx#default`,
        );
      },
    }));
  var t = require("../webpack-runtime.js");
  t.C(e);
  var r = (e) => t((t.s = e)),
    s = t.X(0, [489, 496, 462], () => r(6042));
  module.exports = s;
})();
