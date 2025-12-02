(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [424],
  {
    3064: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 2446));
    },
    2446: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return a;
          },
        }));
      var n = r(7437),
        s = r(2265);
      function a(e) {
        let { error: t, reset: r } = e;
        return (
          (0, s.useEffect)(() => {
            console.error("Global app error:", t);
          }, [t]),
          (0, n.jsx)("html", {
            lang: "en",
            children: (0, n.jsx)("body", {
              className: "min-h-screen bg-slate-950 text-slate-50",
              children: (0, n.jsx)("div", {
                className: "flex min-h-screen items-center justify-center px-4",
                children: (0, n.jsxs)("div", {
                  className:
                    "max-w-md space-y-4 rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-xs",
                  children: [
                    (0, n.jsx)("h1", {
                      className: "text-lg font-semibold text-red-100",
                      children: "Something went wrong",
                    }),
                    (0, n.jsx)("p", {
                      className: "text-slate-200",
                      children:
                        "An unexpected error occurred while rendering this page. You can try again, or go back to the dashboard.",
                    }),
                    (0, n.jsxs)("div", {
                      className: "flex gap-3 text-[11px]",
                      children: [
                        (0, n.jsx)("button", {
                          type: "button",
                          onClick: r,
                          className:
                            "inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-500",
                          children: "Try again",
                        }),
                        (0, n.jsx)("a", {
                          href: "/dashboard",
                          className:
                            "inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-100 hover:border-slate-500",
                          children: "Go to dashboard",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            }),
          })
        );
      }
    },
  },
  function (e) {
    (e.O(0, [971, 23, 744], function () {
      return e((e.s = 3064));
    }),
      (_N_E = e.O()));
  },
]);
