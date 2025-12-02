(() => {
  var e = {};
  ((e.id = 274),
    (e.ids = [274]),
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
      4661: (e, t, r) => {
        "use strict";
        (r.r(t),
          r.d(t, {
            GlobalError: () => n.a,
            __next_app__: () => p,
            originalPathname: () => c,
            pages: () => u,
            routeModule: () => x,
            tree: () => d,
          }),
          r(6274),
          r(3182),
          r(1799),
          r(6083),
          r(9644),
          r(5866));
        var s = r(3191),
          a = r(8716),
          i = r(7922),
          n = r.n(i),
          o = r(5231),
          l = {};
        for (let e in o)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "originalPathname",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (l[e] = () => o[e]);
        r.d(t, l);
        let d = [
            "",
            {
              children: [
                "auth",
                {
                  children: [
                    "login-driver",
                    {
                      children: [
                        "__PAGE__",
                        {},
                        {
                          page: [
                            () => Promise.resolve().then(r.bind(r, 6274)),
                            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\login-driver\\page.tsx",
                          ],
                        },
                      ],
                    },
                    {},
                  ],
                },
                {
                  layout: [
                    () => Promise.resolve().then(r.bind(r, 3182)),
                    "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\layout.tsx",
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
          u = [
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\login-driver\\page.tsx",
          ],
          c = "/auth/login-driver/page",
          p = { require: r, loadChunk: () => Promise.resolve() },
          x = new s.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/auth/login-driver/page",
              pathname: "/auth/login-driver",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      564: (e, t, r) => {
        Promise.resolve().then(r.bind(r, 4704));
      },
      4704: (e, t, r) => {
        "use strict";
        (r.r(t), r.d(t, { default: () => d }));
        var s = r(326),
          a = r(7577),
          i = r(434),
          n = r(5047),
          o = r(732),
          l = r(4545);
        function d() {
          let { login: e, loading: t } = (0, o.a)(),
            r = (0, n.useRouter)(),
            [d, u] = (0, a.useState)(""),
            [c, p] = (0, a.useState)(""),
            [x, m] = (0, a.useState)(null),
            [h, g] = (0, a.useState)(!1),
            f = (0, l.N3)("driver_onboard_v1", !1),
            v = async (t) => {
              (t.preventDefault(), m(null), g(!0));
              try {
                (await e({ email: d, password: c }),
                  r.push("/dashboard/driver/live"));
              } catch (e) {
                m(e instanceof Error ? e.message : "Login failed");
              } finally {
                g(!1);
              }
            },
            b = h || t;
          return (0, s.jsxs)("div", {
            className: "mx-auto max-w-md space-y-6",
            children: [
              (0, s.jsxs)("div", {
                className: "space-y-2",
                children: [
                  s.jsx("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "Driver sign in",
                  }),
                  s.jsx("p", {
                    className: "text-sm text-slate-300",
                    children:
                      "Sign in to access the live driver dashboard and manage ride requests.",
                  }),
                ],
              }),
              f &&
                (0, s.jsxs)("div", {
                  className:
                    "rounded-lg border border-emerald-600/50 bg-emerald-600/10 px-3 py-2 text-xs text-emerald-100",
                  children: [
                    s.jsx("p", {
                      className: "font-medium",
                      children: "New driver flow (beta)",
                    }),
                    s.jsx("p", {
                      className: "mt-0.5 text-[11px] text-emerald-100/90",
                      children:
                        "Use the driver sign in and live dashboard to test how rides feel from behind the wheel. This flow is feature-flagged and safe to tweak.",
                    }),
                  ],
                }),
              x &&
                s.jsx("div", {
                  className:
                    "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200",
                  children: x,
                }),
              (0, s.jsxs)("form", {
                onSubmit: v,
                className: "space-y-4",
                children: [
                  (0, s.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      s.jsx("label", {
                        htmlFor: "email",
                        className: "text-sm font-medium text-slate-100",
                        children: "Email",
                      }),
                      s.jsx("input", {
                        id: "email",
                        type: "email",
                        autoComplete: "email",
                        required: !0,
                        value: d,
                        onChange: (e) => u(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500",
                        placeholder: "you@example.com",
                      }),
                    ],
                  }),
                  (0, s.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      s.jsx("label", {
                        htmlFor: "password",
                        className: "text-sm font-medium text-slate-100",
                        children: "Password",
                      }),
                      s.jsx("input", {
                        id: "password",
                        type: "password",
                        autoComplete: "current-password",
                        required: !0,
                        value: c,
                        onChange: (e) => p(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500",
                        placeholder: "••••••••",
                      }),
                    ],
                  }),
                  s.jsx("button", {
                    type: "submit",
                    disabled: b,
                    className:
                      "inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                    children: b ? "Signing in..." : "Sign in as driver",
                  }),
                ],
              }),
              (0, s.jsxs)("p", {
                className: "text-center text-xs text-slate-400",
                children: [
                  "Need a driver account?",
                  " ",
                  s.jsx(i.default, {
                    href: "/auth/register-driver",
                    className:
                      "font-medium text-emerald-400 hover:text-emerald-300",
                    children: "Create one",
                  }),
                ],
              }),
              (0, s.jsxs)("p", {
                className: "text-center text-xs text-slate-500",
                children: [
                  "Not a driver?",
                  " ",
                  s.jsx(i.default, {
                    href: "/auth/login",
                    className: "font-medium text-sky-400 hover:text-sky-300",
                    children: "Go to passenger/admin login",
                  }),
                ],
              }),
            ],
          });
        }
      },
      3182: (e, t, r) => {
        "use strict";
        (r.r(t), r.d(t, { default: () => a }));
        var s = r(9510);
        function a({ children: e }) {
          return s.jsx("div", {
            className:
              "flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-50",
            children: s.jsx("div", {
              className:
                "w-full max-w-md space-y-6 rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg",
              children: e,
            }),
          });
        }
      },
      6274: (e, t, r) => {
        "use strict";
        (r.r(t),
          r.d(t, { $$typeof: () => n, __esModule: () => i, default: () => o }));
        var s = r(8570);
        let a = (0, s.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\login-driver\page.tsx`,
          ),
          { __esModule: i, $$typeof: n } = a;
        a.default;
        let o = (0, s.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\login-driver\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../webpack-runtime.js");
  t.C(e);
  var r = (e) => t((t.s = e)),
    s = t.X(0, [489, 496, 462], () => r(4661));
  module.exports = s;
})();
