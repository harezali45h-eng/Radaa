(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [812],
  {
    8368: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 1779));
    },
    1779: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return m;
          },
        }));
      var o = a(7437),
        r = a(2265),
        s = a(6463),
        l = a(3429),
        n = a(542);
      async function i(e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: a = "GET", body: o, token: r } = t,
          s = {};
        r && (s.Authorization = "Bearer ".concat(r));
        try {
          let t = (
            await n.ZP.request({ url: e, method: a, data: o, headers: s })
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
      async function d(e, t) {
        let a = await i("/matatus/".concat(e, "/photos"), {
          method: "GET",
          token: null != t ? t : null,
        });
        return Array.isArray(a) ? a : [];
      }
      async function c(e, t) {
        let a =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          o = arguments.length > 3 ? arguments[3] : void 0,
          r = new FormData();
        (r.append("photo", t), a.caption && r.append("caption", a.caption));
        let s = await i("/matatus/".concat(e, "/photos"), {
          method: "POST",
          body: r,
          token: null != o ? o : null,
        });
        return Array.isArray(s) ? s : [];
      }
      let u = "https://radaa-1.onrender.com/api";
      function m() {
        var e, t;
        let a = (0, s.useParams)(),
          n = null == a ? void 0 : a.id,
          { token: i } = (0, l.a)(),
          [m, p] = (0, r.useState)(null),
          [h, f] = (0, r.useState)(!0),
          [x, g] = (0, r.useState)(null),
          [v, y] = (0, r.useState)(""),
          [w, b] = (0, r.useState)(""),
          [j, S] = (0, r.useState)(!1),
          [N, k] = (0, r.useState)(null),
          [P, I] = (0, r.useState)([]),
          [A, E] = (0, r.useState)(!1),
          [R, _] = (0, r.useState)(null),
          [O, C] = (0, r.useState)(null),
          [F, L] = (0, r.useState)(""),
          [Z, U] = (0, r.useState)(!1);
        ((0, r.useEffect)(() => {
          n &&
            (async () => {
              (f(!0), g(null));
              try {
                var e, t;
                let a = await fetch("".concat(u, "/matatus/").concat(n));
                if (!a.ok) {
                  let e = await a.text();
                  throw Error(e || "Failed to load matatu");
                }
                let o = await a.json();
                (p(o),
                  (null === (e = o.location) || void 0 === e
                    ? void 0
                    : e.lat) != null && y(String(o.location.lat)),
                  (null === (t = o.location) || void 0 === t
                    ? void 0
                    : t.lng) != null && b(String(o.location.lng)));
              } catch (e) {
                g(e instanceof Error ? e.message : "Failed to load matatu");
              } finally {
                f(!1);
              }
            })();
        }, [n]),
          (0, r.useEffect)(() => {
            if (!n) return;
            let e = !1;
            return (
              (async () => {
                (E(!0), _(null));
                try {
                  let t = await d(n, i);
                  if (e) return;
                  I(t);
                } catch (t) {
                  if (e) return;
                  _(t instanceof Error ? t.message : "Failed to load photos");
                } finally {
                  e || E(!1);
                }
              })(),
              () => {
                e = !0;
              }
            );
          }, [n, i]));
        let z = async (e) => {
            if ((e.preventDefault(), n)) {
              (S(!0), k(null));
              try {
                let e = await fetch(
                    "".concat(u, "/matatus/").concat(n, "/location"),
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ lat: v, lng: w }),
                    },
                  ),
                  t = await e.json().catch(() => null);
                if (!e.ok) {
                  let e =
                    (t && "object" == typeof t && (t.message || t.error)) ||
                    "Failed to update location";
                  throw Error(e);
                }
                k("Location updated successfully");
              } catch (e) {
                k(e instanceof Error ? e.message : "Failed to update location");
              } finally {
                S(!1);
              }
            }
          },
          T = async (e) => {
            if ((e.preventDefault(), n && O)) {
              (U(!0), _(null));
              try {
                let e = await c(n, O, { caption: F || void 0 }, i);
                (I(e), C(null), L(""));
              } catch (e) {
                _(e instanceof Error ? e.message : "Failed to upload photo");
              } finally {
                U(!1);
              }
            }
          };
        return (0, o.jsxs)("div", {
          className: "space-y-6",
          children: [
            h &&
              (0, o.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children: "Loading matatu details...",
              }),
            x &&
              !h &&
              (0, o.jsx)("div", {
                className:
                  "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                children: x,
              }),
            !h &&
              !x &&
              m &&
              (0, o.jsxs)(o.Fragment, {
                children: [
                  (0, o.jsxs)("header", {
                    className: "space-y-1",
                    children: [
                      (0, o.jsx)("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: m.plate,
                      }),
                      (0, o.jsxs)("p", {
                        className: "text-xs text-slate-300",
                        children: ["Route: ", m.route],
                      }),
                      m.sacco &&
                        (0, o.jsxs)("p", {
                          className: "text-xs text-slate-400",
                          children: ["Sacco: ", m.sacco],
                        }),
                    ],
                  }),
                  (0, o.jsxs)("section", {
                    className: "grid gap-4 md:grid-cols-3 text-xs",
                    children: [
                      (0, o.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, o.jsx)("div", {
                            className: "text-slate-400",
                            children: "Driver",
                          }),
                          (0, o.jsxs)("div", {
                            className: "mt-1 text-slate-100",
                            children: [
                              m.driverName || "Not set",
                              m.driverPhone &&
                                (0, o.jsxs)("span", {
                                  className: "text-slate-500",
                                  children: [" \xb7 ", m.driverPhone],
                                }),
                            ],
                          }),
                        ],
                      }),
                      (0, o.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, o.jsx)("div", {
                            className: "text-slate-400",
                            children: "Status",
                          }),
                          (0, o.jsx)("div", {
                            className: "mt-1 text-slate-100",
                            children: m.isOnline ? "Online" : "Offline",
                          }),
                        ],
                      }),
                      (0, o.jsxs)("div", {
                        className:
                          "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                        children: [
                          (0, o.jsx)("div", {
                            className: "text-slate-400",
                            children: "Last location",
                          }),
                          (0, o.jsx)("div", {
                            className: "mt-1 text-slate-100",
                            children:
                              (null === (e = m.location) || void 0 === e
                                ? void 0
                                : e.lat) != null &&
                              (null === (t = m.location) || void 0 === t
                                ? void 0
                                : t.lng) != null
                                ? ""
                                    .concat(m.location.lat.toFixed(4), ", ")
                                    .concat(m.location.lng.toFixed(4))
                                : "Not set",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, o.jsxs)("section", {
                    className:
                      "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                    children: [
                      (0, o.jsx)("div", {
                        className: "flex items-center justify-between",
                        children: (0, o.jsxs)("div", {
                          children: [
                            (0, o.jsx)("h2", {
                              className: "text-sm font-semibold text-slate-100",
                              children: "Update live location",
                            }),
                            (0, o.jsx)("p", {
                              className: "text-[11px] text-slate-400",
                              children:
                                "Send a one-off location update for this matatu. This will also broadcast over Socket.IO to any live map subscribers.",
                            }),
                          ],
                        }),
                      }),
                      N &&
                        (0, o.jsx)("div", {
                          className:
                            "rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-200",
                          children: N,
                        }),
                      (0, o.jsxs)("form", {
                        onSubmit: z,
                        className: "grid gap-3 md:grid-cols-[1fr,1fr,auto]",
                        children: [
                          (0, o.jsxs)("div", {
                            className: "space-y-1",
                            children: [
                              (0, o.jsx)("label", {
                                htmlFor: "lat",
                                className:
                                  "text-[11px] font-medium text-slate-100",
                                children: "Latitude",
                              }),
                              (0, o.jsx)("input", {
                                id: "lat",
                                type: "number",
                                step: "0.0001",
                                required: !0,
                                value: v,
                                onChange: (e) => y(e.target.value),
                                className:
                                  "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                placeholder: "-1.2864",
                              }),
                            ],
                          }),
                          (0, o.jsxs)("div", {
                            className: "space-y-1",
                            children: [
                              (0, o.jsx)("label", {
                                htmlFor: "lng",
                                className:
                                  "text-[11px] font-medium text-slate-100",
                                children: "Longitude",
                              }),
                              (0, o.jsx)("input", {
                                id: "lng",
                                type: "number",
                                step: "0.0001",
                                required: !0,
                                value: w,
                                onChange: (e) => b(e.target.value),
                                className:
                                  "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                placeholder: "36.8219",
                              }),
                            ],
                          }),
                          (0, o.jsx)("div", {
                            className: "flex items-end",
                            children: (0, o.jsx)("button", {
                              type: "submit",
                              disabled: j,
                              className:
                                "inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                              children: j ? "Updating..." : "Update location",
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, o.jsxs)("section", {
                    className:
                      "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                    children: [
                      (0, o.jsx)("div", {
                        className: "flex items-center justify-between",
                        children: (0, o.jsxs)("div", {
                          children: [
                            (0, o.jsx)("h2", {
                              className: "text-sm font-semibold text-slate-100",
                              children: "Photos",
                            }),
                            (0, o.jsx)("p", {
                              className: "text-[11px] text-slate-400",
                              children:
                                "Upload photos of this matatu. Approved photos will be used on the global map and in SACCO dashboards.",
                            }),
                          ],
                        }),
                      }),
                      R &&
                        (0, o.jsx)("div", {
                          className:
                            "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200",
                          children: R,
                        }),
                      A &&
                        (0, o.jsx)("div", {
                          className: "text-[11px] text-slate-300",
                          children: "Loading photos…",
                        }),
                      !A &&
                        P.length > 0 &&
                        (0, o.jsx)("div", {
                          className: "grid grid-cols-2 gap-3 md:grid-cols-4",
                          children: P.map((e) => {
                            let t = e.url.startsWith("http")
                              ? e.url
                              : "".concat(u).concat(e.url);
                            return (0, o.jsxs)(
                              "figure",
                              {
                                className: "space-y-1",
                                children: [
                                  (0, o.jsx)("img", {
                                    src: t,
                                    alt: e.caption || "Matatu photo",
                                    className:
                                      "h-24 w-full rounded-md object-cover",
                                  }),
                                  (0, o.jsxs)("figcaption", {
                                    className: "text-[10px] text-slate-400",
                                    children: [
                                      e.caption || "Matatu",
                                      " \xb7 ",
                                      e.status || "pending",
                                    ],
                                  }),
                                ],
                              },
                              e._id,
                            );
                          }),
                        }),
                      (0, o.jsxs)("form", {
                        onSubmit: T,
                        className:
                          "mt-2 grid gap-2 md:grid-cols-[1.4fr,1.6fr,auto]",
                        children: [
                          (0, o.jsx)("input", {
                            type: "file",
                            accept: "image/*",
                            onChange: (e) => {
                              var t, a;
                              C(
                                null !==
                                  (a =
                                    null === (t = e.target.files) ||
                                    void 0 === t
                                      ? void 0
                                      : t[0]) && void 0 !== a
                                  ? a
                                  : null,
                              );
                            },
                            className:
                              "block w-full cursor-pointer text-[11px] text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-slate-100 hover:file:bg-slate-700",
                          }),
                          (0, o.jsx)("input", {
                            type: "text",
                            value: F,
                            onChange: (e) => L(e.target.value),
                            className:
                              "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                            placeholder: "Caption (optional)",
                          }),
                          (0, o.jsx)("button", {
                            type: "submit",
                            disabled: Z || !O,
                            className:
                              "inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
                            children: Z ? "Uploading..." : "Upload photo",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
          ],
        });
      }
    },
    3429: function (e, t, a) {
      "use strict";
      a.d(t, {
        AuthProvider: function () {
          return c;
        },
        a: function () {
          return u;
        },
      });
      var o = a(7437),
        r = a(2265),
        s = a(2315);
      let l = "user",
        n = "token",
        i = "radaa_token",
        d = (0, r.createContext)(void 0);
      function c(e) {
        let { children: t } = e,
          [a, c] = (0, r.useState)(null),
          [u, m] = (0, r.useState)(null),
          [p, h] = (0, r.useState)(!0);
        (0, r.useEffect)(() => {
          try {
            let e = window.localStorage.getItem(l),
              t = window.sessionStorage.getItem(l),
              a = null,
              o = null;
            if (e) {
              let t = JSON.parse(e);
              t &&
                "string" == typeof t._id &&
                "string" == typeof t.token &&
                ((a = t), (o = t.token));
            }
            if (!a && t) {
              let e = JSON.parse(t);
              e &&
                "string" == typeof e._id &&
                "string" == typeof e.token &&
                ((a = e), (o = e.token));
            }
            if (!o) {
              let e =
                window.localStorage.getItem(n) ||
                window.sessionStorage.getItem(n);
              e && "string" == typeof e && (o = e);
            }
            (a && c(a), o && m(o));
          } catch (e) {
          } finally {
            h(!1);
          }
        }, []);
        let f = async function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            h(!0);
            try {
              let a = await (0, s.x4)(e),
                o = {
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
              (c(o), m(o.token));
              {
                let e = t ? window.localStorage : window.sessionStorage;
                (e.setItem(l, JSON.stringify(o)),
                  e.setItem(n, o.token),
                  window.localStorage.setItem("radaa_user_id", o._id),
                  t
                    ? (window.sessionStorage.removeItem(l),
                      window.sessionStorage.removeItem(n))
                    : (window.localStorage.removeItem(l),
                      window.localStorage.removeItem(n)));
                let a = "https:" === window.location.protocol,
                  r = [
                    "".concat(i, "=").concat(o.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (a && r.push("Secure"), (document.cookie = r.join("; ")));
              }
            } finally {
              h(!1);
            }
          },
          x = async (e) => {
            h(!0);
            try {
              let t = await (0, s.z2)(e),
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
              (c(a), m(a.token));
              {
                (window.localStorage.setItem(l, JSON.stringify(a)),
                  window.localStorage.setItem(n, a.token),
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
              h(!1);
            }
          };
        return (0, o.jsx)(d.Provider, {
          value: {
            user: a,
            token: u,
            loading: p,
            login: f,
            register: x,
            logout: () => {
              (c(null),
                m(null),
                window.localStorage.removeItem(l),
                window.localStorage.removeItem(n),
                window.sessionStorage.removeItem(l),
                window.sessionStorage.removeItem(n),
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
        let e = (0, r.useContext)(d);
        if (!e) throw Error("useAuth must be used within an AuthProvider");
        return e;
      }
    },
    542: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return l;
        },
        BZ: function () {
          return d;
        },
        Nj: function () {
          return n;
        },
        GX: function () {
          return c;
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
      var o = a(8472);
      let r = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (r && (o.Z.defaults.baseURL = r),
        (o.Z.defaults.withCredentials = !0),
        o.Z.interceptors.request.use((e) => {
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
      var s = o.Z,
        l = s;
      let n = async () => {
          try {
            return (await s.get("/matatu-system/live")).data;
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
            let e = (await s.get("/map/markers")).data;
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
        d = async () => {
          try {
            let e = (await s.get("/feature-flags")).data;
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
        c = async (e) => {
          try {
            return (await s.get("/users/".concat(e, "/loyalty"))).data;
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
            return (await s.post("/payments/initiate", e)).data;
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
            return (await s.post("/payments/verify", e)).data;
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
          return l;
        },
        x4: function () {
          return r;
        },
        z2: function () {
          return s;
        },
      });
      var o = a(542);
      async function r(e) {
        try {
          return (await o.ZP.post("/auth/login", e)).data;
        } catch (o) {
          var t, a;
          let e =
            null !==
              (a =
                null == o
                  ? void 0
                  : null === (t = o.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == o ? void 0 : o.message) ||
              "Login failed",
          );
        }
      }
      async function s(e) {
        try {
          return (await o.ZP.post("/auth/register", e)).data;
        } catch (o) {
          var t, a;
          let e =
            null !==
              (a =
                null == o
                  ? void 0
                  : null === (t = o.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == o ? void 0 : o.message) ||
              "Registration failed",
          );
        }
      }
      async function l(e) {
        try {
          return (
            await o.ZP.get("/auth/profile", {
              headers: { Authorization: "Bearer ".concat(e) },
            })
          ).data;
        } catch (o) {
          var t, a;
          let e =
            null !==
              (a =
                null == o
                  ? void 0
                  : null === (t = o.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== a
              ? a
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == o ? void 0 : o.message) ||
              "Failed to load profile",
          );
        }
      }
    },
    6463: function (e, t, a) {
      "use strict";
      var o = a(1169);
      (a.o(o, "useParams") &&
        a.d(t, {
          useParams: function () {
            return o.useParams;
          },
        }),
        a.o(o, "usePathname") &&
          a.d(t, {
            usePathname: function () {
              return o.usePathname;
            },
          }),
        a.o(o, "useRouter") &&
          a.d(t, {
            useRouter: function () {
              return o.useRouter;
            },
          }));
    },
  },
  function (e) {
    (e.O(0, [472, 971, 23, 744], function () {
      return e((e.s = 8368));
    }),
      (_N_E = e.O()));
  },
]);
