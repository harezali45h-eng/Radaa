(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [663],
  {
    7745: function (e, s, a) {
      Promise.resolve().then(a.bind(a, 2054));
    },
    2054: function (e, s, a) {
      "use strict";
      (a.r(s),
        a.d(s, {
          default: function () {
            return c;
          },
        }));
      var t = a(7437),
        l = a(7138),
        r = a(4239),
        d = a(3429),
        i = a(728),
        n = a(3551);
      function c(e) {
        let { children: s } = e,
          { user: a } = (0, d.a)(),
          c = null == a ? void 0 : a.role,
          h = "admin" === c,
          x = "driver" === c,
          { activeMode: o } = (0, i.r)(),
          { cardSurfaceClass: m } = (0, n.F)(),
          p = h
            ? "/dashboard/sacco"
            : x && "driver" === o
              ? "/dashboard/driver/live"
              : "/dashboard",
          v =
            x && "driver" === o
              ? "/dashboard/driver/live"
              : "/dashboard/passenger/live";
        return (0, t.jsx)(r.AppShell, {
          children: (0, t.jsxs)("div", {
            className: "grid gap-6 md:grid-cols-[210px,1fr]",
            children: [
              (0, t.jsx)("aside", {
                className: "".concat(m, " p-4 text-xs"),
                children: (0, t.jsx)("nav", {
                  className: "space-y-4",
                  children: (0, t.jsxs)("div", {
                    children: [
                      (0, t.jsx)("div", {
                        className:
                          "text-[10px] font-semibold uppercase tracking-wide text-slate-400",
                        children: "Menu",
                      }),
                      (0, t.jsxs)("div", {
                        className: "mt-1 space-y-1",
                        children: [
                          (0, t.jsx)(l.default, {
                            href: p,
                            className:
                              "block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white",
                            children: "Home",
                          }),
                          (0, t.jsx)(l.default, {
                            href: v,
                            className:
                              "block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white",
                            children: "Live",
                          }),
                          x &&
                            (0, t.jsx)(l.default, {
                              href: "/dashboard/driver/live",
                              className:
                                "block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white",
                              children: "Driver live",
                            }),
                          (0, t.jsx)(l.default, {
                            href: "/dashboard/trips/list",
                            className:
                              "block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white",
                            children: "Trips",
                          }),
                          (0, t.jsx)(l.default, {
                            href: "/profile",
                            className:
                              "block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white",
                            children: "Profile",
                          }),
                          h &&
                            (0, t.jsx)(l.default, {
                              href: "/dashboard/sacco",
                              className:
                                "block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white",
                              children: "SACCO",
                            }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
              (0, t.jsxs)("section", {
                className: "space-y-4",
                children: [
                  (0, t.jsxs)("div", {
                    className: "flex items-center justify-between",
                    children: [
                      (0, t.jsx)("div", {
                        className: "text-sm font-semibold md:hidden",
                        children: "Dashboard",
                      }),
                      (0, t.jsxs)("div", {
                        className:
                          "hidden gap-2 text-[11px] text-slate-300 md:flex",
                        children: [
                          (0, t.jsx)("span", {
                            className: "font-medium text-slate-100",
                            children: "Home",
                          }),
                          (0, t.jsx)("span", {
                            className: "text-slate-600",
                            children: "/",
                          }),
                          (0, t.jsx)("span", {
                            className: "text-slate-400",
                            children: "Live",
                          }),
                          (0, t.jsx)("span", {
                            className: "text-slate-600",
                            children: "/",
                          }),
                          (0, t.jsx)("span", {
                            className: "text-slate-400",
                            children: "Trips",
                          }),
                          (0, t.jsx)("span", {
                            className: "text-slate-600",
                            children: "/",
                          }),
                          (0, t.jsx)("span", {
                            className: "text-slate-400",
                            children: "Profile",
                          }),
                          h &&
                            (0, t.jsxs)(t.Fragment, {
                              children: [
                                (0, t.jsx)("span", {
                                  className: "text-slate-600",
                                  children: "/",
                                }),
                                (0, t.jsx)("span", {
                                  className: "text-slate-400",
                                  children: "SACCO",
                                }),
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                  s,
                ],
              }),
            ],
          }),
        });
      }
    },
  },
  function (e) {
    (e.O(0, [472, 138, 40, 401, 239, 971, 23, 744], function () {
      return e((e.s = 7745));
    }),
      (_N_E = e.O()));
  },
]);
