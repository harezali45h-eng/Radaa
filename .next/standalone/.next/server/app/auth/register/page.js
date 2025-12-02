(() => {
  var e = {};
  ((e.id = 454),
    (e.ids = [454]),
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
      9861: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => n.a,
            __next_app__: () => x,
            originalPathname: () => c,
            pages: () => u,
            routeModule: () => p,
            tree: () => d,
          }),
          s(3374),
          s(3182),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var r = s(3191),
          a = s(8716),
          l = s(7922),
          n = s.n(l),
          o = s(5231),
          i = {};
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
            ].indexOf(e) && (i[e] = () => o[e]);
        s.d(t, i);
        let d = [
            "",
            {
              children: [
                "auth",
                {
                  children: [
                    "register",
                    {
                      children: [
                        "__PAGE__",
                        {},
                        {
                          page: [
                            () => Promise.resolve().then(s.bind(s, 3374)),
                            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\register\\page.tsx",
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
          u = [
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\register\\page.tsx",
          ],
          c = "/auth/register/page",
          x = { require: s, loadChunk: () => Promise.resolve() },
          p = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/auth/register/page",
              pathname: "/auth/register",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      7654: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 353));
      },
      353: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => i }));
        var r = s(326),
          a = s(7577),
          l = s(434),
          n = s(5047),
          o = s(732);
        function i() {
          let { register: e, loading: t } = (0, o.a)(),
            s = (0, n.useRouter)(),
            [i, d] = (0, a.useState)(""),
            [u, c] = (0, a.useState)(""),
            [x, p] = (0, a.useState)(""),
            [m, h] = (0, a.useState)(""),
            [g, f] = (0, a.useState)(""),
            [y, b] = (0, a.useState)(null),
            [v, j] = (0, a.useState)(!1),
            w = async (t) => {
              (t.preventDefault(), b(null), j(!0));
              try {
                (await e({
                  username: i,
                  email: x,
                  password: g,
                  phone: m || void 0,
                  handle: u || void 0,
                }),
                  s.push("/dashboard"));
              } catch (e) {
                b(e instanceof Error ? e.message : "Registration failed");
              } finally {
                j(!1);
              }
            },
            q = v || t;
          return (0, r.jsxs)("div", {
            className: "mx-auto max-w-md space-y-6",
            children: [
              (0, r.jsxs)("div", {
                className: "space-y-2",
                children: [
                  r.jsx("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "Create your account",
                  }),
                  r.jsx("p", {
                    className: "text-sm text-slate-300",
                    children:
                      "Register to start managing matatus, trips, and payments in your Radaa dashboard.",
                  }),
                ],
              }),
              y &&
                r.jsx("div", {
                  className:
                    "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200",
                  children: y,
                }),
              (0, r.jsxs)("form", {
                onSubmit: w,
                className: "space-y-4",
                children: [
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      r.jsx("label", {
                        htmlFor: "username",
                        className: "text-sm font-medium text-slate-100",
                        children: "Username",
                      }),
                      r.jsx("input", {
                        id: "username",
                        type: "text",
                        required: !0,
                        value: i,
                        onChange: (e) => d(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "Jane Doe",
                      }),
                    ],
                  }),
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      (0, r.jsxs)("label", {
                        htmlFor: "handle",
                        className: "text-sm font-medium text-slate-100",
                        children: [
                          "Handle ",
                          r.jsx("span", {
                            className: "text-xs font-normal text-slate-400",
                            children: "(optional)",
                          }),
                        ],
                      }),
                      r.jsx("input", {
                        id: "handle",
                        type: "text",
                        value: u,
                        onChange: (e) => c(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "@radaa",
                      }),
                    ],
                  }),
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
                        value: x,
                        onChange: (e) => p(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "you@example.com",
                      }),
                    ],
                  }),
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      (0, r.jsxs)("label", {
                        htmlFor: "phone",
                        className: "text-sm font-medium text-slate-100",
                        children: [
                          "Phone ",
                          r.jsx("span", {
                            className: "text-xs font-normal text-slate-400",
                            children: "(optional)",
                          }),
                        ],
                      }),
                      r.jsx("input", {
                        id: "phone",
                        type: "tel",
                        value: m,
                        onChange: (e) => h(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "07xx xxx xxx",
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
                        autoComplete: "new-password",
                        required: !0,
                        value: g,
                        onChange: (e) => f(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "At least 6 characters",
                      }),
                    ],
                  }),
                  r.jsx("button", {
                    type: "submit",
                    disabled: q,
                    className:
                      "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                    children: q ? "Creating account..." : "Create account",
                  }),
                ],
              }),
              (0, r.jsxs)("p", {
                className: "text-center text-xs text-slate-400",
                children: [
                  "Already have an account?",
                  " ",
                  r.jsx(l.default, {
                    href: "/auth/login",
                    className: "font-medium text-sky-400 hover:text-sky-300",
                    children: "Sign in",
                  }),
                ],
              }),
              (0, r.jsxs)("p", {
                className: "text-center text-xs text-slate-400",
                children: [
                  "Want to drive with Radaa?",
                  " ",
                  r.jsx(l.default, {
                    href: "/auth/register-driver",
                    className:
                      "font-medium text-emerald-400 hover:text-emerald-300",
                    children: "Create a driver account",
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
      3374: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => n, __esModule: () => l, default: () => o }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\register\page.tsx`,
          ),
          { __esModule: l, $$typeof: n } = a;
        a.default;
        let o = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\register\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462], () => s(9861));
  module.exports = r;
})();
