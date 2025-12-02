(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [74],
  {
    2056: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 3217));
    },
    3217: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return l;
          },
        }));
      var n = a(7437),
        r = a(2265),
        s = a(542),
        o = a(4876);
      function l() {
        let { addNotification: e } = (0, o.z)(),
          [t, a] = (0, r.useState)(50),
          [l, i] = (0, r.useState)("mpesa"),
          [c, d] = (0, r.useState)(""),
          [u, p] = (0, r.useState)(null),
          [m, y] = (0, r.useState)(!1),
          f = window.localStorage.getItem("radaa_user_id"),
          h = async () => {
            if (f) {
              y(!0);
              try {
                let a = await (0, s.eg)({ userId: f, amount: t, method: l });
                (p(a),
                  a.transactionId && d(a.transactionId),
                  e({
                    type: "payment",
                    title: "Payment initiated",
                    message: "Started a "
                      .concat(l, " payment for KES ")
                      .concat(t, "."),
                  }));
              } catch (e) {
                p({ error: !0 });
              } finally {
                y(!1);
              }
            }
          },
          v = async () => {
            if (f && c) {
              y(!0);
              try {
                var a;
                let n = await (0, s.m5)({
                  userId: f,
                  amount: t,
                  method: l,
                  transactionId: c,
                });
                p(n);
                let r =
                  null == n
                    ? void 0
                    : null === (a = n.verification) || void 0 === a
                      ? void 0
                      : a.status;
                "success" === r
                  ? e({
                      type: "payment",
                      title: "Payment confirmed",
                      message: "Payment ".concat(
                        c,
                        " was verified successfully.",
                      ),
                    })
                  : e({
                      type: "payment",
                      title: "Payment verification",
                      message: "Verification for payment "
                        .concat(c, " completed with status: ")
                        .concat(null != r ? r : "unknown", "."),
                    });
              } catch (e) {
                p({ error: !0 });
              } finally {
                y(!1);
              }
            }
          };
        return (0, n.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, n.jsxs)("section", {
              className: "space-y-2",
              children: [
                (0, n.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Payments",
                }),
                (0, n.jsx)("p", {
                  className: "text-xs text-slate-300",
                  children:
                    "This page uses a placeholder payment gateway. Wire it up to Mpesa STK Push, Stripe, or Flutterwave in production.",
                }),
              ],
            }),
            (0, n.jsxs)("section", {
              className:
                "space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
              children: [
                (0, n.jsxs)("div", {
                  className: "grid gap-4 md:grid-cols-3",
                  children: [
                    (0, n.jsxs)("label", {
                      className: "space-y-1",
                      children: [
                        (0, n.jsx)("span", {
                          className: "block text-slate-300",
                          children: "Amount (KES)",
                        }),
                        (0, n.jsx)("input", {
                          type: "number",
                          value: t,
                          onChange: (e) => a(Number(e.target.value)),
                          className:
                            "w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm",
                        }),
                      ],
                    }),
                    (0, n.jsxs)("label", {
                      className: "space-y-1",
                      children: [
                        (0, n.jsx)("span", {
                          className: "block text-slate-300",
                          children: "Method",
                        }),
                        (0, n.jsxs)("select", {
                          value: l,
                          onChange: (e) => i(e.target.value),
                          className:
                            "w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm",
                          children: [
                            (0, n.jsx)("option", {
                              value: "mpesa",
                              children: "Mpesa (placeholder)",
                            }),
                            (0, n.jsx)("option", {
                              value: "card",
                              children: "Card (placeholder)",
                            }),
                            (0, n.jsx)("option", {
                              value: "flutterwave",
                              children: "Flutterwave (placeholder)",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, n.jsxs)("label", {
                      className: "space-y-1",
                      children: [
                        (0, n.jsx)("span", {
                          className: "block text-slate-300",
                          children: "Transaction ID (for verify)",
                        }),
                        (0, n.jsx)("input", {
                          type: "text",
                          value: c,
                          onChange: (e) => d(e.target.value),
                          className:
                            "w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm",
                          placeholder:
                            "Auto-filled when initiate returns an ID",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, n.jsxs)("div", {
                  className: "flex gap-3",
                  children: [
                    (0, n.jsx)("button", {
                      onClick: h,
                      disabled: m || !f,
                      className:
                        "rounded bg-sky-500 px-3 py-1 text-xs font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
                      children: "Initiate payment",
                    }),
                    (0, n.jsx)("button", {
                      onClick: v,
                      disabled: m || !f || !c,
                      className:
                        "rounded bg-emerald-500 px-3 py-1 text-xs font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
                      children: "Verify payment",
                    }),
                  ],
                }),
                u &&
                  (0, n.jsx)("pre", {
                    className:
                      "mt-3 max-h-40 overflow-auto rounded bg-slate-950 p-2 text-[10px] text-slate-200",
                    children: JSON.stringify(u, null, 2),
                  }),
              ],
            }),
          ],
        });
      }
    },
    4876: function (e, t, a) {
      "use strict";
      a.d(t, {
        NotificationProvider: function () {
          return l;
        },
        z: function () {
          return i;
        },
      });
      var n = a(7437),
        r = a(2265),
        s = a(5040);
      let o = (0, r.createContext)(void 0);
      function l(e) {
        let { children: t } = e,
          [a, l] = (0, r.useState)([]),
          i = (0, r.useCallback)((e) => {
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
          c = (0, r.useCallback)(() => {
            l((e) => e.map((e) => ({ ...e, read: !0 })));
          }, []),
          d = (0, r.useCallback)((e) => {
            l((t) => t.map((t) => (t.id === e ? { ...t, read: !0 } : t)));
          }, []),
          u = (0, r.useMemo)(() => a.filter((e) => !e.read).length, [a]);
        (0, r.useEffect)(() => {
          let e;
          let t = "wss://radaa-1.onrender.com";
          if (!t) return;
          let a = "".concat(t.replace(/\/+$/, ""), "/realtime");
          {
            let t =
              window.localStorage.getItem("token") ||
              window.sessionStorage.getItem("token");
            t && "string" == typeof t && (e = { token: t });
          }
          if (!e) return;
          let n = (0, s.io)(a, {
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
                a = null == e ? void 0 : e.route;
              i({
                type: "matatu",
                title: "Matatu location update",
                message: a
                  ? ""
                      .concat(t, " on route ")
                      .concat(a, " reported a new location.")
                  : "".concat(t, " reported a new location."),
              });
            }),
            n.on("connect_error", () => {
              i({
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
        }, [i]);
        let p = (0, r.useMemo)(
          () => ({
            notifications: a,
            unreadCount: u,
            addNotification: i,
            markAllAsRead: c,
            markAsRead: d,
          }),
          [a, u, i, c, d],
        );
        return (0, n.jsx)(o.Provider, { value: p, children: t });
      }
      function i() {
        let e = (0, r.useContext)(o);
        if (!e)
          throw Error(
            "useNotifications must be used within a NotificationProvider",
          );
        return e;
      }
    },
    542: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return o;
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
          return p;
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
      var s = n.Z,
        o = s;
      let l = async () => {
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
        c = async () => {
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
        d = async (e) => {
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
        p = async (e) => {
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
  },
  function (e) {
    (e.O(0, [472, 40, 971, 23, 744], function () {
      return e((e.s = 2056));
    }),
      (_N_E = e.O()));
  },
]);
