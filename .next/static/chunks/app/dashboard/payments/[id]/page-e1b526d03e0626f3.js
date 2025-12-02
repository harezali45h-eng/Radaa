(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [322],
  {
    6838: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 2998));
    },
    2998: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return l;
          },
        }));
      var n = r(7437),
        s = r(2265),
        a = r(6463);
      let i = r(357).env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      function l() {
        var e, t, r, l;
        let o = (0, a.useParams)(),
          c = null == o ? void 0 : o.id,
          [d, u] = (0, s.useState)(null),
          [m, f] = (0, s.useState)(null),
          [x, h] = (0, s.useState)(!0),
          [p, v] = (0, s.useState)(null);
        ((0, s.useEffect)(() => {
          u(window.localStorage.getItem("radaa_user_id"));
        }, []),
          (0, s.useEffect)(() => {
            if (!d || !c) {
              h(!1);
              return;
            }
            (async () => {
              (h(!0), v(null));
              try {
                let e = await fetch("".concat(i, "/trips/user/").concat(d));
                if (!e.ok) {
                  let t = await e.text();
                  throw Error(t || "Failed to load payments");
                }
                let t = (await e.json()).find((e) => e._id === c) || null;
                if (!t) throw Error("Payment (trip) not found for this user");
                f(t);
              } catch (e) {
                v(
                  e instanceof Error
                    ? e.message
                    : "Failed to load payment detail",
                );
              } finally {
                h(!1);
              }
            })();
          }, [d, c]));
        let g = (null == m ? void 0 : m.startTime)
            ? new Date(m.startTime)
            : null,
          b = (null == m ? void 0 : m.endTime) ? new Date(m.endTime) : null;
        return (0, n.jsxs)("div", {
          className: "space-y-6",
          children: [
            x &&
              (0, n.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children: "Loading payment detail...",
              }),
            p &&
              !x &&
              (0, n.jsx)("div", {
                className:
                  "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                children: p,
              }),
            !x &&
              !p &&
              m &&
              (0, n.jsxs)(n.Fragment, {
                children: [
                  (0, n.jsxs)("header", {
                    className: "space-y-1",
                    children: [
                      (0, n.jsx)("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: "Payment detail",
                      }),
                      (0, n.jsxs)("p", {
                        className: "text-xs text-slate-300",
                        children: [
                          "Trip payment for matatu ",
                          (null === (e = m.matatu) || void 0 === e
                            ? void 0
                            : e.plate) || "Unknown",
                          " on route",
                          " ",
                          (null === (t = m.matatu) || void 0 === t
                            ? void 0
                            : t.route) || "Route not set",
                          ".",
                        ],
                      }),
                    ],
                  }),
                  (0, n.jsxs)("section", {
                    className: "grid gap-4 md:grid-cols-3 text-xs",
                    children: [
                      (0, n.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, n.jsx)("div", {
                            className: "text-slate-400",
                            children: "Fare",
                          }),
                          (0, n.jsx)("div", {
                            className:
                              "mt-1 text-lg font-semibold text-slate-100",
                            children:
                              null != m.fare
                                ? ""
                                    .concat(m.fare, " ")
                                    .concat(m.currency || "KES")
                                : "—",
                          }),
                        ],
                      }),
                      (0, n.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, n.jsx)("div", {
                            className: "text-slate-400",
                            children: "Status",
                          }),
                          (0, n.jsx)("div", {
                            className:
                              "mt-1 text-sm font-semibold text-slate-100 capitalize",
                            children: m.status,
                          }),
                        ],
                      }),
                      (0, n.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, n.jsx)("div", {
                            className: "text-slate-400",
                            children: "Matatu",
                          }),
                          (0, n.jsx)("div", {
                            className:
                              "mt-1 text-sm font-semibold text-slate-100",
                            children:
                              (null === (r = m.matatu) || void 0 === r
                                ? void 0
                                : r.plate) || "Unknown",
                          }),
                          (0, n.jsx)("div", {
                            className: "text-[11px] text-slate-400",
                            children:
                              (null === (l = m.matatu) || void 0 === l
                                ? void 0
                                : l.route) || "Route not set",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, n.jsxs)("section", {
                    className: "grid gap-4 md:grid-cols-2 text-xs",
                    children: [
                      (0, n.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, n.jsx)("div", {
                            className: "text-slate-400",
                            children: "Start time",
                          }),
                          (0, n.jsx)("div", {
                            className: "mt-1 text-slate-100",
                            children: g ? g.toLocaleString() : "—",
                          }),
                        ],
                      }),
                      (0, n.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, n.jsx)("div", {
                            className: "text-slate-400",
                            children: "End time",
                          }),
                          (0, n.jsx)("div", {
                            className: "mt-1 text-slate-100",
                            children: b ? b.toLocaleString() : "—",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, n.jsx)("section", {
                    className:
                      "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                    children: (0, n.jsx)("p", {
                      children:
                        "Detailed payment records (e.g. gateway reference IDs) are handled server-side via the RidePayment model and payment gateway integrations. This screen focuses on the user-facing payment outcome based on trip data.",
                    }),
                  }),
                ],
              }),
          ],
        });
      }
    },
    6463: function (e, t, r) {
      "use strict";
      var n = r(1169);
      (r.o(n, "useParams") &&
        r.d(t, {
          useParams: function () {
            return n.useParams;
          },
        }),
        r.o(n, "usePathname") &&
          r.d(t, {
            usePathname: function () {
              return n.usePathname;
            },
          }),
        r.o(n, "useRouter") &&
          r.d(t, {
            useRouter: function () {
              return n.useRouter;
            },
          }));
    },
    357: function (e, t, r) {
      "use strict";
      var n, s;
      e.exports =
        (null == (n = r.g.process) ? void 0 : n.env) &&
        "object" == typeof (null == (s = r.g.process) ? void 0 : s.env)
          ? r.g.process
          : r(8081);
    },
    8081: function (e) {
      !(function () {
        var t = {
            229: function (e) {
              var t,
                r,
                n,
                s = (e.exports = {});
              function a() {
                throw Error("setTimeout has not been defined");
              }
              function i() {
                throw Error("clearTimeout has not been defined");
              }
              function l(e) {
                if (t === setTimeout) return setTimeout(e, 0);
                if ((t === a || !t) && setTimeout)
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
                  t = "function" == typeof setTimeout ? setTimeout : a;
                } catch (e) {
                  t = a;
                }
                try {
                  r = "function" == typeof clearTimeout ? clearTimeout : i;
                } catch (e) {
                  r = i;
                }
              })();
              var o = [],
                c = !1,
                d = -1;
              function u() {
                c &&
                  n &&
                  ((c = !1),
                  n.length ? (o = n.concat(o)) : (d = -1),
                  o.length && m());
              }
              function m() {
                if (!c) {
                  var e = l(u);
                  c = !0;
                  for (var t = o.length; t; ) {
                    for (n = o, o = []; ++d < t; ) n && n[d].run();
                    ((d = -1), (t = o.length));
                  }
                  ((n = null),
                    (c = !1),
                    (function (e) {
                      if (r === clearTimeout) return clearTimeout(e);
                      if ((r === i || !r) && clearTimeout)
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
              function f(e, t) {
                ((this.fun = e), (this.array = t));
              }
              function x() {}
              ((s.nextTick = function (e) {
                var t = Array(arguments.length - 1);
                if (arguments.length > 1)
                  for (var r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
                (o.push(new f(e, t)), 1 !== o.length || c || l(m));
              }),
                (f.prototype.run = function () {
                  this.fun.apply(null, this.array);
                }),
                (s.title = "browser"),
                (s.browser = !0),
                (s.env = {}),
                (s.argv = []),
                (s.version = ""),
                (s.versions = {}),
                (s.on = x),
                (s.addListener = x),
                (s.once = x),
                (s.off = x),
                (s.removeListener = x),
                (s.removeAllListeners = x),
                (s.emit = x),
                (s.prependListener = x),
                (s.prependOnceListener = x),
                (s.listeners = function (e) {
                  return [];
                }),
                (s.binding = function (e) {
                  throw Error("process.binding is not supported");
                }),
                (s.cwd = function () {
                  return "/";
                }),
                (s.chdir = function (e) {
                  throw Error("process.chdir is not supported");
                }),
                (s.umask = function () {
                  return 0;
                }));
            },
          },
          r = {};
        function n(e) {
          var s = r[e];
          if (void 0 !== s) return s.exports;
          var a = (r[e] = { exports: {} }),
            i = !0;
          try {
            (t[e](a, a.exports, n), (i = !1));
          } finally {
            i && delete r[e];
          }
          return a.exports;
        }
        n.ab = "//";
        var s = n(229);
        e.exports = s;
      })();
    },
  },
  function (e) {
    (e.O(0, [971, 23, 744], function () {
      return e((e.s = 6838));
    }),
      (_N_E = e.O()));
  },
]);
