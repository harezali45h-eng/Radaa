(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [611],
  {
    2283: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 9322));
    },
    9322: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return l;
          },
        }));
      var s = r(7437),
        a = r(2265),
        n = r(6463);
      let o =
        r(357).env.NEXT_PUBLIC_API_BASE_URL ||
        "https://radaa-1.onrender.com/api";
      function l() {
        let e = (0, n.useRouter)(),
          [t, r] = (0, a.useState)(""),
          [l, i] = (0, a.useState)(""),
          [u, c] = (0, a.useState)(""),
          [d, x] = (0, a.useState)(""),
          [m, p] = (0, a.useState)(""),
          [h, f] = (0, a.useState)(!1),
          [g, y] = (0, a.useState)(null),
          [b, v] = (0, a.useState)(null),
          N = async (r) => {
            (r.preventDefault(), y(null), v(null), f(!0));
            try {
              let r = await fetch("".concat(o, "/matatus"), {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    plate: t,
                    route: l,
                    sacco: u || void 0,
                    driverName: d || void 0,
                    driverPhone: m || void 0,
                  }),
                }),
                s = await r.json().catch(() => null);
              if (!r.ok) {
                let e =
                  (s && "object" == typeof s && (s.message || s.error)) ||
                  "Failed to register matatu";
                throw Error(e);
              }
              (v("Matatu registered successfully"),
                s && s._id && e.push("/dashboard/matatus/".concat(s._id)));
            } catch (e) {
              y(e instanceof Error ? e.message : "Failed to register matatu");
            } finally {
              f(!1);
            }
          };
        return (0, s.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, s.jsxs)("header", {
              className: "space-y-2",
              children: [
                (0, s.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Register matatu",
                }),
                (0, s.jsx)("p", {
                  className: "text-xs text-slate-300",
                  children:
                    "Create a new matatu record that can later be tracked live on the map and in trip logs.",
                }),
              ],
            }),
            g &&
              (0, s.jsx)("div", {
                className:
                  "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200",
                children: g,
              }),
            b &&
              (0, s.jsx)("div", {
                className:
                  "rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200",
                children: b,
              }),
            (0, s.jsxs)("form", {
              onSubmit: N,
              className:
                "space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
              children: [
                (0, s.jsxs)("div", {
                  className: "grid gap-4 md:grid-cols-2",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "space-y-1",
                      children: [
                        (0, s.jsx)("label", {
                          htmlFor: "plate",
                          className: "text-xs font-medium text-slate-100",
                          children: "Number plate",
                        }),
                        (0, s.jsx)("input", {
                          id: "plate",
                          type: "text",
                          required: !0,
                          value: t,
                          onChange: (e) => r(e.target.value),
                          className:
                            "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "KAA 123A",
                        }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "space-y-1",
                      children: [
                        (0, s.jsx)("label", {
                          htmlFor: "route",
                          className: "text-xs font-medium text-slate-100",
                          children: "Route",
                        }),
                        (0, s.jsx)("input", {
                          id: "route",
                          type: "text",
                          required: !0,
                          value: l,
                          onChange: (e) => i(e.target.value),
                          className:
                            "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "CBD - Rongai",
                        }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "space-y-1",
                      children: [
                        (0, s.jsxs)("label", {
                          htmlFor: "sacco",
                          className: "text-xs font-medium text-slate-100",
                          children: [
                            "Sacco ",
                            (0, s.jsx)("span", {
                              className:
                                "text-[10px] font-normal text-slate-400",
                              children: "(optional)",
                            }),
                          ],
                        }),
                        (0, s.jsx)("input", {
                          id: "sacco",
                          type: "text",
                          value: u,
                          onChange: (e) => c(e.target.value),
                          className:
                            "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "Super Metro",
                        }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "space-y-1",
                      children: [
                        (0, s.jsxs)("label", {
                          htmlFor: "driverName",
                          className: "text-xs font-medium text-slate-100",
                          children: [
                            "Driver name ",
                            (0, s.jsx)("span", {
                              className:
                                "text-[10px] font-normal text-slate-400",
                              children: "(optional)",
                            }),
                          ],
                        }),
                        (0, s.jsx)("input", {
                          id: "driverName",
                          type: "text",
                          value: d,
                          onChange: (e) => x(e.target.value),
                          className:
                            "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "John Doe",
                        }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "space-y-1 md:col-span-2",
                      children: [
                        (0, s.jsxs)("label", {
                          htmlFor: "driverPhone",
                          className: "text-xs font-medium text-slate-100",
                          children: [
                            "Driver phone ",
                            (0, s.jsx)("span", {
                              className:
                                "text-[10px] font-normal text-slate-400",
                              children: "(optional)",
                            }),
                          ],
                        }),
                        (0, s.jsx)("input", {
                          id: "driverPhone",
                          type: "tel",
                          value: m,
                          onChange: (e) => p(e.target.value),
                          className:
                            "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "07xx xxx xxx",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, s.jsx)("button", {
                  type: "submit",
                  disabled: h,
                  className:
                    "inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                  children: h ? "Registering..." : "Register matatu",
                }),
              ],
            }),
          ],
        });
      }
    },
    6463: function (e, t, r) {
      "use strict";
      var s = r(1169);
      (r.o(s, "useParams") &&
        r.d(t, {
          useParams: function () {
            return s.useParams;
          },
        }),
        r.o(s, "usePathname") &&
          r.d(t, {
            usePathname: function () {
              return s.usePathname;
            },
          }),
        r.o(s, "useRouter") &&
          r.d(t, {
            useRouter: function () {
              return s.useRouter;
            },
          }));
    },
    357: function (e, t, r) {
      "use strict";
      var s, a;
      e.exports =
        (null == (s = r.g.process) ? void 0 : s.env) &&
        "object" == typeof (null == (a = r.g.process) ? void 0 : a.env)
          ? r.g.process
          : r(8081);
    },
    8081: function (e) {
      !(function () {
        var t = {
            229: function (e) {
              var t,
                r,
                s,
                a = (e.exports = {});
              function n() {
                throw Error("setTimeout has not been defined");
              }
              function o() {
                throw Error("clearTimeout has not been defined");
              }
              function l(e) {
                if (t === setTimeout) return setTimeout(e, 0);
                if ((t === n || !t) && setTimeout)
                  return ((t = setTimeout), setTimeout(e, 0));
                try {
                  return t(e, 0);
                } catch (r) {
                  try {
                    return t.call(null, e, 0);
                  } catch (r) {
                    return t.call(this, e, 0);
                  }
                }
              }
              !(function () {
                try {
                  t = "function" == typeof setTimeout ? setTimeout : n;
                } catch (e) {
                  t = n;
                }
                try {
                  r = "function" == typeof clearTimeout ? clearTimeout : o;
                } catch (e) {
                  r = o;
                }
              })();
              var i = [],
                u = !1,
                c = -1;
              function d() {
                u &&
                  s &&
                  ((u = !1),
                  s.length ? (i = s.concat(i)) : (c = -1),
                  i.length && x());
              }
              function x() {
                if (!u) {
                  var e = l(d);
                  u = !0;
                  for (var t = i.length; t; ) {
                    for (s = i, i = []; ++c < t; ) s && s[c].run();
                    ((c = -1), (t = i.length));
                  }
                  ((s = null),
                    (u = !1),
                    (function (e) {
                      if (r === clearTimeout) return clearTimeout(e);
                      if ((r === o || !r) && clearTimeout)
                        return ((r = clearTimeout), clearTimeout(e));
                      try {
                        r(e);
                      } catch (t) {
                        try {
                          return r.call(null, e);
                        } catch (t) {
                          return r.call(this, e);
                        }
                      }
                    })(e));
                }
              }
              function m(e, t) {
                ((this.fun = e), (this.array = t));
              }
              function p() {}
              ((a.nextTick = function (e) {
                var t = Array(arguments.length - 1);
                if (arguments.length > 1)
                  for (var r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
                (i.push(new m(e, t)), 1 !== i.length || u || l(x));
              }),
                (m.prototype.run = function () {
                  this.fun.apply(null, this.array);
                }),
                (a.title = "browser"),
                (a.browser = !0),
                (a.env = {}),
                (a.argv = []),
                (a.version = ""),
                (a.versions = {}),
                (a.on = p),
                (a.addListener = p),
                (a.once = p),
                (a.off = p),
                (a.removeListener = p),
                (a.removeAllListeners = p),
                (a.emit = p),
                (a.prependListener = p),
                (a.prependOnceListener = p),
                (a.listeners = function (e) {
                  return [];
                }),
                (a.binding = function (e) {
                  throw Error("process.binding is not supported");
                }),
                (a.cwd = function () {
                  return "/";
                }),
                (a.chdir = function (e) {
                  throw Error("process.chdir is not supported");
                }),
                (a.umask = function () {
                  return 0;
                }));
            },
          },
          r = {};
        function s(e) {
          var a = r[e];
          if (void 0 !== a) return a.exports;
          var n = (r[e] = { exports: {} }),
            o = !0;
          try {
            (t[e](n, n.exports, s), (o = !1));
          } finally {
            o && delete r[e];
          }
          return n.exports;
        }
        s.ab = "//";
        var a = s(229);
        e.exports = a;
      })();
    },
  },
  function (e) {
    (e.O(0, [971, 23, 744], function () {
      return e((e.s = 2283));
    }),
      (_N_E = e.O()));
  },
]);
