(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [577],
  {
    577: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 5990));
    },
    5990: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return o;
          },
        }));
      var s = r(7437),
        a = r(2265),
        n = r(3429),
        i = r(4876),
        l = r(3901),
        d = r(7299);
      function o() {
        let { token: e } = (0, n.a)(),
          { addNotification: t } = (0, i.z)(),
          { on: r, off: o } = (0, l.s)(),
          [c, u] = (0, a.useState)(!1),
          [h, x] = (0, a.useState)(null),
          [m, p] = (0, a.useState)([]),
          [f, b] = (0, a.useState)(!0),
          [g, y] = (0, a.useState)(null);
        ((0, a.useEffect)(() => {
          if (!e) {
            (b(!1),
              y(
                "You need to be signed in as a driver to view nearby ride requests.",
              ));
            return;
          }
          if (!navigator.geolocation) {
            (b(!1), y("Geolocation is not available in this browser."));
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (e) => {
              (x({ lat: e.coords.latitude, lng: e.coords.longitude }), u(!0));
            },
            (e) => {
              (b(!1),
                y(e.message || "Unable to determine your current location."));
            },
            { enableHighAccuracy: !0, timeout: 1e4 },
          );
        }, [e]),
          (0, a.useEffect)(() => {
            if (!e || !c || !h) return;
            let t = !1;
            return (
              (async () => {
                (b(!0), y(null));
                try {
                  let r = await (0, d.uZ)({ lat: h.lat, lng: h.lng }, e);
                  if (t) return;
                  p(r || []);
                } catch (e) {
                  if (t) return;
                  y(
                    e instanceof Error
                      ? e.message
                      : "Failed to load ride requests",
                  );
                } finally {
                  t || b(!1);
                }
              })(),
              () => {
                t = !0;
              }
            );
          }, [e, c, h]),
          (0, a.useEffect)(() => {
            let e = (e) => {
              let r =
                  (null == e ? void 0 : e.id) || (null == e ? void 0 : e._id),
                s = null == e ? void 0 : e.pickup;
              (p((t) =>
                t.some((e) => (e._id || e.id) === r)
                  ? t
                  : [{ ...e, _id: (null == e ? void 0 : e._id) || r }, ...t],
              ),
                t({
                  type: "trip",
                  title: "New nearby ride request",
                  message: s
                    ? "A rider near your area has requested a pickup."
                    : "A new ride request is available.",
                }));
            };
            return (
              r("ride:created", e),
              () => {
                o("ride:created", e);
              }
            );
          }, [r, o, t]));
        let v = async (r) => {
            if (!e) {
              t({
                type: "system",
                title: "Sign in required",
                message:
                  "You need to be signed in as a driver to accept rides.",
              });
              return;
            }
            try {
              (await (0, d.nW)(r, e),
                p((e) => e.filter((e) => (e._id || e.id) !== r)),
                t({
                  type: "trip",
                  title: "Ride accepted",
                  message: "The rider has been notified of your acceptance.",
                }));
            } catch (e) {
              t({
                type: "system",
                title: "Could not accept ride",
                message:
                  e instanceof Error ? e.message : "Failed to accept ride",
              });
            }
          },
          N = m.length > 0;
        return (0, s.jsxs)("div", {
          className: "space-y-4",
          children: [
            (0, s.jsxs)("header", {
              className: "space-y-1",
              children: [
                (0, s.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Nearby ride requests",
                }),
                (0, s.jsx)("p", {
                  className: "text-xs text-slate-300",
                  children:
                    "See ride requests near your current location and accept them in real time.",
                }),
              ],
            }),
            f &&
              (0, s.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children: "Loading nearby requests...",
              }),
            g &&
              !f &&
              (0, s.jsx)("div", {
                className:
                  "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                children: g,
              }),
            !f &&
              !g &&
              !N &&
              (0, s.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children:
                  "No nearby ride requests right now. When passengers request rides near you, they will appear here.",
              }),
            !f &&
              !g &&
              N &&
              (0, s.jsx)("div", {
                className:
                  "overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80",
                children: (0, s.jsxs)("table", {
                  className: "min-w-full border-collapse text-xs",
                  children: [
                    (0, s.jsx)("thead", {
                      className: "bg-slate-900/80 text-slate-300",
                      children: (0, s.jsxs)("tr", {
                        children: [
                          (0, s.jsx)("th", {
                            className: "px-3 py-2 text-left font-medium",
                            children: "Pickup",
                          }),
                          (0, s.jsx)("th", {
                            className: "px-3 py-2 text-left font-medium",
                            children: "Requested at",
                          }),
                          (0, s.jsx)("th", {
                            className: "px-3 py-2 text-right font-medium",
                            children: "Actions",
                          }),
                        ],
                      }),
                    }),
                    (0, s.jsx)("tbody", {
                      children: m.map((e) => {
                        let t = e._id || e.id || "",
                          r = e.createdAt ? new Date(e.createdAt) : null,
                          a = e.pickup,
                          n = "—";
                        if (
                          a &&
                          Array.isArray(a.coordinates) &&
                          2 === a.coordinates.length
                        ) {
                          let [e, t] = a.coordinates;
                          n = ""
                            .concat(t.toFixed(4), ", ")
                            .concat(e.toFixed(4));
                        }
                        return (0, s.jsxs)(
                          "tr",
                          {
                            className: "border-t border-slate-800/80",
                            children: [
                              (0, s.jsx)("td", {
                                className: "px-3 py-2 text-slate-100",
                                children: n,
                              }),
                              (0, s.jsx)("td", {
                                className: "px-3 py-2 text-slate-300",
                                children: r ? r.toLocaleString() : "Just now",
                              }),
                              (0, s.jsx)("td", {
                                className: "px-3 py-2 text-right",
                                children: (0, s.jsx)("button", {
                                  type: "button",
                                  onClick: () => v(t),
                                  className:
                                    "inline-flex items-center rounded-md border border-emerald-600/60 bg-emerald-600/20 px-2 py-1 text-[11px] font-medium text-emerald-100 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-600/30",
                                  children: "Accept",
                                }),
                              }),
                            ],
                          },
                          t,
                        );
                      }),
                    }),
                  ],
                }),
              }),
          ],
        });
      }
    },
    7299: function (e, t, r) {
      "use strict";
      r.d(t, {
        jc: function () {
          return n;
        },
        nW: function () {
          return l;
        },
        uZ: function () {
          return i;
        },
      });
      var s = r(542);
      async function a(e) {
        let t,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: a = "GET", body: n, token: i } = r,
          l = {};
        i && (l.Authorization = "Bearer ".concat(i));
        for (let r = 1; r <= 3; r += 1)
          try {
            let t = (
              await s.ZP.request({ url: e, method: a, data: n, headers: l })
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
          } catch (n) {
            var d, o, c;
            ((t = n),
              console.error(
                "API ERROR:",
                (null == n
                  ? void 0
                  : null === (d = n.response) || void 0 === d
                    ? void 0
                    : d.data) || n,
              ));
            let e =
                null == n
                  ? void 0
                  : null === (o = n.response) || void 0 === o
                    ? void 0
                    : o.status,
              s =
                null == n
                  ? void 0
                  : null === (c = n.response) || void 0 === c
                    ? void 0
                    : c.data,
              a =
                (s && "object" == typeof s && (s.message || s.error)) ||
                (null == n ? void 0 : n.message) ||
                "Request failed";
            if (e && e >= 500 && r < 3) {
              t = Error(a);
              continue;
            }
            throw Error(a);
          }
        throw t instanceof Error ? t : Error("Request failed");
      }
      async function n(e, t) {
        return a("/rides/request", { method: "POST", body: e, token: t });
      }
      async function i(e, t) {
        let r = new URLSearchParams();
        return (
          r.set("lat", String(e.lat)),
          r.set("lng", String(e.lng)),
          "number" == typeof e.radiusMeters &&
            r.set("radius", String(e.radiusMeters)),
          a("/rides/nearby?".concat(r.toString()), { method: "GET", token: t })
        );
      }
      async function l(e, t) {
        return a("/rides/".concat(e, "/accept"), { method: "POST", token: t });
      }
    },
  },
  function (e) {
    (e.O(0, [472, 40, 401, 971, 23, 744], function () {
      return e((e.s = 577));
    }),
      (_N_E = e.O()));
  },
]);
