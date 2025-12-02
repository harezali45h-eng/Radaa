"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [401],
  {
    3429: function (e, t, o) {
      o.d(t, {
        AuthProvider: function () {
          return u;
        },
        a: function () {
          return d;
        },
      });
      var n = o(7437),
        a = o(2265),
        r = o(2315);
      let i = "user",
        l = "token",
        c = "radaa_token",
        s = (0, a.createContext)(void 0);
      function u(e) {
        let { children: t } = e,
          [o, u] = (0, a.useState)(null),
          [d, f] = (0, a.useState)(null),
          [m, w] = (0, a.useState)(!0);
        (0, a.useEffect)(() => {
          try {
            let e = window.localStorage.getItem(i),
              t = window.sessionStorage.getItem(i),
              o = null,
              n = null;
            if (e) {
              let t = JSON.parse(e);
              t &&
                "string" == typeof t._id &&
                "string" == typeof t.token &&
                ((o = t), (n = t.token));
            }
            if (!o && t) {
              let e = JSON.parse(t);
              e &&
                "string" == typeof e._id &&
                "string" == typeof e.token &&
                ((o = e), (n = e.token));
            }
            if (!n) {
              let e =
                window.localStorage.getItem(l) ||
                window.sessionStorage.getItem(l);
              e && "string" == typeof e && (n = e);
            }
            (o && u(o), n && f(n));
          } catch (e) {
          } finally {
            w(!1);
          }
        }, []);
        let v = async function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            w(!0);
            try {
              let o = await (0, r.x4)(e),
                n = {
                  _id: o._id,
                  email: o.email,
                  token: o.token,
                  username: o.username,
                  handle: o.handle,
                  phone: o.phone,
                  createdAt: o.createdAt,
                  role: o.role,
                  enabled: o.enabled,
                  driverProfile: o.driverProfile,
                  driverVerificationStatus: o.driverVerificationStatus,
                  saccoProfile: o.saccoProfile,
                };
              (u(n), f(n.token));
              {
                let e = t ? window.localStorage : window.sessionStorage;
                (e.setItem(i, JSON.stringify(n)),
                  e.setItem(l, n.token),
                  window.localStorage.setItem("radaa_user_id", n._id),
                  t
                    ? (window.sessionStorage.removeItem(i),
                      window.sessionStorage.removeItem(l))
                    : (window.localStorage.removeItem(i),
                      window.localStorage.removeItem(l)));
                let o = "https:" === window.location.protocol,
                  a = [
                    "".concat(c, "=").concat(n.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (o && a.push("Secure"), (document.cookie = a.join("; ")));
              }
            } finally {
              w(!1);
            }
          },
          g = async (e) => {
            w(!0);
            try {
              let t = await (0, r.z2)(e),
                o = {
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
              (u(o), f(o.token));
              {
                (window.localStorage.setItem(i, JSON.stringify(o)),
                  window.localStorage.setItem(l, o.token),
                  window.localStorage.setItem("radaa_user_id", o._id));
                let e = "https:" === window.location.protocol,
                  t = [
                    "".concat(c, "=").concat(o.token),
                    "Path=/",
                    "SameSite=Lax",
                    "Max-Age=604800",
                  ];
                (e && t.push("Secure"), (document.cookie = t.join("; ")));
              }
            } finally {
              w(!1);
            }
          };
        return (0, n.jsx)(s.Provider, {
          value: {
            user: o,
            token: d,
            loading: m,
            login: v,
            register: g,
            logout: () => {
              (u(null),
                f(null),
                window.localStorage.removeItem(i),
                window.localStorage.removeItem(l),
                window.sessionStorage.removeItem(i),
                window.sessionStorage.removeItem(l),
                window.localStorage.removeItem("radaa_user_id"),
                (document.cookie = "".concat(
                  c,
                  "=; Path=/; Max-Age=0; SameSite=Lax",
                )));
            },
          },
          children: t,
        });
      }
      function d() {
        let e = (0, a.useContext)(s);
        if (!e) throw Error("useAuth must be used within an AuthProvider");
        return e;
      }
    },
    4876: function (e, t, o) {
      o.d(t, {
        NotificationProvider: function () {
          return l;
        },
        z: function () {
          return c;
        },
      });
      var n = o(7437),
        a = o(2265),
        r = o(5040);
      let i = (0, a.createContext)(void 0);
      function l(e) {
        let { children: t } = e,
          [o, l] = (0, a.useState)([]),
          c = (0, a.useCallback)((e) => {
            l((t) => [
              {
                id: ""
                  .concat(Date.now(), "-")
                  .concat(Math.random().toString(36).slice(2)),
                type: e.type,
                title: e.title,
                message: e.message,
                createdAt: new Date().toISOString(),
                read: !1,
              },
              ...t,
            ]);
          }, []),
          s = (0, a.useCallback)(() => {
            l((e) => e.map((e) => ({ ...e, read: !0 })));
          }, []),
          u = (0, a.useCallback)((e) => {
            l((t) => t.map((t) => (t.id === e ? { ...t, read: !0 } : t)));
          }, []),
          d = (0, a.useMemo)(() => o.filter((e) => !e.read).length, [o]);
        (0, a.useEffect)(() => {
          let e;
          let t = "wss://radaa-1.onrender.com";
          if (!t) return;
          let o = "".concat(t.replace(/\/+$/, ""), "/realtime");
          {
            let t =
              window.localStorage.getItem("token") ||
              window.sessionStorage.getItem("token");
            t && "string" == typeof t && (e = { token: t });
          }
          if (!e) return;
          let n = (0, r.io)(o, {
            transports: ["websocket"],
            path: "/socket.io",
            auth: e,
          });
          return (
            n.on("matatu:update", (e) => {
              let t =
                  (null == e ? void 0 : e.plate) ||
                  (null == e ? void 0 : e.numberPlate) ||
                  "Matatu",
                o = null == e ? void 0 : e.route;
              c({
                type: "matatu",
                title: "Matatu location update",
                message: o
                  ? ""
                      .concat(t, " on route ")
                      .concat(o, " reported a new location.")
                  : "".concat(t, " reported a new location."),
              });
            }),
            n.on("connect_error", () => {
              c({
                type: "system",
                title: "Realtime temporarily unavailable",
                message:
                  "Socket connection failed. Live notifications may be delayed.",
              });
            }),
            () => {
              n.disconnect();
            }
          );
        }, [c]);
        let f = (0, a.useMemo)(
          () => ({
            notifications: o,
            unreadCount: d,
            addNotification: c,
            markAllAsRead: s,
            markAsRead: u,
          }),
          [o, d, c, s, u],
        );
        return (0, n.jsx)(i.Provider, { value: f, children: t });
      }
      function c() {
        let e = (0, a.useContext)(i);
        if (!e)
          throw Error(
            "useNotifications must be used within a NotificationProvider",
          );
        return e;
      }
    },
    3901: function (e, t, o) {
      o.d(t, {
        s: function () {
          return f;
        },
      });
      var n = o(2265),
        a = o(5040);
      let r = "token",
        i = "user",
        l = "wss://radaa-1.onrender.com".replace(/\/+$/, ""),
        c = null,
        s = 0;
      function u() {
        try {
          for (let e of [
            window.localStorage.getItem(i),
            window.sessionStorage.getItem(i),
          ]) {
            if (!e) continue;
            let t = JSON.parse(e);
            if (t && "string" == typeof t.token) return t.token;
          }
          return (
            window.localStorage.getItem(r) || window.sessionStorage.getItem(r)
          );
        } catch (e) {
          return null;
        }
      }
      function d(e) {
        if (c) e && (c.auth = { ...(c.auth || {}), token: e });
        else {
          var t;
          let o = "".concat(l).concat("/realtime");
          c = (0, a.io)(o, {
            autoConnect: !1,
            transports: ["websocket"],
            path: "/socket.io",
            withCredentials: !0,
            auth: {
              token:
                null !== (t = null != e ? e : u()) && void 0 !== t ? t : void 0,
            },
            reconnection: !0,
            reconnectionAttempts: 1 / 0,
            reconnectionDelay: 500,
            reconnectionDelayMax: 1e4,
            randomizationFactor: 0.5,
            timeout: 1e4,
          });
        }
        return c;
      }
      function f() {
        let [e, t] = (0, n.useState)(!1);
        (0, n.useEffect)(() => {
          let e = d(null);
          if (!e) return;
          s += 1;
          let o = () => {
              t(!0);
            },
            n = () => {
              t(!1);
            },
            a = (e) => {
              console.error("[useSocket] connect_error", e);
            };
          return (
            e.on("connect", o),
            e.on("disconnect", n),
            e.on("connect_error", a),
            e.connected && t(!0),
            () => {
              c &&
                (c.off("connect", o),
                c.off("disconnect", n),
                c.off("connect_error", a),
                0 === (s = Math.max(0, s - 1)) &&
                  (c.removeAllListeners(), c.disconnect(), (c = null)));
            }
          );
        }, []);
        let o = (0, n.useCallback)((e) => {
            let t = null != e ? e : u();
            if (!t) return;
            let o = d(t);
            o &&
              (t && (o.auth = { ...(o.auth || {}), token: t }),
              o.connected || o.connect());
          }, []),
          a = (0, n.useCallback)(() => {
            c && c.disconnect();
          }, []);
        return {
          connect: o,
          disconnect: a,
          emit: (0, n.useCallback)((e, t, o) => {
            let n = c;
            n &&
              (o
                ? void 0 !== t
                  ? n.emit(e, t, o)
                  : n.emit(e, o)
                : void 0 !== t
                  ? n.emit(e, t)
                  : n.emit(e));
          }, []),
          on: (0, n.useCallback)((e, t) => {
            let o = c;
            o && (o.off(e, t), o.on(e, t));
          }, []),
          off: (0, n.useCallback)((e, t) => {
            let o = c;
            o && (t ? o.off(e, t) : o.removeAllListeners(e));
          }, []),
          connected: e,
        };
      }
    },
    542: function (e, t, o) {
      o.d(t, {
        ZP: function () {
          return i;
        },
        BZ: function () {
          return s;
        },
        Nj: function () {
          return l;
        },
        GX: function () {
          return u;
        },
        Yf: function () {
          return c;
        },
        eg: function () {
          return d;
        },
        m5: function () {
          return f;
        },
      });
      var n = o(8472);
      let a = "https://radaa-1.onrender.com/api".replace(/\/+$/, "");
      (a && (n.Z.defaults.baseURL = a),
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
      var r = n.Z,
        i = r;
      let l = async () => {
          try {
            return (await r.get("/matatu-system/live")).data;
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
            let e = (await r.get("/map/markers")).data;
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
        s = async () => {
          try {
            let e = (await r.get("/feature-flags")).data;
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
        u = async (e) => {
          try {
            return (await r.get("/users/".concat(e, "/loyalty"))).data;
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
        d = async (e) => {
          try {
            return (await r.post("/payments/initiate", e)).data;
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
        f = async (e) => {
          try {
            return (await r.post("/payments/verify", e)).data;
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
    2315: function (e, t, o) {
      o.d(t, {
        Ai: function () {
          return i;
        },
        x4: function () {
          return a;
        },
        z2: function () {
          return r;
        },
      });
      var n = o(542);
      async function a(e) {
        try {
          return (await n.ZP.post("/auth/login", e)).data;
        } catch (n) {
          var t, o;
          let e =
            null !==
              (o =
                null == n
                  ? void 0
                  : null === (t = n.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== o
              ? o
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == n ? void 0 : n.message) ||
              "Login failed",
          );
        }
      }
      async function r(e) {
        try {
          return (await n.ZP.post("/auth/register", e)).data;
        } catch (n) {
          var t, o;
          let e =
            null !==
              (o =
                null == n
                  ? void 0
                  : null === (t = n.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== o
              ? o
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == n ? void 0 : n.message) ||
              "Registration failed",
          );
        }
      }
      async function i(e) {
        try {
          return (
            await n.ZP.get("/auth/profile", {
              headers: { Authorization: "Bearer ".concat(e) },
            })
          ).data;
        } catch (n) {
          var t, o;
          let e =
            null !==
              (o =
                null == n
                  ? void 0
                  : null === (t = n.response) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== o
              ? o
              : {};
          throw Error(
            ("string" == typeof e.message && e.message) ||
              (null == n ? void 0 : n.message) ||
              "Failed to load profile",
          );
        }
      }
    },
  },
]);
