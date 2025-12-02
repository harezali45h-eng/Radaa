(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [581],
  {
    2330: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 2223));
    },
    2223: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return v;
          },
        }));
      var a = r(7437),
        n = r(2265),
        s = r(3314),
        l = r(3429),
        i = r(4876),
        o = r(3901),
        d = r(728),
        u = r(2858),
        c = r(542);
      async function m(e) {
        let t,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: a = "GET", body: n, token: s } = r,
          l = {};
        s && (l.Authorization = "Bearer ".concat(s));
        for (let r = 1; r <= 3; r += 1)
          try {
            let t = (
              await c.ZP.request({ url: e, method: a, data: n, headers: l })
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
          } catch (s) {
            var i, o, d;
            ((t = s),
              console.error(
                "API ERROR:",
                (null == s
                  ? void 0
                  : null === (i = s.response) || void 0 === i
                    ? void 0
                    : i.data) || s,
              ));
            let e =
                null == s
                  ? void 0
                  : null === (o = s.response) || void 0 === o
                    ? void 0
                    : o.status,
              a =
                null == s
                  ? void 0
                  : null === (d = s.response) || void 0 === d
                    ? void 0
                    : d.data,
              n =
                (a && "object" == typeof a && (a.message || a.error)) ||
                (null == s ? void 0 : s.message) ||
                "Request failed";
            if (e && e >= 500 && r < 3) {
              t = Error(n);
              continue;
            }
            throw Error(n);
          }
        throw t instanceof Error ? t : Error("Request failed");
      }
      async function g(e) {
        let t = await m("/matatu-system/live", {
          method: "GET",
          token: null != e ? e : null,
        });
        return Array.isArray(t) ? t : [];
      }
      r(7299);
      var f = function (e) {
        var t;
        let { items: r, onSelect: s } = e,
          [l, i] = (0, n.useState)(0),
          o = null !== (t = r[l]) && void 0 !== t ? t : null,
          d = Math.max(0, r.length - l - (o ? 1 : 0)),
          u = (0, n.useMemo)(
            () =>
              o
                ? o.route || o.plate || o.numberPlate || "Matatu"
                : "No matatus nearby",
            [o],
          ),
          c = (0, n.useMemo)(
            () =>
              o ? (o.sacco ? o.sacco : "Swipe through nearby options") : "",
            [o],
          );
        if (!o)
          return (0, a.jsx)("div", {
            className:
              "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
            children: "No nearby matatus to show right now.",
          });
        let m = o.plate || o.numberPlate || o.id.slice(0, 6),
          g = null != o.distanceMeters ? o.distanceMeters / 1e3 : null,
          f = null != o.etaMinutes ? Math.round(o.etaMinutes) : null;
        return (0, a.jsxs)("div", {
          className:
            "relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-soft backdrop-blur",
          children: [
            (0, a.jsxs)("div", {
              className: "mb-2 flex items-center justify-between",
              children: [
                (0, a.jsxs)("div", {
                  children: [
                    (0, a.jsx)("div", {
                      className:
                        "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                      children: "Nearby match",
                    }),
                    (0, a.jsx)("div", {
                      className: "text-sm font-semibold text-slate-50",
                      children: u,
                    }),
                    c &&
                      (0, a.jsx)("div", {
                        className: "text-[11px] text-slate-400",
                        children: c,
                      }),
                  ],
                }),
                d > 0 &&
                  (0, a.jsxs)("span", {
                    className:
                      "rounded-full bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400",
                    children: ["+", d, " more"],
                  }),
              ],
            }),
            (0, a.jsxs)("div", {
              className:
                "relative mb-3 overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900",
              children: [
                o.mainPhotoUrl
                  ? (0, a.jsx)("img", {
                      src: o.mainPhotoUrl,
                      alt: m,
                      className: "h-32 w-full object-cover opacity-90",
                    })
                  : (0, a.jsx)("div", {
                      className:
                        "flex h-32 items-center justify-center text-[11px] text-slate-400",
                      children: "Live matatu preview",
                    }),
                (0, a.jsx)("div", {
                  className:
                    "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent",
                }),
                (0, a.jsxs)("div", {
                  className:
                    "absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-100",
                  children: [
                    (0, a.jsxs)("div", {
                      children: [
                        (0, a.jsx)("div", {
                          className: "font-semibold",
                          children: m,
                        }),
                        o.route &&
                          (0, a.jsxs)("div", {
                            className: "text-slate-300",
                            children: ["Route ", o.route],
                          }),
                      ],
                    }),
                    (0, a.jsxs)("div", {
                      className: "text-right text-[10px] text-slate-200",
                      children: [
                        null != g &&
                          (0, a.jsxs)("div", {
                            children: [g.toFixed(1), " km away"],
                          }),
                        null != f &&
                          (0, a.jsxs)("div", {
                            children: ["~", f, " min ETA"],
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, a.jsxs)("div", {
              className: "flex items-center justify-between gap-2",
              children: [
                (0, a.jsx)("button", {
                  type: "button",
                  onClick: () => {
                    i((e) => (e + 1 < r.length ? e + 1 : e));
                  },
                  className:
                    "inline-flex flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-800",
                  children: "Skip",
                }),
                (0, a.jsx)("button", {
                  type: "button",
                  onClick: () => {
                    (o && s && s(o.id),
                      i((e) => (e + 1 < r.length ? e + 1 : e)));
                  },
                  className:
                    "inline-flex flex-1 items-center justify-center rounded-full border border-sky-500 bg-sky-600/80 px-3 py-1.5 text-[11px] font-semibold text-slate-50 shadow-soft transition hover:bg-sky-500",
                  children: "Save",
                }),
              ],
            }),
          ],
        });
      };
      async function p(e) {
        let t,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: a = "GET", body: n, token: s } = r,
          l = {};
        s && (l.Authorization = "Bearer ".concat(s));
        for (let r = 1; r <= 3; r += 1)
          try {
            let t = (
              await c.ZP.request({ url: e, method: a, data: n, headers: l })
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
          } catch (s) {
            var i, o, d;
            ((t = s),
              console.error(
                "API ERROR:",
                (null == s
                  ? void 0
                  : null === (i = s.response) || void 0 === i
                    ? void 0
                    : i.data) || s,
              ));
            let e =
                null == s
                  ? void 0
                  : null === (o = s.response) || void 0 === o
                    ? void 0
                    : o.status,
              a =
                null == s
                  ? void 0
                  : null === (d = s.response) || void 0 === d
                    ? void 0
                    : d.data,
              n =
                (a && "object" == typeof a && (a.message || a.error)) ||
                (null == s ? void 0 : s.message) ||
                "Request failed";
            if (e && e >= 500 && r < 3) {
              t = Error(n);
              continue;
            }
            throw Error(n);
          }
        throw t instanceof Error ? t : Error("Request failed");
      }
      async function x(e, t) {
        return p("/requests", { method: "POST", body: e, token: t });
      }
      async function h(e, t, r) {
        await p("/requests/".concat(e, "/ping-location"), {
          method: "POST",
          body: { location: t },
          token: r,
        });
      }
      function v() {
        let { token: e } = (0, l.a)(),
          { addNotification: t } = (0, i.z)(),
          { on: r, off: c, emit: m } = (0, o.s)(),
          { matatus: p } = (0, d.r)(),
          v = (0, u.N3)("DRIVER_REQUESTS_V1", !1),
          b = (0, u.N3)("AUTO_CANCEL_V1", !1),
          y = (0, u.N3)("ui_revamp_v1", !1),
          [w, j] = (0, n.useState)(null),
          [N, S] = (0, n.useState)([]),
          [E, M] = (0, n.useState)(!0),
          [P, q] = (0, n.useState)(null),
          [R, A] = (0, n.useState)("Idle"),
          [_, k] = (0, n.useState)(null),
          [C, I] = (0, n.useState)(null),
          T = (0, n.useRef)(null);
        ((0, n.useEffect)(() => {
          if (!e) {
            (M(!1), q("You need to be signed in to view live passenger data."));
            return;
          }
          if (!navigator.geolocation) {
            (M(!1), q("Geolocation is not available in this browser."));
            return;
          }
          let t = !1;
          return (
            navigator.geolocation.getCurrentPosition(
              (r) => {
                t ||
                  (j({ lat: r.coords.latitude, lng: r.coords.longitude }),
                  M(!0),
                  q(null),
                  (async () => {
                    try {
                      let r = await g(e);
                      if (t) return;
                      S(Array.isArray(r) ? r : []);
                    } catch (e) {
                      if (t) return;
                      q(
                        e instanceof Error
                          ? e.message
                          : "Failed to load nearby matatus",
                      );
                    } finally {
                      t || M(!1);
                    }
                  })());
              },
              (e) => {
                t ||
                  (M(!1),
                  q(e.message || "Unable to determine your current location."));
              },
              { enableHighAccuracy: !0, timeout: 1e4 },
            ),
            () => {
              t = !0;
            }
          );
        }, [e]),
          (0, n.useEffect)(() => {
            if (!e || !v || !b || !_) {
              null != T.current &&
                (window.clearInterval(T.current), (T.current = null));
              return;
            }
            if (!navigator.geolocation) return;
            let t = window.setInterval(() => {
              navigator.geolocation.getCurrentPosition(
                (t) => {
                  h(
                    _,
                    { lat: t.coords.latitude, lng: t.coords.longitude },
                    e,
                  ).catch(() => {});
                },
                () => {},
                { enableHighAccuracy: !0, maximumAge: 5e3, timeout: 1e4 },
              );
            }, 5e3);
            return (
              (T.current = t),
              () => {
                null != T.current &&
                  (window.clearInterval(T.current), (T.current = null));
              }
            );
          }, [e, v, b, _]),
          (0, n.useEffect)(() => {
            if (!e || !navigator.geolocation) return;
            let t = null;
            return (
              (t = navigator.geolocation.watchPosition(
                (e) => {
                  let t = { lat: e.coords.latitude, lng: e.coords.longitude };
                  m("passenger:update_location", { lat: t.lat, lng: t.lng });
                },
                () => {},
                { enableHighAccuracy: !0, maximumAge: 5e3, timeout: 1e4 },
              )),
              () => {
                null != t &&
                  navigator.geolocation &&
                  navigator.geolocation.clearWatch(t);
              }
            );
          }, [e, m]),
          (0, n.useEffect)(() => {
            let e = (e) => {
                let r =
                  (null == e ? void 0 : e.id) || (null == e ? void 0 : e._id);
                (_ && r && String(r) !== _) ||
                  (A("Accepted"),
                  I(null),
                  t({
                    type: "trip",
                    title: "Driver on the way",
                    message: "Your ride has been accepted.",
                  }));
              },
              a = (e) => {
                let r =
                  (null == e ? void 0 : e.id) ||
                  (null == e ? void 0 : e._id) ||
                  (null == e ? void 0 : e.requestId);
                (_ && r && String(r) !== _) ||
                  (A("Cancelled"),
                  k(null),
                  I(null),
                  t({
                    type: "trip",
                    title: "Ride cancelled",
                    message:
                      "Your current ride was cancelled. You can request another.",
                  }));
              },
              n = (e) => {
                let r = null == e ? void 0 : e.requestId;
                r &&
                  _ &&
                  String(r) === _ &&
                  (A("Auto-cancel warning"),
                  I(
                    "You have moved away from your pickup point. Stay nearby to avoid auto-cancel.",
                  ),
                  t({
                    type: "trip",
                    title: "Stay near your pickup",
                    message:
                      "You moved away from your pickup point. The request may auto-cancel soon.",
                  }));
              },
              s = (e) => {
                let r = null == e ? void 0 : e.requestId;
                r &&
                  _ &&
                  String(r) === _ &&
                  (A("Auto-cancelled"),
                  k(null),
                  I(
                    "Your request was auto-cancelled because you moved too far away.",
                  ),
                  t({
                    type: "trip",
                    title: "Ride auto-cancelled",
                    message:
                      "Your ride request was auto-cancelled after moving away from the pickup.",
                  }));
              };
            return (
              r("ride:accepted", e),
              r("ride:cancelled", a),
              r("ride:auto_cancel_warning", n),
              r("ride:auto_cancelled", s),
              () => {
                (c("ride:accepted", e),
                  c("ride:cancelled", a),
                  c("ride:auto_cancel_warning", n),
                  c("ride:auto_cancelled", s));
              }
            );
          }, [r, c, t, _]));
        let F = (0, n.useMemo)(() => {
            let e = N.length > 0 ? N : p;
            if (!w || !Array.isArray(e)) return [];
            let t = e
              .map((e) => {
                let t = e.location;
                if (!t || "number" != typeof t.lat || "number" != typeof t.lng)
                  return null;
                let r = (function (e, t) {
                  let r = ((t.lat - e.lat) * Math.PI) / 180,
                    a = ((t.lng - e.lng) * Math.PI) / 180,
                    n = (e.lat * Math.PI) / 180,
                    s = (t.lat * Math.PI) / 180,
                    l = Math.sin(r / 2),
                    i = Math.sin(a / 2),
                    o = l * l + Math.cos(n) * Math.cos(s) * i * i;
                  return (
                    2 * Math.atan2(Math.sqrt(o), Math.sqrt(1 - o)) * 6371e3
                  );
                })(w, { lat: t.lat, lng: t.lng });
                return {
                  ...e,
                  distanceMeters: r,
                  etaMinutes: (r / 1e3 / 25) * 60,
                };
              })
              .filter(Boolean);
            return (
              t.sort((e, t) => e.distanceMeters - t.distanceMeters),
              t.slice(0, 5)
            );
          }, [N, p, w]),
          O = F.length > 0,
          U = (0, n.useMemo)(
            () =>
              F.map((e) => {
                var t;
                return {
                  id: String(e.id || e._id || "-"),
                  plate: e.plate,
                  numberPlate: e.numberPlate,
                  route: e.route,
                  sacco: e.sacco,
                  mainPhotoUrl:
                    null !== (t = e.mainPhotoUrl) && void 0 !== t ? t : null,
                  rating: e.rating,
                  distanceMeters: e.distanceMeters,
                  etaMinutes: e.etaMinutes,
                };
              }),
            [F],
          );
        return (0, a.jsxs)("div", {
          className: "space-y-4",
          children: [
            (0, a.jsxs)("header", {
              className: "space-y-1",
              children: [
                (0, a.jsx)("h1", {
                  className: "text-2xl font-semibold tracking-tight",
                  children: "Passenger live dashboard",
                }),
                (0, a.jsx)("p", {
                  className: "text-xs text-slate-300",
                  children:
                    "Request a ride, see nearby matatus, and watch live ETA updates as vehicles move.",
                }),
              ],
            }),
            (0, a.jsxs)("section", {
              className:
                "flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs md:flex-row md:items-center md:justify-between",
              children: [
                (0, a.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    (0, a.jsx)("div", {
                      className:
                        "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                      children: "Request a ride",
                    }),
                    (0, a.jsx)("p", {
                      className: "text-[11px] text-slate-300",
                      children:
                        "We will use your current location to find the closest available matatu.",
                    }),
                  ],
                }),
                (0, a.jsxs)("div", {
                  className: "flex flex-none items-center gap-2",
                  children: [
                    (0, a.jsxs)("span", {
                      className:
                        "rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300",
                      children: ["Status: ", R],
                    }),
                    (0, a.jsx)(s.Z, {}),
                    v &&
                      b &&
                      (0, a.jsx)("button", {
                        type: "button",
                        onClick: () => {
                          if (!e) {
                            t({
                              type: "system",
                              title: "Sign in required",
                              message:
                                "You need to be signed in to request a ride.",
                            });
                            return;
                          }
                          if (!v || !b) {
                            t({
                              type: "system",
                              title: "Smart requests disabled",
                              message:
                                "Smart auto-cancel requests are not enabled on this environment yet.",
                            });
                            return;
                          }
                          if (!navigator.geolocation) {
                            t({
                              type: "system",
                              title: "Location unavailable",
                              message:
                                "Geolocation is not available in this browser.",
                            });
                            return;
                          }
                          (A("Requesting"),
                            I(null),
                            navigator.geolocation.getCurrentPosition(
                              async (r) => {
                                try {
                                  let a = {
                                      lat: r.coords.latitude,
                                      lng: r.coords.longitude,
                                    },
                                    n = await x(
                                      { pickup: a, partySize: 1, meta: {} },
                                      e,
                                    );
                                  (k(n.id),
                                    j(a),
                                    A("Requested"),
                                    t({
                                      type: "trip",
                                      title: "Ride requested",
                                      message:
                                        "We are finding a nearby driver for you.",
                                    }));
                                } catch (r) {
                                  let e =
                                    r instanceof Error
                                      ? r.message
                                      : "Failed to request ride";
                                  (A("Idle"),
                                    k(null),
                                    I(null),
                                    t({
                                      type: "system",
                                      title: "Ride request failed",
                                      message: e,
                                    }));
                                }
                              },
                              (e) => {
                                let r =
                                  (null == e ? void 0 : e.message) ||
                                  "Unable to determine your current location.";
                                (A("Idle"),
                                  k(null),
                                  I(null),
                                  t({
                                    type: "system",
                                    title: "Location error",
                                    message: r,
                                  }));
                              },
                              { enableHighAccuracy: !0, timeout: 1e4 },
                            ));
                        },
                        className:
                          "rounded-md border border-emerald-600/60 bg-emerald-600/15 px-3 py-2 text-[11px] font-medium text-emerald-100 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-600/25",
                        children: "Smart request",
                      }),
                  ],
                }),
              ],
            }),
            E &&
              (0, a.jsx)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300",
                children: "Loading nearby matatus...",
              }),
            P &&
              !E &&
              (0, a.jsx)("div", {
                className:
                  "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                children: P,
              }),
            C &&
              !E &&
              (0, a.jsx)("div", {
                className:
                  "rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-[11px] text-amber-100",
                children: C,
              }),
            !E &&
              !P &&
              (0, a.jsxs)("section", {
                className:
                  "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                children: [
                  (0, a.jsx)("div", {
                    className: "flex items-center justify-between",
                    children: (0, a.jsxs)("div", {
                      children: [
                        (0, a.jsx)("h2", {
                          className: "text-sm font-semibold text-slate-100",
                          children: "Nearest matatus",
                        }),
                        (0, a.jsx)("p", {
                          className: "text-[11px] text-slate-400",
                          children:
                            "Based on your current location and live matatu positions.",
                        }),
                      ],
                    }),
                  }),
                  y &&
                    O &&
                    U.length > 0 &&
                    (0, a.jsx)(f, {
                      items: U,
                      onSelect: (e) => {
                        t({
                          type: "system",
                          title: "Matatu saved",
                          message:
                            "We highlighted this matatu in your nearby list.",
                        });
                      },
                    }),
                  !O &&
                    (0, a.jsx)("p", {
                      className: "text-[11px] text-slate-400",
                      children:
                        "There are no live matatus near you right now. Try again in a few minutes.",
                    }),
                  O &&
                    (0, a.jsx)("div", {
                      className:
                        "overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70",
                      children: (0, a.jsxs)("table", {
                        className: "min-w-full border-collapse text-[11px]",
                        children: [
                          (0, a.jsx)("thead", {
                            className: "bg-slate-900/80 text-slate-300",
                            children: (0, a.jsxs)("tr", {
                              children: [
                                (0, a.jsx)("th", {
                                  className: "px-3 py-2 text-left font-medium",
                                  children: "Matatu",
                                }),
                                (0, a.jsx)("th", {
                                  className: "px-3 py-2 text-left font-medium",
                                  children: "Route",
                                }),
                                (0, a.jsx)("th", {
                                  className: "px-3 py-2 text-right font-medium",
                                  children: "Distance",
                                }),
                                (0, a.jsx)("th", {
                                  className: "px-3 py-2 text-right font-medium",
                                  children: "ETA",
                                }),
                              ],
                            }),
                          }),
                          (0, a.jsx)("tbody", {
                            children: F.map((e) => {
                              var t;
                              let r = String(e.id || e._id || "-"),
                                n =
                                  null != e.etaMinutes
                                    ? Math.round(e.etaMinutes)
                                    : null,
                                s = e.distanceMeters / 1e3;
                              return (0, a.jsxs)(
                                "tr",
                                {
                                  className: "border-t border-slate-800/80",
                                  children: [
                                    (0, a.jsx)("td", {
                                      className: "px-3 py-2 text-slate-100",
                                      children:
                                        e.plate ||
                                        e.numberPlate ||
                                        r.slice(0, 6),
                                    }),
                                    (0, a.jsx)("td", {
                                      className: "px-3 py-2 text-slate-300",
                                      children:
                                        null !== (t = e.route) && void 0 !== t
                                          ? t
                                          : "—",
                                    }),
                                    (0, a.jsxs)("td", {
                                      className:
                                        "px-3 py-2 text-right text-slate-300",
                                      children: [s.toFixed(1), " km"],
                                    }),
                                    (0, a.jsx)("td", {
                                      className:
                                        "px-3 py-2 text-right text-slate-200",
                                      children:
                                        null !== n ? "".concat(n, " min") : "—",
                                    }),
                                  ],
                                },
                                r,
                              );
                            }),
                          }),
                        ],
                      }),
                    }),
                ],
              }),
          ],
        });
      }
    },
    3314: function (e, t, r) {
      "use strict";
      r.d(t, {
        Z: function () {
          return d;
        },
      });
      var a = r(7437),
        n = r(2265),
        s = r(3429),
        l = r(4876),
        i = r(7299),
        o = r(3551);
      function d() {
        let { token: e } = (0, s.a)(),
          { addNotification: t } = (0, l.z)(),
          [r, d] = (0, n.useState)(!1),
          { primaryButtonClass: u } = (0, o.F)();
        return (0, a.jsx)("button", {
          type: "button",
          onClick: () => {
            if (!e) {
              t({
                type: "system",
                title: "Sign in required",
                message: "You need to be signed in to request a ride.",
              });
              return;
            }
            if (!navigator.geolocation) {
              t({
                type: "system",
                title: "Location unavailable",
                message: "Geolocation is not available in this browser.",
              });
              return;
            }
            (d(!0),
              navigator.geolocation.getCurrentPosition(
                async (r) => {
                  try {
                    (await (0, i.jc)(
                      {
                        pickup: {
                          lat: r.coords.latitude,
                          lng: r.coords.longitude,
                        },
                      },
                      e,
                    ),
                      t({
                        type: "trip",
                        title: "Ride requested",
                        message: "We are finding a nearby driver for you.",
                      }));
                  } catch (e) {
                    t({
                      type: "system",
                      title: "Ride request failed",
                      message:
                        e instanceof Error
                          ? e.message
                          : "Failed to request ride",
                    });
                  } finally {
                    d(!1);
                  }
                },
                (e) => {
                  (t({
                    type: "system",
                    title: "Location error",
                    message:
                      (null == e ? void 0 : e.message) ||
                      "Unable to fetch current location.",
                  }),
                    d(!1));
                },
                { enableHighAccuracy: !0, timeout: 1e4 },
              ));
          },
          disabled: r,
          className: "".concat(
            u,
            " flex-none text-[11px] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60",
          ),
          children: r ? "Requesting ride..." : "Request a ride",
        });
      }
    },
    2858: function (e, t, r) {
      "use strict";
      r.d(t, {
        FeatureFlagProvider: function () {
          return i;
        },
        N3: function () {
          return o;
        },
      });
      var a = r(7437),
        n = r(2265),
        s = r(542);
      let l = (0, n.createContext)(void 0);
      function i(e) {
        let { children: t } = e,
          [r, i] = (0, n.useState)(null),
          [o, d] = (0, n.useState)(!0),
          [u, c] = (0, n.useState)(null);
        (0, n.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (d(!0), c(null));
              try {
                let t = await (0, s.BZ)();
                if (e) return;
                t && "object" == typeof t ? i(t) : i({});
              } catch (t) {
                if (e) return;
                (i({}),
                  c(
                    t instanceof Error
                      ? t.message
                      : "Failed to load feature flags",
                  ));
              } finally {
                e || d(!1);
              }
            })(),
            () => {
              e = !0;
            }
          );
        }, []);
        let m = (0, n.useMemo)(
          () => ({ flags: r, loading: o, error: u }),
          [r, o, u],
        );
        return (0, a.jsx)(l.Provider, { value: m, children: t });
      }
      function o(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: r, loading: a } = (function () {
            let e = (0, n.useContext)(l);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (a || !r) return t;
        let s = r[e];
        return !!s && !!s.enabled;
      }
    },
    3551: function (e, t, r) {
      "use strict";
      r.d(t, {
        F: function () {
          return d;
        },
        ThemeProvider: function () {
          return o;
        },
      });
      var a = r(7437),
        n = r(2265),
        s = r(3429),
        l = r(728);
      let i = (0, n.createContext)(void 0);
      function o(e) {
        let { children: t } = e,
          { user: r } = (0, s.a)(),
          { activeMode: o } = (0, l.r)(),
          d = null == r ? void 0 : r.role,
          u = (0, n.useMemo)(
            () =>
              "admin" === d
                ? "sacco"
                : "driver" === d && "driver" === o
                  ? "driver"
                  : d
                    ? "passenger"
                    : "generic",
            [d, o],
          ),
          c = (0, n.useMemo)(() => {
            let e = "passenger" === u || "generic" === u,
              t = "driver" === u,
              r = "sacco" === u;
            return {
              variant: u,
              isPassenger: e,
              isDriver: t,
              isSacco: r,
              headerBgClass: t
                ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-mint/20 via-radaa-teal/15 to-radaa-gold/10 backdrop-blur"
                : r
                  ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-gold/20 via-radaa-orange/15 to-radaa-mint/10 backdrop-blur"
                  : "border-b border-slate-800/70 bg-gradient-to-r from-radaa-blue/25 via-radaa-purple/20 to-radaa-mint/10 backdrop-blur",
              primaryButtonClass: t
                ? "radaa-btn-primary bg-gradient-to-r from-radaa-mint to-radaa-teal shadow-glow-mint"
                : r
                  ? "radaa-btn-primary bg-gradient-to-r from-radaa-gold to-radaa-orange shadow-glow-blue"
                  : "radaa-btn-primary bg-gradient-to-r from-radaa-blue to-radaa-purple shadow-glow-blue",
              subtleButtonClass: "radaa-btn-secondary",
              cardSurfaceClass: t
                ? "radaa-card border-radaa-mint/40"
                : r
                  ? "radaa-card border-radaa-gold/40"
                  : "radaa-card",
            };
          }, [u]);
        return (0, a.jsx)(i.Provider, { value: c, children: t });
      }
      function d() {
        let e = (0, n.useContext)(i);
        if (!e) throw Error("useTheme must be used within a ThemeProvider");
        return e;
      }
    },
    728: function (e, t, r) {
      "use strict";
      r.d(t, {
        RealtimeProvider: function () {
          return c;
        },
        r: function () {
          return m;
        },
      });
      var a = r(7437),
        n = r(2265),
        s = r(3901),
        l = r(4876),
        i = r(3429);
      let o = "radaa_active_mode";
      function d() {
        try {
          let e = window.localStorage.getItem(o);
          if ("driver" === e || "passenger" === e) return e;
        } catch (e) {
          console.error("[realtime] failed to read mode from storage", e);
        }
        return "passenger";
      }
      let u = (0, n.createContext)(void 0);
      function c(e) {
        let { children: t } = e,
          { connect: r, on: c, off: m, emit: g } = (0, s.s)(),
          { addNotification: f } = (0, l.z)(),
          { user: p, token: x } = (0, i.a)(),
          [h, v] = (0, n.useState)([]),
          [b, y] = (0, n.useState)(null),
          [w, j] = (0, n.useState)(() => d()),
          [N, S] = (0, n.useState)(() => "driver" === d());
        (0, n.useEffect)(() => {
          r(x);
          let e = (e) => {
              let t = Array.isArray(e) ? e : [e];
              v((e) => {
                let r = new Map();
                return (
                  e.forEach((e) => {
                    r.set(e.id, e);
                  }),
                  t.forEach((e) => {
                    if (!e || !e.id) return;
                    let t = r.get(e.id) || { id: e.id };
                    r.set(e.id, { ...t, ...e });
                  }),
                  Array.from(r.values())
                );
              });
            },
            t = (e) => {
              if (!e) return;
              y(e);
              let t = e.matatuPlate || e.matatuName || e.matatuNumberPlate;
              f({
                type: "trip",
                title: "New ride assigned",
                message: t
                  ? "A new ride was assigned to ".concat(t, ".")
                  : "A new ride was assigned.",
              });
            },
            a = (e) => {
              e &&
                f({
                  type: "trip",
                  title: "New ride created",
                  message: "A passenger just created a new ride request.",
                });
            },
            n = (e) => {
              f({
                type: "system",
                title: "SACCO stats updated",
                message: "Live SACCO metrics were updated.",
              });
            },
            s = (e) => {};
          return (
            c("matatus:live_update", e),
            c("matatu:live_update", e),
            c("ride:assigned", t),
            c("ride:created", a),
            c("sacco:update", n),
            c("passenger:live_update", s),
            () => {
              (m("matatus:live_update", e),
                m("matatu:live_update", e),
                m("ride:assigned", t),
                m("ride:created", a),
                m("sacco:update", n),
                m("passenger:live_update", s));
            }
          );
        }, [r, c, m, f, x]);
        let E = (0, n.useCallback)(
          (e) => {
            S(e);
            let t = e ? "driver" : "passenger";
            (j(t), g(e ? "driver:online" : "driver:offline", { online: e }));
            try {
              window.localStorage.setItem(o, t);
            } catch (e) {
              console.error("[realtime] failed to persist mode to storage", e);
            }
            console.log("[realtime] setDriverOnline", { online: e, mode: t });
          },
          [g],
        );
        (0, n.useEffect)(() => {
          if (!p) return;
          let e = null;
          try {
            e = window.localStorage.getItem(o);
          } catch (e) {
            console.error(
              "[realtime] failed to read mode from storage for role init",
              e,
            );
          }
          "driver" !== e &&
            "passenger" !== e &&
            ("driver" === (null == p ? void 0 : p.role) ? E(!0) : E(!1));
        }, [p, E]);
        let M = (0, n.useMemo)(
          () => ({
            matatus: h,
            lastRideAssigned: b,
            driverOnline: N,
            setDriverOnline: E,
            activeMode: w,
          }),
          [h, b, N, E, w],
        );
        return (0, a.jsx)(u.Provider, { value: M, children: t });
      }
      function m() {
        let e = (0, n.useContext)(u);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
      }
    },
    7299: function (e, t, r) {
      "use strict";
      r.d(t, {
        jc: function () {
          return s;
        },
        nW: function () {
          return i;
        },
        uZ: function () {
          return l;
        },
      });
      var a = r(542);
      async function n(e) {
        let t,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: n = "GET", body: s, token: l } = r,
          i = {};
        l && (i.Authorization = "Bearer ".concat(l));
        for (let r = 1; r <= 3; r += 1)
          try {
            let t = (
              await a.ZP.request({ url: e, method: n, data: s, headers: i })
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
          } catch (s) {
            var o, d, u;
            ((t = s),
              console.error(
                "API ERROR:",
                (null == s
                  ? void 0
                  : null === (o = s.response) || void 0 === o
                    ? void 0
                    : o.data) || s,
              ));
            let e =
                null == s
                  ? void 0
                  : null === (d = s.response) || void 0 === d
                    ? void 0
                    : d.status,
              a =
                null == s
                  ? void 0
                  : null === (u = s.response) || void 0 === u
                    ? void 0
                    : u.data,
              n =
                (a && "object" == typeof a && (a.message || a.error)) ||
                (null == s ? void 0 : s.message) ||
                "Request failed";
            if (e && e >= 500 && r < 3) {
              t = Error(n);
              continue;
            }
            throw Error(n);
          }
        throw t instanceof Error ? t : Error("Request failed");
      }
      async function s(e, t) {
        return n("/rides/request", { method: "POST", body: e, token: t });
      }
      async function l(e, t) {
        let r = new URLSearchParams();
        return (
          r.set("lat", String(e.lat)),
          r.set("lng", String(e.lng)),
          "number" == typeof e.radiusMeters &&
            r.set("radius", String(e.radiusMeters)),
          n("/rides/nearby?".concat(r.toString()), { method: "GET", token: t })
        );
      }
      async function i(e, t) {
        return n("/rides/".concat(e, "/accept"), { method: "POST", token: t });
      }
    },
  },
  function (e) {
    (e.O(0, [472, 40, 401, 971, 23, 744], function () {
      return e((e.s = 2330));
    }),
      (_N_E = e.O()));
  },
]);
