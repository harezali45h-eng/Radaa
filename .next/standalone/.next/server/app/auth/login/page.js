(() => {
  var e = {};
  ((e.id = 716),
    (e.ids = [716]),
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
      1644: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => n.a,
            __next_app__: () => x,
            originalPathname: () => u,
            pages: () => c,
            routeModule: () => p,
            tree: () => d,
          }),
          s(4595),
          s(3182),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var r = s(3191),
          a = s(8716),
          i = s(7922),
          n = s.n(i),
          o = s(5231),
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
        s.d(t, l);
        let d = [
            "",
            {
              children: [
                "auth",
                {
                  children: [
                    "login",
                    {
                      children: [
                        "__PAGE__",
                        {},
                        {
                          page: [
                            () => Promise.resolve().then(s.bind(s, 4595)),
                            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\login\\page.tsx",
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
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\login\\page.tsx",
          ],
          u = "/auth/login/page",
          x = { require: s, loadChunk: () => Promise.resolve() },
          p = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/auth/login/page",
              pathname: "/auth/login",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      6463: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 7241));
      },
      7241: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => l }));
        var r = s(326),
          a = s(7577),
          i = s(434),
          n = s(5047),
          o = s(732);
        function l() {
          let { login: e, loading: t } = (0, o.a)(),
            s = (0, n.useRouter)(),
            [l, d] = (0, a.useState)(""),
            [c, u] = (0, a.useState)(""),
            [x, p] = (0, a.useState)(!1),
            [m, h] = (0, a.useState)(!1),
            [g, y] = (0, a.useState)(null),
            [f, b] = (0, a.useState)(!1),
            v = async (t) => {
              (t.preventDefault(), y(null), b(!0));
              try {
                (await e({ email: l, password: c }, x), s.push("/dashboard"));
              } catch (e) {
                y(e instanceof Error ? e.message : "Login failed");
              } finally {
                b(!1);
              }
            },
            j = f || t;
          return (0, r.jsxs)("div", {
            className: "mx-auto max-w-md space-y-6",
            children: [
              (0, r.jsxs)("div", {
                className: "space-y-2",
                children: [
                  r.jsx("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "Sign in",
                  }),
                  r.jsx("p", {
                    className: "text-sm text-slate-300",
                    children:
                      "Access your Radaa dashboard to manage matatus, trips, and payments.",
                  }),
                ],
              }),
              (0, r.jsxs)("form", {
                onSubmit: v,
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
                        value: l,
                        onChange: (e) => d(e.target.value),
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
                      (0, r.jsxs)("div", {
                        className: "relative",
                        children: [
                          r.jsx("input", {
                            id: "password",
                            type: m ? "text" : "password",
                            autoComplete: "current-password",
                            required: !0,
                            value: c,
                            onChange: (e) => u(e.target.value),
                            className:
                              "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                            placeholder: "••••••••",
                            "aria-invalid": !!g,
                            "aria-describedby": g ? "password-error" : void 0,
                          }),
                          r.jsx("button", {
                            type: "button",
                            onClick: () => h((e) => !e),
                            className:
                              "absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-400 hover:text-slate-200 focus:outline-none",
                            "aria-label": m ? "Hide password" : "Show password",
                            children: m ? "Hide" : "Show",
                          }),
                        ],
                      }),
                      g &&
                        r.jsx("p", {
                          id: "password-error",
                          className: "text-xs text-red-400",
                          role: "alert",
                          children: g,
                        }),
                    ],
                  }),
                  r.jsx("div", {
                    className: "flex items-center justify-between",
                    children: (0, r.jsxs)("label", {
                      htmlFor: "rememberMe",
                      className:
                        "flex items-center space-x-2 text-xs text-slate-300",
                      children: [
                        r.jsx("input", {
                          id: "rememberMe",
                          type: "checkbox",
                          checked: x,
                          onChange: (e) => p(e.target.checked),
                          className:
                            "h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500",
                        }),
                        r.jsx("span", {
                          children: "Remember me on this device",
                        }),
                      ],
                    }),
                  }),
                  (0, r.jsxs)("button", {
                    type: "submit",
                    disabled: j,
                    className:
                      "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                    "aria-busy": j,
                    children: [
                      j &&
                        (0, r.jsxs)("svg", {
                          className: "mr-2 h-4 w-4 animate-spin text-sky-100",
                          viewBox: "0 0 24 24",
                          "aria-hidden": "true",
                          children: [
                            r.jsx("circle", {
                              className: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              strokeWidth: "4",
                              fill: "none",
                            }),
                            r.jsx("path", {
                              className: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z",
                            }),
                          ],
                        }),
                      r.jsx("span", {
                        children: j ? "Signing in..." : "Sign in",
                      }),
                    ],
                  }),
                ],
              }),
              (0, r.jsxs)("p", {
                className: "text-center text-xs text-slate-400",
                children: [
                  "Don't have an account?",
                  " ",
                  r.jsx(i.default, {
                    href: "/auth/register",
                    className: "font-medium text-sky-400 hover:text-sky-300",
                    children: "Create one",
                  }),
                ],
              }),
              (0, r.jsxs)("p", {
                className: "text-center text-xs text-slate-400",
                children: [
                  "Are you a SACCO admin?",
                  " ",
                  r.jsx(i.default, {
                    href: "/auth/login-sacco",
                    className: "font-medium text-sky-400 hover:text-sky-300",
                    children: "Sign in to SACCO dashboard",
                  }),
                ],
              }),
              (0, r.jsxs)("p", {
                className: "text-center text-xs text-slate-400",
                children: [
                  "Are you a driver?",
                  " ",
                  r.jsx(i.default, {
                    href: "/auth/login-driver",
                    className:
                      "font-medium text-emerald-400 hover:text-emerald-300",
                    children: "Sign in to driver dashboard",
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
      4595: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => n, __esModule: () => i, default: () => o }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\login\page.tsx`,
          ),
          { __esModule: i, $$typeof: n } = a;
        a.default;
        let o = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\login\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462], () => s(1644));
  module.exports = r;
})();
