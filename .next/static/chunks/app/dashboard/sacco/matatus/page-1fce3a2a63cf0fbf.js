(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [916],
  {
    9092: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 5769));
    },
    5769: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return l;
          },
        }));
      var n = a(7437),
        r = a(2265),
        o = a(3429),
        s = a(9284);
      function l() {
        let { user: e, token: t } = (0, o.a)(),
          a = null == e ? void 0 : e._id,
          [l, i] = (0, r.useState)([]),
          [c, d] = (0, r.useState)(!0),
          [u, m] = (0, r.useState)(null),
          h = (null == e ? void 0 : e.role) === "admin";
        (0, r.useEffect)(() => {
          if (!a || !t || !h) {
            d(!1);
            return;
          }
          let e = !1;
          return (
            (async () => {
              (d(!0), m(null));
              try {
                let n = await (0, s.jZ)(a, {}, t);
                if (e) return;
                i(n);
              } catch (t) {
                if (e) return;
                m(t instanceof Error ? t.message : "Failed to load matatus");
              } finally {
                e || d(!1);
              }
            })(),
            () => {
              e = !0;
            }
          );
        }, [a, t, h]);
        let f = async (e, n) => {
          if (a && t)
            try {
              let r = await (0, s.yb)(a, e, n, t);
              i((e) => e.map((e) => (e._id === r._id ? r : e)));
            } catch (e) {
              m(e instanceof Error ? e.message : "Unable to update matatu");
            }
        };
        return h
          ? (0, n.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, n.jsxs)("header", {
                  className: "space-y-1",
                  children: [
                    (0, n.jsx)("h1", {
                      className: "text-2xl font-semibold tracking-tight",
                      children: "SACCO matatus",
                    }),
                    (0, n.jsx)("p", {
                      className: "text-xs text-slate-300",
                      children:
                        "Manage and monitor matatus registered under this SACCO.",
                    }),
                  ],
                }),
                u &&
                  (0, n.jsx)("div", {
                    className:
                      "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200",
                    children: u,
                  }),
                c &&
                  (0, n.jsx)("section", {
                    className:
                      "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                    children: (0, n.jsxs)("div", {
                      className: "space-y-2",
                      children: [
                        (0, n.jsx)("div", {
                          className:
                            "h-4 w-32 animate-pulse rounded bg-slate-800/80",
                        }),
                        (0, n.jsx)("div", {
                          className:
                            "h-24 animate-pulse rounded-lg bg-slate-800/80",
                        }),
                      ],
                    }),
                  }),
                !c &&
                  !u &&
                  0 === l.length &&
                  (0, n.jsx)("section", {
                    className:
                      "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                    children:
                      "No matatus are currently registered for this SACCO.",
                  }),
                !c &&
                  !u &&
                  l.length > 0 &&
                  (0, n.jsxs)("section", {
                    className:
                      "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                    children: [
                      (0, n.jsx)("div", {
                        className: "flex items-center justify-between",
                        children: (0, n.jsxs)("div", {
                          children: [
                            (0, n.jsx)("h2", {
                              className: "text-sm font-semibold text-slate-100",
                              children: "Fleet",
                            }),
                            (0, n.jsx)("p", {
                              className: "text-[11px] text-slate-400",
                              children:
                                "Vehicles under this SACCO and their approval status.",
                            }),
                          ],
                        }),
                      }),
                      (0, n.jsx)("div", {
                        className:
                          "overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70",
                        children: (0, n.jsxs)("table", {
                          className: "min-w-full border-collapse text-[11px]",
                          children: [
                            (0, n.jsx)("thead", {
                              className: "bg-slate-900/80 text-slate-300",
                              children: (0, n.jsxs)("tr", {
                                children: [
                                  (0, n.jsx)("th", {
                                    className:
                                      "px-3 py-2 text-left font-medium",
                                    children: "Matatu",
                                  }),
                                  (0, n.jsx)("th", {
                                    className:
                                      "px-3 py-2 text-left font-medium",
                                    children: "Route",
                                  }),
                                  (0, n.jsx)("th", {
                                    className:
                                      "px-3 py-2 text-left font-medium",
                                    children: "Approval",
                                  }),
                                  (0, n.jsx)("th", {
                                    className:
                                      "px-3 py-2 text-right font-medium",
                                    children: "Actions",
                                  }),
                                ],
                              }),
                            }),
                            (0, n.jsx)("tbody", {
                              children: l.map((e) => {
                                var t, a;
                                return (0, n.jsxs)(
                                  "tr",
                                  {
                                    className: "border-t border-slate-800/80",
                                    children: [
                                      (0, n.jsx)("td", {
                                        className: "px-3 py-2 text-slate-100",
                                        children:
                                          e.plate ||
                                          e.numberPlate ||
                                          e._id.slice(0, 6),
                                      }),
                                      (0, n.jsx)("td", {
                                        className: "px-3 py-2 text-slate-300",
                                        children:
                                          null !== (t = e.route) && void 0 !== t
                                            ? t
                                            : "—",
                                      }),
                                      (0, n.jsx)("td", {
                                        className: "px-3 py-2",
                                        children: (0, n.jsx)("span", {
                                          className:
                                            "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100",
                                          children:
                                            null !== (a = e.approvalStatus) &&
                                            void 0 !== a
                                              ? a
                                              : "pending",
                                        }),
                                      }),
                                      (0, n.jsx)("td", {
                                        className: "px-3 py-2 text-right",
                                        children: (0, n.jsxs)("div", {
                                          className: "inline-flex gap-1",
                                          children: [
                                            (0, n.jsx)("button", {
                                              type: "button",
                                              onClick: () =>
                                                f(e._id, "approved"),
                                              className:
                                                "rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80",
                                              children: "Approve",
                                            }),
                                            (0, n.jsx)("button", {
                                              type: "button",
                                              onClick: () =>
                                                f(e._id, "rejected"),
                                              className:
                                                "rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80",
                                              children: "Reject",
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  },
                                  e._id,
                                );
                              }),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
              ],
            })
          : (0, n.jsx)("div", {
              className: "space-y-4",
              children: (0, n.jsxs)("header", {
                className: "space-y-1",
                children: [
                  (0, n.jsx)("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "SACCO matatus",
                  }),
                  (0, n.jsx)("p", {
                    className: "text-xs text-slate-300",
                    children:
                      "You must be signed in as a SACCO admin to view this page.",
                  }),
                ],
              }),
            });
      }
    },
    3429: function (e, t, a) {
      "use strict";
      a.d(t, {
        AuthProvider: function () {
          return d;
        },
        a: function () {
          return u;
        },
      });
      var n = a(7437),
        r = a(2265),
        o = a(2315);
      let s = "user",
        l = "token",
        i = "radaa_token",
        c = (0, r.createContext)(void 0);
      function d(e) {
        let { children: t } = e,
          [a, d] = (0, r.useState)(null),
          [u, m] = (0, r.useState)(null),
          [h, f] = (0, r.useState)(!0);
        (0, r.useEffect)(() => {
          try {
            let e = window.localStorage.getItem(s),
              t = window.sessionStorage.getItem(s),
              a = null,
              n = null;
            if (e) {
              let t = JSON.parse(e);
              t &&
                "string" == typeof t._id &&
                "string" == typeof t.token &&
                ((a = t), (n = t.token));
            }
            if (!a && t) {
              let e = JSON.parse(t);
              e &&
                "string" == typeof e._id &&
                "string" == typeof e.token &&
                ((a = e), (n = e.token));
            }
            if (!n) {
              let e =
                window.localStorage.getItem(l) ||
                window.sessionStorage.getItem(l);
              e && "string" == typeof e && (n = e);
            }
            (a && d(a), n && m(n));
          } catch (e) {
          } finally {
            f(!1);
          }
        }, []);
        let p = async function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            f(!0);
            try {
              let a = await (0, o.x4)(e),
                n = {
                  _id: a._id,
                  email: a.email,
                  token: a.token,
                  username: a.username,
                  handle: a.handle,
                  phone: a.phone,
                  createdAt: a.createdAt,
                  role: a.role,
                  enabled: a.enabled,
                  driverProfile: a.driverProfile,
                  driverVerificationStatus: a.driverVerificationStatus,
                  saccoProfile: a.saccoProfile,
                };
              (d(n), m(n.token));
              {
                let e = t ? window.localStorage : window.sessionStorage;
                (e.setItem(s, JSON.stringify(n)),
                  e.setItem(l, n.token),
                  window.localStorage.setItem("radaa_user_id", n._id),
                  t
                    ? (window.sessionStorage.removeItem(s),
                      window.sessionStorage.removeItem(l))
                    : (window.localStorage.removeItem(s),
                      window.localStorage.removeItem(l)));
                let a = "https:" === window.location.protocol,
                  r = [
                    "".concat(i, "=").concat(n.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (a && r.push("Secure"), (document.cookie = r.join("; ")));
              }
            } finally {
              f(!1);
            }
          },
          v = async (e) => {
            f(!0);
            try {
              let t = await (0, o.z2)(e),
                a = {
                  _id: t._id,
                  email: t.email,
                  token: t.token,
                  username: t.username,
                  handle: t.handle,
                  phone: t.phone,
                  createdAt: t.createdAt,
                  role: t.role,
                  enabled: t.enabled,
                  driverProfile: t.driverProfile,
                  driverVerificationStatus: t.driverVerificationStatus,
                  saccoProfile: t.saccoProfile,
                };
              (d(a), m(a.token));
              {
                (window.localStorage.setItem(s, JSON.stringify(a)),
                  window.localStorage.setItem(l, a.token),
                  window.localStorage.setItem("radaa_user_id", a._id));
                let e = "https:" === window.location.protocol,
                  t = [
                    "".concat(i, "=").concat(a.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (e && t.push("Secure"), (document.cookie = t.join("; ")));
              }
            } finally {
              f(!1);
            }
          };
        return (0, n.jsx)(c.Provider, {
          value: {
            user: a,
            token: u,
            loading: h,
            login: p,
            register: v,
            logout: () => {
              (d(null),
                m(null),
                window.localStorage.removeItem(s),
                window.localStorage.removeItem(l),
                window.sessionStorage.removeItem(s),
                window.sessionStorage.removeItem(l),
                window.localStorage.removeItem("radaa_user_id"),
                (document.cookie = "".concat(
                  i,
                  "=; Path=/; Max-Age=0; SameSite=Lax",
                )));
            },
          },
          children: t,
        });
      }
      function u() {
        let e = (0, r.useContext)(c);
        if (!e) throw Error("useAuth must be used within an AuthProvider");
        return e;
      }
    },
    542: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return s;
        },
        BZ: function () {
          return c;
        },
        Nj: function () {
          return l;
        },
        GX: function () {
          return d;
        },
        Yf: function () {
          return i;
        },
        eg: function () {
          return u;
        },
        m5: function () {
          return m;
        },
      });
      var n = a(8472);
      let r = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (r && (n.Z.defaults.baseURL = r),
        (n.Z.defaults.withCredentials = !0),
        n.Z.interceptors.request.use((e) => {
          try {
            let t =
              window.localStorage.getItem("token") ||
              window.sessionStorage.getItem("token");
            t &&
              ((e.headers = e.headers || {}),
              e.headers.Authorization ||
                (e.headers.Authorization = "Bearer ".concat(t)));
          } catch (e) {}
          return e;
        }));
      var o = n.Z,
        s = o;
      let l = async () => {
          try {
            return (await o.get("/matatu-system/live")).data;
          } catch (t) {
            var e;
            throw (
              console.error(
                "API ERROR:",
                (null == t
                  ? void 0
                  : null === (e = t.response) || void 0 === e
                    ? void 0
                    : e.data) || t,
              ),
              t
            );
          }
        },
        i = async () => {
          try {
            let e = (await o.get("/map/markers")).data;
            if (e && "object" == typeof e && "data" in e) return e.data;
            return e;
          } catch (t) {
            var e;
            throw (
              console.error(
                "API ERROR:",
                (null == t
                  ? void 0
                  : null === (e = t.response) || void 0 === e
                    ? void 0
                    : e.data) || t,
              ),
              t
            );
          }
        },
        c = async () => {
          try {
            let e = (await o.get("/feature-flags")).data;
            if (e && "object" == typeof e && "data" in e) return e.data;
            return e;
          } catch (t) {
            var e;
            throw (
              console.error(
                "API ERROR:",
                (null == t
                  ? void 0
                  : null === (e = t.response) || void 0 === e
                    ? void 0
                    : e.data) || t,
              ),
              t
            );
          }
        },
        d = async (e) => {
          try {
            return (await o.get("/users/".concat(e, "/loyalty"))).data;
          } catch (e) {
            var t;
            throw (
              console.error(
                "API ERROR:",
                (null == e
                  ? void 0
                  : null === (t = e.response) || void 0 === t
                    ? void 0
                    : t.data) || e,
              ),
              e
            );
          }
        },
        u = async (e) => {
          try {
            return (await o.post("/payments/initiate", e)).data;
          } catch (e) {
            var t;
            throw (
              console.error(
                "API ERROR:",
                (null == e
                  ? void 0
                  : null === (t = e.response) || void 0 === t
                    ? void 0
                    : t.data) || e,
              ),
              e
            );
          }
        },
        m = async (e) => {
          try {
            return (await o.post("/payments/verify", e)).data;
          } catch (e) {
            var t;
            throw (
              console.error(
                "API ERROR:",
                (null == e
                  ? void 0
                  : null === (t = e.response) || void 0 === t
                    ? void 0
                    : t.data) || e,
              ),
              e
            );
          }
        };
    },
    2315: function (e, t, a) {
      "use strict";
      a.d(t, {
        Ai: function () {
          return s;
        },
        x4: function () {
          return r;
        },
        z2: function () {
          return o;
        },
      });
      var n = a(542);
      async function r(e) {
        try {
          return (await n.ZP.post("/auth/login", e)).data;
        } catch (n) {
          var t, a;
          let e =
            null !==
              (a =
                null == n
                  ? void 0
                  : null === (t = n.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == n ? void 0 : n.message) ||
              "Login failed",
          );
        }
      }
      async function o(e) {
        try {
          return (await n.ZP.post("/auth/register", e)).data;
        } catch (n) {
          var t, a;
          let e =
            null !==
              (a =
                null == n
                  ? void 0
                  : null === (t = n.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == n ? void 0 : n.message) ||
              "Registration failed",
          );
        }
      }
      async function s(e) {
        try {
          return (
            await n.ZP.get("/auth/profile", {
              headers: { Authorization: "Bearer ".concat(e) },
            })
          ).data;
        } catch (n) {
          var t, a;
          let e =
            null !==
              (a =
                null == n
                  ? void 0
                  : null === (t = n.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == n ? void 0 : n.message) ||
              "Failed to load profile",
          );
        }
      }
    },
    9284: function (e, t, a) {
      "use strict";
      a.d(t, {
        EK: function () {
          return o;
        },
        IY: function () {
          return s;
        },
        Vh: function () {
          return d;
        },
        jZ: function () {
          return l;
        },
        o: function () {
          return i;
        },
        v7: function () {
          return c;
        },
        yb: function () {
          return u;
        },
      });
      var n = a(542);
      async function r(e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: a = "GET", body: r, token: o } = t,
          s = {};
        o && (s.Authorization = "Bearer ".concat(o));
        try {
          let t = (
            await n.ZP.request({ url: e, method: a, data: r, headers: s })
          ).data;
          if (
            null != t &&
            t &&
            "object" == typeof t &&
            "success" in t &&
            !0 === t.success &&
            "data" in t
          )
            return t.data;
          return t;
        } catch (t) {
          var l;
          let e =
            null == t
              ? void 0
              : null === (l = t.response) || void 0 === l
                ? void 0
                : l.data;
          throw Error(
            (e && "object" == typeof e && (e.message || e.error)) ||
              (null == t ? void 0 : t.message) ||
              "Request failed",
          );
        }
      }
      async function o(e, t) {
        return r("/sacco/".concat(e, "/overview"), {
          method: "GET",
          token: null != t ? t : null,
        });
      }
      async function s(e, t) {
        let a = await r("/sacco/".concat(e, "/drivers"), {
          method: "GET",
          token: null != t ? t : null,
        });
        return Array.isArray(a) ? a : [];
      }
      async function l(e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          a = arguments.length > 2 ? arguments[2] : void 0,
          n = new URLSearchParams();
        t.status && n.set("status", t.status);
        let o = n.toString(),
          s = await r(
            "/sacco/".concat(e, "/matatus").concat(o ? "?".concat(o) : ""),
            { method: "GET", token: null != a ? a : null },
          );
        return Array.isArray(s) ? s : [];
      }
      async function i(e, t, a, n) {
        let o = new FormData();
        return (
          o.append("file", a),
          o.append("type", t),
          r("/sacco/".concat(e, "/docs"), {
            method: "POST",
            body: o,
            token: null != n ? n : null,
          })
        );
      }
      async function c(e, t, a, n) {
        return r("/sacco/".concat(e, "/driver/").concat(t, "/disable"), {
          method: "POST",
          body: { enabled: a },
          token: null != n ? n : null,
        });
      }
      async function d(e, t, a, n) {
        return r("/sacco/".concat(e, "/driver/").concat(t, "/verification"), {
          method: "POST",
          body: { status: a },
          token: null != n ? n : null,
        });
      }
      async function u(e, t, a, n) {
        return r("/sacco/".concat(e, "/matatu/").concat(t, "/approval"), {
          method: "POST",
          body: { status: a },
          token: null != n ? n : null,
        });
      }
    },
  },
  function (e) {
    (e.O(0, [472, 971, 23, 744], function () {
      return e((e.s = 9092));
    }),
      (_N_E = e.O()));
  },
]);
