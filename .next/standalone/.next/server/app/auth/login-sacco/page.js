(() => {
  var e = {};
  ((e.id = 102),
    (e.ids = [102]),
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
      5191: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => o.a,
            __next_app__: () => p,
            originalPathname: () => u,
            pages: () => c,
            routeModule: () => x,
            tree: () => d,
          }),
          s(2160),
          s(3182),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var r = s(3191),
          a = s(8716),
          i = s(7922),
          o = s.n(i),
          n = s(5231),
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
        s.d(t, l);
        let d = [
            "",
            {
              children: [
                "auth",
                {
                  children: [
                    "login-sacco",
                    {
                      children: [
                        "__PAGE__",
                        {},
                        {
                          page: [
                            () => Promise.resolve().then(s.bind(s, 2160)),
                            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\login-sacco\\page.tsx",
                          ],
                        },
                      ],
                    },
                    {},
                  ],
                },
                {
                  layout: [
                    () => Promise.resolve().then(s.bind(s, 3182)),
                    "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\layout.tsx",
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
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\login-sacco\\page.tsx",
          ],
          u = "/auth/login-sacco/page",
          p = { require: s, loadChunk: () => Promise.resolve() },
          x = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/auth/login-sacco/page",
              pathname: "/auth/login-sacco",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      7511: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 1938));
      },
      1938: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => d }));
        var r = s(326),
          a = s(7577),
          i = s(434),
          o = s(5047),
          n = s(732),
          l = s(4545);
        function d() {
          let { login: e, loading: t } = (0, n.a)(),
            s = (0, o.useRouter)(),
            [d, c] = (0, a.useState)(""),
            [u, p] = (0, a.useState)(""),
            [x, m] = (0, a.useState)(null),
            [h, g] = (0, a.useState)(!1),
            f = (0, l.N3)("sacco_onboard_v1", !1),
            y = async (t) => {
              (t.preventDefault(), m(null), g(!0));
              try {
                (await e({ email: d, password: u }),
                  s.push("/dashboard/sacco"));
              } catch (e) {
                m(e instanceof Error ? e.message : "Login failed");
              } finally {
                g(!1);
              }
            },
            b = h || t;
          return (0, r.jsxs)("div", {
            className: "mx-auto max-w-md space-y-6",
            children: [
              (0, r.jsxs)("div", {
                className: "space-y-2",
                children: [
                  r.jsx("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "SACCO sign in",
                  }),
                  r.jsx("p", {
                    className: "text-sm text-slate-300",
                    children:
                      "Sign in as a SACCO admin to manage your fleet and drivers in Radaa.",
                  }),
                ],
              }),
              f &&
                (0, r.jsxs)("div", {
                  className:
                    "rounded-lg border border-sky-600/60 bg-sky-600/10 px-3 py-2 text-xs text-sky-100",
                  children: [
                    r.jsx("p", {
                      className: "font-medium",
                      children: "New SACCO dashboard (beta)",
                    }),
                    r.jsx("p", {
                      className: "mt-0.5 text-[11px] text-sky-100/90",
                      children:
                        "Use this admin sign-in to explore the experimental SACCO fleet dashboard. This experience is safely feature-flagged while we iterate.",
                    }),
                  ],
                }),
              x &&
                r.jsx("div", {
                  className:
                    "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200",
                  children: x,
                }),
              (0, r.jsxs)("form", {
                onSubmit: y,
                className: "space-y-4",
                children: [
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      r.jsx("label", {
                        htmlFor: "email",
                        className: "text-sm font-medium text-slate-100",
                        children: "Email",
                      }),
                      r.jsx("input", {
                        id: "email",
                        type: "email",
                        autoComplete: "email",
                        required: !0,
                        value: d,
                        onChange: (e) => c(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "you@example.com",
                      }),
                    ],
                  }),
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      r.jsx("label", {
                        htmlFor: "password",
                        className: "text-sm font-medium text-slate-100",
                        children: "Password",
                      }),
                      r.jsx("input", {
                        id: "password",
                        type: "password",
                        autoComplete: "current-password",
                        required: !0,
                        value: u,
                        onChange: (e) => p(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "••••••••",
                      }),
                    ],
                  }),
                  r.jsx("button", {
                    type: "submit",
                    disabled: b,
                    className:
                      "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                    children: b ? "Signing in..." : "Sign in as SACCO",
                  }),
                ],
              }),
              (0, r.jsxs)("p", {
                className: "text-center text-xs text-slate-400",
                children: [
                  "Need a SACCO account?",
                  " ",
                  r.jsx(i.default, {
                    href: "/auth/register-sacco",
                    className: "font-medium text-sky-400 hover:text-sky-300",
                    children: "Create one",
                  }),
                ],
              }),
              (0, r.jsxs)("p", {
                className: "text-center text-xs text-slate-500",
                children: [
                  "Not a SACCO admin?",
                  " ",
                  r.jsx(i.default, {
                    href: "/auth/login",
                    className: "font-medium text-sky-400 hover:text-sky-300",
                    children: "Go to main login",
                  }),
                ],
              }),
            ],
          });
        }
      },
      3182: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => a }));
        var r = s(9510);
        function a({ children: e }) {
          return r.jsx("div", {
            className:
              "flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-50",
            children: r.jsx("div", {
              className:
                "w-full max-w-md space-y-6 rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg",
              children: e,
            }),
          });
        }
      },
      2160: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => o, __esModule: () => i, default: () => n }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\login-sacco\page.tsx`,
          ),
          { __esModule: i, $$typeof: o } = a;
        a.default;
        let n = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\login-sacco\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462], () => s(5191));
  module.exports = r;
})();
