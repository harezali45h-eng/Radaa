(() => {
  var e = {};
  ((e.id = 629),
    (e.ids = [629]),
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
      5397: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, {
            GlobalError: () => o.a,
            __next_app__: () => x,
            originalPathname: () => u,
            pages: () => c,
            routeModule: () => p,
            tree: () => d,
          }),
          s(337),
          s(3182),
          s(1799),
          s(6083),
          s(9644),
          s(5866));
        var r = s(3191),
          a = s(8716),
          l = s(7922),
          o = s.n(l),
          i = s(5231),
          n = {};
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
            ].indexOf(e) && (n[e] = () => i[e]);
        s.d(t, n);
        let d = [
            "",
            {
              children: [
                "auth",
                {
                  children: [
                    "register-sacco",
                    {
                      children: [
                        "__PAGE__",
                        {},
                        {
                          page: [
                            () => Promise.resolve().then(s.bind(s, 337)),
                            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\register-sacco\\page.tsx",
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
            "C:\\Users\\wesley\\Desktop\\Radaa\\radaa-frontend\\app\\auth\\register-sacco\\page.tsx",
          ],
          u = "/auth/register-sacco/page",
          x = { require: s, loadChunk: () => Promise.resolve() },
          p = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/auth/register-sacco/page",
              pathname: "/auth/register-sacco",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      7122: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 3237));
      },
      3237: (e, t, s) => {
        "use strict";
        (s.r(t), s.d(t, { default: () => d }));
        var r = s(326),
          a = s(7577),
          l = s(434),
          o = s(5047),
          i = s(732),
          n = s(4545);
        function d() {
          let { register: e, loading: t } = (0, i.a)(),
            s = (0, o.useRouter)(),
            [d, c] = (0, a.useState)(""),
            [u, x] = (0, a.useState)(""),
            [p, m] = (0, a.useState)(""),
            [h, g] = (0, a.useState)(""),
            [f, b] = (0, a.useState)(""),
            [y, v] = (0, a.useState)(""),
            [j, N] = (0, a.useState)(null),
            [C, q] = (0, a.useState)(!1),
            w = (0, n.N3)("sacco_onboard_v1", !1),
            k = async (t) => {
              (t.preventDefault(), N(null), q(!0));
              try {
                (await e({
                  username: d,
                  email: u,
                  password: h,
                  phone: p || void 0,
                  role: "admin",
                  saccoName: f,
                  registrationNumber: y || void 0,
                }),
                  s.push("/dashboard/sacco"));
              } catch (e) {
                N(e instanceof Error ? e.message : "SACCO registration failed");
              } finally {
                q(!1);
              }
            },
            S = C || t;
          return (0, r.jsxs)("div", {
            className: "mx-auto max-w-md space-y-6",
            children: [
              (0, r.jsxs)("div", {
                className: "space-y-2",
                children: [
                  r.jsx("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "SACCO sign up",
                  }),
                  r.jsx("p", {
                    className: "text-sm text-slate-300",
                    children:
                      "Create a SACCO admin account to manage your fleet, drivers, and documents in Radaa.",
                  }),
                ],
              }),
              w &&
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
                          children: "SACCO profile",
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
                          children: "Registration details",
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
                          children: "Invite drivers",
                        }),
                      ],
                    }),
                  ],
                }),
              j &&
                r.jsx("div", {
                  className:
                    "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200",
                  children: j,
                }),
              (0, r.jsxs)("form", {
                onSubmit: k,
                className: "space-y-4",
                children: [
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      r.jsx("label", {
                        htmlFor: "username",
                        className: "text-sm font-medium text-slate-100",
                        children: "Admin name",
                      }),
                      r.jsx("input", {
                        id: "username",
                        type: "text",
                        required: !0,
                        value: d,
                        onChange: (e) => c(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "Jane Doe",
                      }),
                    ],
                  }),
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      r.jsx("label", {
                        htmlFor: "saccoName",
                        className: "text-sm font-medium text-slate-100",
                        children: "SACCO name",
                      }),
                      r.jsx("input", {
                        id: "saccoName",
                        type: "text",
                        required: !0,
                        value: f,
                        onChange: (e) => b(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "e.g. Radaa Express SACCO",
                      }),
                    ],
                  }),
                  (0, r.jsxs)("div", {
                    className: "space-y-1",
                    children: [
                      (0, r.jsxs)("label", {
                        htmlFor: "registrationNumber",
                        className: "text-sm font-medium text-slate-100",
                        children: [
                          "Registration number ",
                          r.jsx("span", {
                            className: "text-xs font-normal text-slate-400",
                            children: "(optional)",
                          }),
                        ],
                      }),
                      r.jsx("input", {
                        id: "registrationNumber",
                        type: "text",
                        value: y,
                        onChange: (e) => v(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "Your official SACCO registration ID",
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
                        value: u,
                        onChange: (e) => x(e.target.value),
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
                        value: p,
                        onChange: (e) => m(e.target.value),
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
                        value: h,
                        onChange: (e) => g(e.target.value),
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "At least 6 characters",
                      }),
                    ],
                  }),
                  r.jsx("button", {
                    type: "submit",
                    disabled: S,
                    className:
                      "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                    children: S
                      ? "Creating SACCO account..."
                      : "Create SACCO account",
                  }),
                ],
              }),
              (0, r.jsxs)("p", {
                className: "text-center text-xs text-slate-400",
                children: [
                  "Already have a SACCO account?",
                  " ",
                  r.jsx(l.default, {
                    href: "/auth/login-sacco",
                    className: "font-medium text-sky-400 hover:text-sky-300",
                    children: "Sign in",
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
      337: (e, t, s) => {
        "use strict";
        (s.r(t),
          s.d(t, { $$typeof: () => o, __esModule: () => l, default: () => i }));
        var r = s(8570);
        let a = (0, r.createProxy)(
            String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\register-sacco\page.tsx`,
          ),
          { __esModule: l, $$typeof: o } = a;
        a.default;
        let i = (0, r.createProxy)(
          String.raw`C:\Users\wesley\Desktop\Radaa\radaa-frontend\app\auth\register-sacco\page.tsx#default`,
        );
      },
    }));
  var t = require("../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [489, 496, 462], () => s(5397));
  module.exports = r;
})();
