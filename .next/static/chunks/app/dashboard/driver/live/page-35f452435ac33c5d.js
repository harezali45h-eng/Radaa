(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [605],
  {
    8882: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 8837));
    },
    8837: function (e, t, r) {
      "use strict";
      (r.r(t),
        r.d(t, {
          default: function () {
            return f;
          },
        }));
      var a = r(7437),
        s = r(2265),
        n = r(3429),
        l = r(4876),
        i = r(3901),
        o = r(728),
        d = r(7299),
        c = r(542);
      async function u(e) {
        let t,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: a = "GET", body: s, token: n } = r,
          l = {};
        n && (l.Authorization = "Bearer ".concat(n));
        for (let r = 1; r <= 3; r += 1)
          try {
            let t = (
              await c.ZP.request({ url: e, method: a, data: s, headers: l })
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
            var i, o, d;
            ((t = n),
              console.error(
                "API ERROR:",
                (null == n
                  ? void 0
                  : null === (i = n.response) || void 0 === i
                    ? void 0
                    : i.data) || n,
              ));
            let e =
                null == n
                  ? void 0
                  : null === (o = n.response) || void 0 === o
                    ? void 0
                    : o.status,
              a =
                null == n
                  ? void 0
                  : null === (d = n.response) || void 0 === d
                    ? void 0
                    : d.data,
              s =
                (a && "object" == typeof a && (a.message || a.error)) ||
                (null == n ? void 0 : n.message) ||
                "Request failed";
            if (e && e >= 500 && r < 3) {
              t = Error(s);
              continue;
            }
            throw Error(s);
          }
        throw t instanceof Error ? t : Error("Request failed");
      }
      async function m(e) {
        let t = await u("/rides/driver/assigned", {
          method: "GET",
          token: null != e ? e : null,
        });
        return Array.isArray(t) ? t : [];
      }
      var x = r(2858),
        h = r(1710);
      function f() {
        let { user: e, token: t, loading: r } = (0, n.a)(),
          { addNotification: c } = (0, l.z)(),
          { on: u, off: f, emit: p } = (0, i.s)(),
          { driverOnline: g, setDriverOnline: v } = (0, o.r)(),
          b = "driver" === (null == e ? void 0 : e.role),
          y = (0, x.N3)("driver_onboard_v1", !1),
          [j, N] = (0, s.useState)(null),
          [w, A] = (0, s.useState)([]),
          [S, E] = (0, s.useState)([]),
          [_, M] = (0, s.useState)(!0),
          [P, k] = (0, s.useState)(!0),
          [q, C] = (0, s.useState)(null);
        ((0, s.useEffect)(() => {
          if (!t || !b) {
            (M(!1),
              k(!1),
              t ||
                C("You need to be signed in as a driver to view this page."));
            return;
          }
          if (!navigator.geolocation) {
            (M(!1), C("Geolocation is not available in this browser."));
            return;
          }
          let e = !1,
            r = null;
          return (
            (r = navigator.geolocation.watchPosition(
              (t) => {
                if (e) return;
                let r = { lat: t.coords.latitude, lng: t.coords.longitude };
                (N(r), p("driver:update_location", { lat: r.lat, lng: r.lng }));
              },
              (t) => {
                e ||
                  (M(!1),
                  C(t.message || "Unable to determine your current location."));
              },
              { enableHighAccuracy: !0, maximumAge: 5e3, timeout: 1e4 },
            )),
            () => {
              ((e = !0),
                null != r &&
                  navigator.geolocation &&
                  navigator.geolocation.clearWatch(r));
            }
          );
        }, [t, p, b]),
          (0, s.useEffect)(() => {
            if (!t || !j || !b) return;
            let e = !1;
            return (
              (async () => {
                (M(!0), C(null));
                try {
                  let r = await (0, d.uZ)({ lat: j.lat, lng: j.lng }, t);
                  if (e) return;
                  A(Array.isArray(r) ? r : []);
                } catch (t) {
                  if (e) return;
                  C(
                    t instanceof Error
                      ? t.message
                      : "Failed to load nearby requests",
                  );
                } finally {
                  e || M(!1);
                }
              })(),
              () => {
                e = !0;
              }
            );
          }, [t, j, b]),
          (0, s.useEffect)(() => {
            if (!t || !b) return;
            let e = !1;
            return (
              (async () => {
                k(!0);
                try {
                  let r = await m(t);
                  if (e) return;
                  E(Array.isArray(r) ? r : []);
                } catch (t) {
                  if (e) return;
                } finally {
                  e || k(!1);
                }
              })(),
              () => {
                e = !0;
              }
            );
          }, [t, b]),
          (0, s.useEffect)(() => {
            if (!b) return;
            let e = (e) => {
                if (!e) return;
                let t =
                  (null == e ? void 0 : e.id) || (null == e ? void 0 : e._id);
                (A((r) =>
                  r.some((e) => e._id === t || e.id === t)
                    ? r
                    : [
                        { ...e, _id: (null == e ? void 0 : e._id) || t || "" },
                        ...r,
                      ],
                ),
                  c({
                    type: "trip",
                    title: "New nearby ride request",
                    message: "A passenger near you has requested a ride.",
                  }));
              },
              t = (e) => {
                let t =
                  (null == e ? void 0 : e.id) || (null == e ? void 0 : e._id);
                t &&
                  (A((e) => e.filter((e) => e._id !== t && e.id !== t)),
                  E((e) => e.filter((e) => e._id !== t && e.id !== t)),
                  c({
                    type: "trip",
                    title: "Ride cancelled",
                    message: "A ride in your area was cancelled.",
                  }));
              },
              r = (e) => {
                var t;
                if (!e) return;
                let r = null !== (t = e.id) && void 0 !== t ? t : e.rideId;
                if (!r) return;
                let a = String(r);
                E((t) =>
                  t.map((t) =>
                    t._id === a || t.id === a ? { ...t, ...e } : t,
                  ),
                );
              };
            return (
              u("ride:created", e),
              u("ride:cancelled", t),
              u("passenger:update", r),
              () => {
                (f("ride:created", e),
                  f("ride:cancelled", t),
                  f("passenger:update", r));
              }
            );
          }, [u, f, c, b]));
        let R = async (e) => {
            if (!t) {
              c({
                type: "system",
                title: "Sign in required",
                message:
                  "You need to be signed in as a driver to accept rides.",
              });
              return;
            }
            try {
              (await (0, d.nW)(e, t),
                A((t) => t.filter((t) => t._id !== e && t.id !== e)),
                c({
                  type: "trip",
                  title: "Ride accepted",
                  message:
                    "The passenger has been notified of your acceptance.",
                }));
              let r = await m(t);
              E(Array.isArray(r) ? r : []);
            } catch (e) {
              c({
                type: "system",
                title: "Could not accept ride",
                message:
                  e instanceof Error ? e.message : "Failed to accept ride",
              });
            }
          },
          L = w.length > 0,
          F = S.length > 0,
          I = (0, s.useMemo)(
            () =>
              w
                .map((e) => {
                  let t = e.pickup;
                  if (
                    !t ||
                    !Array.isArray(t.coordinates) ||
                    2 !== t.coordinates.length
                  )
                    return null;
                  let [r, a] = t.coordinates;
                  return "number" != typeof a || "number" != typeof r
                    ? null
                    : {
                        id: String(
                          e._id || e.id || "".concat(a, ",").concat(r),
                        ),
                        location: { lat: a, lng: r },
                      };
                })
                .filter(Boolean),
            [w],
          ),
          O = (0, s.useMemo)(() => {
            let e = [];
            if (
              (j && e.push(j),
              I.forEach((t) => {
                t.location &&
                  "number" == typeof t.location.lat &&
                  "number" == typeof t.location.lng &&
                  e.push(t.location);
              }),
              0 === e.length)
            )
              return null;
            let t = e[0].lat,
              r = e[0].lat,
              a = e[0].lng,
              s = e[0].lng;
            return (
              e.forEach((e) => {
                (e.lat < t && (t = e.lat),
                  e.lat > r && (r = e.lat),
                  e.lng < a && (a = e.lng),
                  e.lng > s && (s = e.lng));
              }),
              { minLat: t, maxLat: r, minLng: a, maxLng: s }
            );
          }, [j, I]),
          T = (0, s.useMemo)(() => null !== O, [O]);
        return !r && e && b
          ? (0, a.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, a.jsxs)("header", {
                  className: "space-y-1",
                  children: [
                    (0, a.jsx)("h1", {
                      className: "text-2xl font-semibold tracking-tight",
                      children: "Driver live dashboard",
                    }),
                    (0, a.jsx)("p", {
                      className: "text-xs text-slate-300",
                      children:
                        "Watch incoming ride requests in real time and manage your currently assigned passengers.",
                    }),
                    y &&
                      (0, a.jsxs)("div", {
                        className:
                          "mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-600/60 bg-emerald-600/10 px-3 py-1 text-[10px] text-emerald-100",
                        children: [
                          (0, a.jsx)("span", {
                            className: g
                              ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                              : "h-1.5 w-1.5 rounded-full bg-slate-500",
                          }),
                          (0, a.jsx)("span", {
                            children: g
                              ? "You're visible to nearby riders"
                              : "Go online to start seeing ride requests",
                          }),
                        ],
                      }),
                  ],
                }),
                (0, a.jsxs)("section", {
                  className:
                    "flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs",
                  children: [
                    (0, a.jsxs)("div", {
                      className: "space-y-1",
                      children: [
                        (0, a.jsx)("div", {
                          className:
                            "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                          children: "Driver status",
                        }),
                        (0, a.jsxs)("div", {
                          className: "text-[11px] text-slate-300",
                          children: [
                            "You are currently",
                            " ",
                            (0, a.jsx)("span", {
                              className: g
                                ? "text-emerald-400"
                                : "text-slate-100",
                              children: g ? "Online" : "Offline",
                            }),
                            ". When online, nearby passengers can see and request you.",
                          ],
                        }),
                      ],
                    }),
                    (0, a.jsx)("button", {
                      type: "button",
                      onClick: () => v(!g),
                      className:
                        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium transition ".concat(
                          g
                            ? "bg-emerald-600/80 text-emerald-50 hover:bg-emerald-500/80"
                            : "bg-slate-800 text-slate-100 hover:bg-slate-700",
                        ),
                      children: g ? "Go offline" : "Go online",
                    }),
                  ],
                }),
                (0, a.jsxs)("section", {
                  className:
                    "rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs",
                  children: [
                    (0, a.jsx)("div", {
                      className: "mb-2 flex items-center justify-between",
                      children: (0, a.jsxs)("div", {
                        children: [
                          (0, a.jsx)("div", {
                            className:
                              "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                            children: "Nearby passenger map",
                          }),
                          (0, a.jsx)("p", {
                            className: "text-[11px] text-slate-400",
                            children:
                              "Live preview of requests around your current location.",
                          }),
                        ],
                      }),
                    }),
                    (0, a.jsx)(h.Z, {
                      matatus: [],
                      passengers: I,
                      userLocation: j,
                      displayPositions: {},
                      project: (e) => {
                        if (!e || !O) return { left: "50%", top: "50%" };
                        let t = Math.max(O.maxLat - O.minLat, 1e-4),
                          r = Math.max(O.maxLng - O.minLng, 1e-4),
                          a = ((e.lng - O.minLng) / r) * 100,
                          s = 100 - ((e.lat - O.minLat) / t) * 100;
                        return {
                          left: "".concat(Math.min(100, Math.max(0, a)), "%"),
                          top: "".concat(Math.min(100, Math.max(0, s)), "%"),
                        };
                      },
                      onCenterOnMe: () => {
                        navigator.geolocation &&
                          navigator.geolocation.getCurrentPosition(
                            (e) => {
                              N({
                                lat: e.coords.latitude,
                                lng: e.coords.longitude,
                              });
                            },
                            () => {},
                            { enableHighAccuracy: !0, timeout: 1e4 },
                          );
                      },
                      onSelectMatatu: () => {},
                      isLoading: _,
                      hasAnyLocation: T,
                      driverMode: !0,
                    }),
                  ],
                }),
                q &&
                  (0, a.jsx)("div", {
                    className:
                      "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200",
                    children: q,
                  }),
                (0, a.jsxs)("section", {
                  className: "grid gap-4 md:grid-cols-2",
                  children: [
                    (0, a.jsxs)("div", {
                      className:
                        "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                      children: [
                        (0, a.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, a.jsxs)("div", {
                              children: [
                                (0, a.jsx)("h2", {
                                  className:
                                    "text-sm font-semibold text-slate-100",
                                  children: "Incoming requests",
                                }),
                                (0, a.jsx)("p", {
                                  className: "text-[11px] text-slate-400",
                                  children:
                                    "New ride requests near your current location will appear here.",
                                }),
                              ],
                            }),
                            (0, a.jsx)("span", {
                              className:
                                "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200",
                              children: L ? w.length : 0,
                            }),
                          ],
                        }),
                        _ &&
                          (0, a.jsx)("div", {
                            className:
                              "h-20 animate-pulse rounded-md bg-slate-800/60",
                          }),
                        !_ &&
                          !L &&
                          !q &&
                          (0, a.jsx)("p", {
                            className: "text-[11px] text-slate-400",
                            children:
                              "No nearby ride requests right now. When passengers request rides near you, they will appear here.",
                          }),
                        !_ &&
                          L &&
                          (0, a.jsx)("div", {
                            className:
                              "overflow-hidden rounded-md border border-slate-800 bg-slate-950/80",
                            children: (0, a.jsxs)("table", {
                              className:
                                "min-w-full border-collapse text-[11px]",
                              children: [
                                (0, a.jsx)("thead", {
                                  className: "bg-slate-900/80 text-slate-300",
                                  children: (0, a.jsxs)("tr", {
                                    children: [
                                      (0, a.jsx)("th", {
                                        className:
                                          "px-3 py-2 text-left font-medium",
                                        children: "Pickup",
                                      }),
                                      (0, a.jsx)("th", {
                                        className:
                                          "px-3 py-2 text-left font-medium",
                                        children: "Requested at",
                                      }),
                                      (0, a.jsx)("th", {
                                        className:
                                          "px-3 py-2 text-left font-medium",
                                        children: "Distance",
                                      }),
                                      (0, a.jsx)("th", {
                                        className:
                                          "px-3 py-2 text-right font-medium",
                                        children: "Actions",
                                      }),
                                    ],
                                  }),
                                }),
                                (0, a.jsx)("tbody", {
                                  children: w.map((e) => {
                                    let t = e._id || e.id || "",
                                      r = e.createdAt
                                        ? new Date(e.createdAt)
                                        : null,
                                      s = e.pickup,
                                      n = "—";
                                    if (
                                      s &&
                                      Array.isArray(s.coordinates) &&
                                      2 === s.coordinates.length
                                    ) {
                                      let [e, t] = s.coordinates;
                                      n = ""
                                        .concat(t.toFixed(4), ", ")
                                        .concat(e.toFixed(4));
                                    }
                                    let l = "—";
                                    if (
                                      j &&
                                      s &&
                                      Array.isArray(s.coordinates) &&
                                      2 === s.coordinates.length
                                    ) {
                                      let [e, t] = s.coordinates,
                                        r = (function (e, t) {
                                          let r =
                                              ((t.lat - e.lat) * Math.PI) / 180,
                                            a =
                                              ((t.lng - e.lng) * Math.PI) / 180,
                                            s = (e.lat * Math.PI) / 180,
                                            n = (t.lat * Math.PI) / 180,
                                            l = Math.sin(r / 2),
                                            i = Math.sin(a / 2),
                                            o =
                                              l * l +
                                              Math.cos(s) * Math.cos(n) * i * i;
                                          return (
                                            2 *
                                            Math.atan2(
                                              Math.sqrt(o),
                                              Math.sqrt(1 - o),
                                            ) *
                                            6371e3
                                          );
                                        })(j, { lat: t, lng: e });
                                      Number.isFinite(r) &&
                                        (l = ""
                                          .concat(
                                            (r / 1e3).toFixed(1),
                                            " km \xb7 ~",
                                          )
                                          .concat(
                                            Math.round((r / 1e3 / 25) * 60),
                                            " min",
                                          ));
                                    }
                                    return (0, a.jsxs)(
                                      "tr",
                                      {
                                        className:
                                          "border-t border-slate-800/80",
                                        children: [
                                          (0, a.jsx)("td", {
                                            className:
                                              "px-3 py-2 text-slate-100",
                                            children: n,
                                          }),
                                          (0, a.jsx)("td", {
                                            className:
                                              "px-3 py-2 text-slate-300",
                                            children: r
                                              ? r.toLocaleString()
                                              : "Just now",
                                          }),
                                          (0, a.jsx)("td", {
                                            className:
                                              "px-3 py-2 text-slate-300",
                                            children: l,
                                          }),
                                          (0, a.jsx)("td", {
                                            className: "px-3 py-2 text-right",
                                            children: (0, a.jsx)("button", {
                                              type: "button",
                                              onClick: () => R(String(t)),
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
                    }),
                    (0, a.jsxs)("div", {
                      className:
                        "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                      children: [
                        (0, a.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, a.jsxs)("div", {
                              children: [
                                (0, a.jsx)("h2", {
                                  className:
                                    "text-sm font-semibold text-slate-100",
                                  children: "Assigned passengers",
                                }),
                                (0, a.jsx)("p", {
                                  className: "text-[11px] text-slate-400",
                                  children:
                                    "A summary of rides that are currently assigned to you.",
                                }),
                              ],
                            }),
                            (0, a.jsx)("span", {
                              className:
                                "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200",
                              children: F ? S.length : 0,
                            }),
                          ],
                        }),
                        P &&
                          (0, a.jsx)("div", {
                            className:
                              "h-20 animate-pulse rounded-md bg-slate-800/60",
                          }),
                        !P &&
                          !F &&
                          (0, a.jsx)("p", {
                            className: "text-[11px] text-slate-400",
                            children:
                              "You have no active assigned passengers. Accepted rides will show up here.",
                          }),
                        !P &&
                          F &&
                          (0, a.jsx)("div", {
                            className: "space-y-2",
                            children: S.map((e) => {
                              let t = e._id || e.id || "",
                                r = e.createdAt ? new Date(e.createdAt) : null;
                              return (0, a.jsx)(
                                "div",
                                {
                                  className:
                                    "flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/80 px-3 py-2",
                                  children: (0, a.jsxs)("div", {
                                    className:
                                      "space-y-0.5 text-[11px] text-slate-200",
                                    children: [
                                      (0, a.jsxs)("div", {
                                        className: "font-semibold",
                                        children: [
                                          "Ride ",
                                          String(t).slice(0, 6),
                                        ],
                                      }),
                                      (0, a.jsxs)("div", {
                                        className: "text-slate-400",
                                        children: [
                                          "Status: ",
                                          (0, a.jsx)("span", {
                                            className: "text-emerald-300",
                                            children: e.status,
                                          }),
                                        ],
                                      }),
                                      r &&
                                        (0, a.jsxs)("div", {
                                          className: "text-slate-400",
                                          children: [
                                            "Requested at: ",
                                            r.toLocaleString(),
                                          ],
                                        }),
                                    ],
                                  }),
                                },
                                t,
                              );
                            }),
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          : (0, a.jsx)("div", {
              className: "space-y-4",
              children: (0, a.jsxs)("header", {
                className: "space-y-1",
                children: [
                  (0, a.jsx)("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "Driver live dashboard",
                  }),
                  (0, a.jsx)("p", {
                    className: "text-xs text-slate-300",
                    children:
                      "You must be signed in as a driver to view this dashboard.",
                  }),
                ],
              }),
            });
      }
    },
    1710: function (e, t, r) {
      "use strict";
      r.d(t, {
        Z: function () {
          return d;
        },
      });
      var a = r(7437),
        s = r(2265),
        n = r(2858),
        l = r(357),
        i = function (e) {
          let { matatu: t, status: r, style: i, onSelect: o } = e,
            d = (function (e) {
              if (!e) return "Matatu";
              if (e.plate && e.plate.trim().length > 0) return e.plate.trim();
              if (e.numberPlate && e.numberPlate.trim().length > 0)
                return e.numberPlate.trim();
              if (e.route && e.route.trim().length > 0) return e.route.trim();
              if (e.sacco && e.sacco.trim().length > 0) return e.sacco.trim();
              let t = e.id || e._id;
              return t ? String(t).slice(0, 6) : "Matatu";
            })(t),
            c = (0, n.N3)("map_photos_v1", !1),
            u = (0, s.useMemo)(() => {
              if (!c || !t.mainPhotoUrl) return null;
              let e = t.mainPhotoUrl;
              if (e.startsWith("http")) return e;
              let r = l.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
              return "".concat(r).concat(e);
            }, [c, t.mainPhotoUrl]);
          return (0, a.jsxs)("button", {
            type: "button",
            onClick: o,
            className:
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold shadow ".concat(
                (function (e) {
                  switch (e) {
                    case "driver":
                      return "bg-sky-400 text-slate-950 border-sky-300";
                    case "online":
                      return "bg-emerald-400 text-slate-950 border-emerald-300";
                    default:
                      return "bg-slate-600 text-slate-50 border-slate-400";
                  }
                })(r),
              ),
            style: i,
            "aria-label": d,
            children: [
              u &&
                (0, a.jsx)("span", {
                  className:
                    "mr-1 inline-block h-4 w-4 overflow-hidden rounded-full border border-slate-900 bg-slate-900",
                  "aria-hidden": "true",
                  children: (0, a.jsx)("img", {
                    src: u,
                    alt: "",
                    className: "h-full w-full object-cover",
                  }),
                }),
              (0, a.jsx)("span", { "aria-hidden": "true", children: d }),
            ],
          });
        },
        o = function (e) {
          let { style: t } = e;
          return (0, a.jsx)("div", {
            className:
              "absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow",
            style: t,
          });
        };
      function d(e) {
        let {
            matatus: t,
            passengers: r,
            userLocation: s,
            displayPositions: n,
            project: l,
            onCenterOnMe: d,
            onSelectMatatu: c,
            isLoading: u,
            hasAnyLocation: m,
            driverMode: x,
            showCenterOnMe: h = !0,
          } = e,
          f = !u && !m;
        return (0, a.jsxs)("div", {
          className:
            "relative mt-4 h-80 overflow-hidden rounded-lg bg-slate-950",
          children: [
            u &&
              (0, a.jsx)("div", {
                className:
                  "absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900",
                children: (0, a.jsx)("div", {
                  className:
                    "absolute inset-4 rounded-lg border border-slate-800/60",
                }),
              }),
            !u &&
              f &&
              (0, a.jsx)("div", {
                className:
                  "flex h-full items-center justify-center text-xs text-slate-500",
                children: "Waiting for live location data...",
              }),
            !u &&
              !f &&
              (0, a.jsxs)(a.Fragment, {
                children: [
                  t.map((e) => {
                    var t, r;
                    let s =
                      null !==
                        (r =
                          null !== (t = n[e.id]) && void 0 !== t
                            ? t
                            : e.location) && void 0 !== r
                        ? r
                        : null;
                    if (!s) return null;
                    let o = l(s),
                      d =
                        x || e.isTracked
                          ? "driver"
                          : e.location
                            ? "online"
                            : "offline";
                    return (0, a.jsx)(
                      i,
                      {
                        matatu: e,
                        status: d,
                        style: o,
                        onSelect: () => c(e.id),
                      },
                      e.id,
                    );
                  }),
                  r.map((e) => {
                    let t = l(e.location);
                    return (0, a.jsx)(o, { style: t }, e.id);
                  }),
                  s &&
                    (0, a.jsx)("div", {
                      className:
                        "absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-500 shadow-lg",
                      style: l(s),
                    }),
                ],
              }),
            h &&
              (0, a.jsx)("button", {
                type: "button",
                onClick: d,
                className:
                  "absolute bottom-3 right-3 z-10 inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/20 px-2.5 py-1 text-[10px] font-medium text-sky-100 shadow hover:border-sky-400 hover:bg-sky-600/30",
                children: "Center on me",
              }),
          ],
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
        s = r(2265),
        n = r(542);
      let l = (0, s.createContext)(void 0);
      function i(e) {
        let { children: t } = e,
          [r, i] = (0, s.useState)(null),
          [o, d] = (0, s.useState)(!0),
          [c, u] = (0, s.useState)(null);
        (0, s.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (d(!0), u(null));
              try {
                let t = await (0, n.BZ)();
                if (e) return;
                t && "object" == typeof t ? i(t) : i({});
              } catch (t) {
                if (e) return;
                (i({}),
                  u(
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
        let m = (0, s.useMemo)(
          () => ({ flags: r, loading: o, error: c }),
          [r, o, c],
        );
        return (0, a.jsx)(l.Provider, { value: m, children: t });
      }
      function o(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: r, loading: a } = (function () {
            let e = (0, s.useContext)(l);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (a || !r) return t;
        let n = r[e];
        return !!n && !!n.enabled;
      }
    },
    728: function (e, t, r) {
      "use strict";
      r.d(t, {
        RealtimeProvider: function () {
          return u;
        },
        r: function () {
          return m;
        },
      });
      var a = r(7437),
        s = r(2265),
        n = r(3901),
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
      let c = (0, s.createContext)(void 0);
      function u(e) {
        let { children: t } = e,
          { connect: r, on: u, off: m, emit: x } = (0, n.s)(),
          { addNotification: h } = (0, l.z)(),
          { user: f, token: p } = (0, i.a)(),
          [g, v] = (0, s.useState)([]),
          [b, y] = (0, s.useState)(null),
          [j, N] = (0, s.useState)(() => d()),
          [w, A] = (0, s.useState)(() => "driver" === d());
        (0, s.useEffect)(() => {
          r(p);
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
              h({
                type: "trip",
                title: "New ride assigned",
                message: t
                  ? "A new ride was assigned to ".concat(t, ".")
                  : "A new ride was assigned.",
              });
            },
            a = (e) => {
              e &&
                h({
                  type: "trip",
                  title: "New ride created",
                  message: "A passenger just created a new ride request.",
                });
            },
            s = (e) => {
              h({
                type: "system",
                title: "SACCO stats updated",
                message: "Live SACCO metrics were updated.",
              });
            },
            n = (e) => {};
          return (
            u("matatus:live_update", e),
            u("matatu:live_update", e),
            u("ride:assigned", t),
            u("ride:created", a),
            u("sacco:update", s),
            u("passenger:live_update", n),
            () => {
              (m("matatus:live_update", e),
                m("matatu:live_update", e),
                m("ride:assigned", t),
                m("ride:created", a),
                m("sacco:update", s),
                m("passenger:live_update", n));
            }
          );
        }, [r, u, m, h, p]);
        let S = (0, s.useCallback)(
          (e) => {
            A(e);
            let t = e ? "driver" : "passenger";
            (N(t), x(e ? "driver:online" : "driver:offline", { online: e }));
            try {
              window.localStorage.setItem(o, t);
            } catch (e) {
              console.error("[realtime] failed to persist mode to storage", e);
            }
            console.log("[realtime] setDriverOnline", { online: e, mode: t });
          },
          [x],
        );
        (0, s.useEffect)(() => {
          if (!f) return;
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
            ("driver" === (null == f ? void 0 : f.role) ? S(!0) : S(!1));
        }, [f, S]);
        let E = (0, s.useMemo)(
          () => ({
            matatus: g,
            lastRideAssigned: b,
            driverOnline: w,
            setDriverOnline: S,
            activeMode: j,
          }),
          [g, b, w, S, j],
        );
        return (0, a.jsx)(c.Provider, { value: E, children: t });
      }
      function m() {
        let e = (0, s.useContext)(c);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
      }
    },
    7299: function (e, t, r) {
      "use strict";
      r.d(t, {
        jc: function () {
          return n;
        },
        nW: function () {
          return i;
        },
        uZ: function () {
          return l;
        },
      });
      var a = r(542);
      async function s(e) {
        let t,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: s = "GET", body: n, token: l } = r,
          i = {};
        l && (i.Authorization = "Bearer ".concat(l));
        for (let r = 1; r <= 3; r += 1)
          try {
            let t = (
              await a.ZP.request({ url: e, method: s, data: n, headers: i })
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
            var o, d, c;
            ((t = n),
              console.error(
                "API ERROR:",
                (null == n
                  ? void 0
                  : null === (o = n.response) || void 0 === o
                    ? void 0
                    : o.data) || n,
              ));
            let e =
                null == n
                  ? void 0
                  : null === (d = n.response) || void 0 === d
                    ? void 0
                    : d.status,
              a =
                null == n
                  ? void 0
                  : null === (c = n.response) || void 0 === c
                    ? void 0
                    : c.data,
              s =
                (a && "object" == typeof a && (a.message || a.error)) ||
                (null == n ? void 0 : n.message) ||
                "Request failed";
            if (e && e >= 500 && r < 3) {
              t = Error(s);
              continue;
            }
            throw Error(s);
          }
        throw t instanceof Error ? t : Error("Request failed");
      }
      async function n(e, t) {
        return s("/rides/request", { method: "POST", body: e, token: t });
      }
      async function l(e, t) {
        let r = new URLSearchParams();
        return (
          r.set("lat", String(e.lat)),
          r.set("lng", String(e.lng)),
          "number" == typeof e.radiusMeters &&
            r.set("radius", String(e.radiusMeters)),
          s("/rides/nearby?".concat(r.toString()), { method: "GET", token: t })
        );
      }
      async function i(e, t) {
        return s("/rides/".concat(e, "/accept"), { method: "POST", token: t });
      }
    },
  },
  function (e) {
    (e.O(0, [472, 40, 401, 971, 23, 744], function () {
      return e((e.s = 8882));
    }),
      (_N_E = e.O()));
  },
]);
