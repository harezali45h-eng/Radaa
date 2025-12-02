"use strict";
(() => {
  var e = {};
  ((e.id = 770),
    (e.ids = [770]),
    (e.modules = {
      7849: (e) => {
        e.exports = require("next/dist/client/components/action-async-storage.external");
      },
      2934: (e) => {
        e.exports = require("next/dist/client/components/action-async-storage.external.js");
      },
      5403: (e) => {
        e.exports = require("next/dist/client/components/request-async-storage.external");
      },
      4580: (e) => {
        e.exports = require("next/dist/client/components/request-async-storage.external.js");
      },
      4749: (e) => {
        e.exports = require("next/dist/client/components/static-generation-async-storage.external");
      },
      5869: (e) => {
        e.exports = require("next/dist/client/components/static-generation-async-storage.external.js");
      },
      399: (e) => {
        e.exports = require("next/dist/compiled/next-server/app-page.runtime.prod.js");
      },
      9491: (e) => {
        e.exports = require("assert");
      },
      4300: (e) => {
        e.exports = require("buffer");
      },
      2081: (e) => {
        e.exports = require("child_process");
      },
      6113: (e) => {
        e.exports = require("crypto");
      },
      2361: (e) => {
        e.exports = require("events");
      },
      7147: (e) => {
        e.exports = require("fs");
      },
      3685: (e) => {
        e.exports = require("http");
      },
      5158: (e) => {
        e.exports = require("http2");
      },
      5687: (e) => {
        e.exports = require("https");
      },
      1808: (e) => {
        e.exports = require("net");
      },
      2037: (e) => {
        e.exports = require("os");
      },
      1017: (e) => {
        e.exports = require("path");
      },
      2781: (e) => {
        e.exports = require("stream");
      },
      4404: (e) => {
        e.exports = require("tls");
      },
      6224: (e) => {
        e.exports = require("tty");
      },
      7310: (e) => {
        e.exports = require("url");
      },
      3837: (e) => {
        e.exports = require("util");
      },
      9796: (e) => {
        e.exports = require("zlib");
      },
      6538: (e, r, t) => {
        (t.r(r),
          t.d(r, {
            GlobalError: () => n.a,
            __next_app__: () => u,
            originalPathname: () => x,
            pages: () => l,
            routeModule: () => c,
            tree: () => p,
          }),
          t(6641),
          t(1799),
          t(6083),
          t(9644),
          t(5866));
        var s = t(3191),
          a = t(8716),
          o = t(7922),
          n = t.n(o),
          i = t(5231),
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
        t.d(r, d);
        let p = [
            "",
            {
              children: [
                "free-ride",
                {
                  children: [
                    "__PAGE__",
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(t.bind(t, 6641)),
                        "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\free-ride\\page.tsx",
                      ],
                    },
                  ],
                },
                {},
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(t.bind(t, 1799)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\layout.tsx",
              ],
              error: [
                () => Promise.resolve().then(t.bind(t, 6083)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\error.tsx",
              ],
              loading: [
                () => Promise.resolve().then(t.bind(t, 9644)),
                "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\loading.tsx",
              ],
              "not-found": [
                () => Promise.resolve().then(t.t.bind(t, 5866, 23)),
                "next/dist/client/components/not-found-error",
              ],
            },
          ],
          l = [
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\free-ride\\page.tsx",
          ],
          x = "/free-ride/page",
          u = { require: t, loadChunk: () => Promise.resolve() },
          c = new s.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/free-ride/page",
              pathname: "/free-ride",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: p },
          });
      },
      6641: (e, r, t) => {
        (t.r(r), t.d(r, { default: () => a }));
        var s = t(9510);
        function a() {
          return (0, s.jsxs)("div", {
            className:
              "space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-center",
            children: [
              s.jsx("div", {
                className:
                  "inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300",
                children: "Loyalty milestone",
              }),
              s.jsx("h1", {
                className:
                  "text-3xl font-semibold tracking-tight text-emerald-300",
                children: "You've unlocked a FREE ride!",
              }),
              s.jsx("p", {
                className: "mx-auto max-w-md text-xs text-slate-300",
                children:
                  "Redeem this ride on your next trip. The backend increments your free ride balance every time you complete 10 paid rides.",
              }),
            ],
          });
        }
      },
    }));
  var r = require("../../webpack-runtime.js");
  r.C(e);
  var t = (e) => r((r.s = e)),
    s = r.X(0, [489, 462], () => t(6538));
  module.exports = s;
})();
