(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [883],
  {
    609: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 5197));
    },
    5197: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return x;
          },
        }));
      var l = a(7437),
        s = a(2265),
        r = a(3901),
        n = a(542),
        i = a(1710),
        o = a(728),
        d = a(2858);
      async function c(e) {
        let t,
          a =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: l = "GET", body: s } = a;
        for (let a = 1; a <= 3; a += 1)
          try {
            let t = (await n.ZP.request({ url: e, method: l, data: s })).data;
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
            var r, i, o;
            ((t = n),
              console.error(
                "API ERROR:",
                (null == n
                  ? void 0
                  : null === (r = n.response) || void 0 === r
                    ? void 0
                    : r.data) || n,
              ));
            let e =
                null == n
                  ? void 0
                  : null === (i = n.response) || void 0 === i
                    ? void 0
                    : i.status,
              l =
                null == n
                  ? void 0
                  : null === (o = n.response) || void 0 === o
                    ? void 0
                    : o.data,
              s =
                (l && "object" == typeof l && (l.message || l.error)) ||
                (null == n ? void 0 : n.message) ||
                "Request failed";
            if (e && e >= 500 && a < 3) {
              t = Error(s);
              continue;
            }
            throw Error(s);
          }
        throw t instanceof Error ? t : Error("Request failed");
      }
      async function u(e) {
        let t = e.trim();
        if (!t) return [];
        let a = new URLSearchParams();
        return (a.set("q", t), c("/search/route?".concat(a.toString())));
      }
      async function m(e, t) {
        let a = new URLSearchParams();
        "number" == typeof t && a.set("radius", String(t));
        let l = a.toString();
        return c(
          l
            ? "/routes/".concat(e, "/matatus?").concat(l)
            : "/routes/".concat(e, "/matatus"),
        );
      }
      function x() {
        let { connect: e, on: t, off: a } = (0, r.s)(),
          { driverOnline: c, setDriverOnline: x } = (0, o.r)(),
          p = (0, d.N3)("ui_revamp_v1", !1),
          [h, f] = (0, s.useState)([]),
          [g, v] = (0, s.useState)([]),
          [b, y] = (0, s.useState)(null),
          [j, N] = (0, s.useState)({}),
          [w, k] = (0, s.useState)(null),
          [M, S] = (0, s.useState)(null),
          [P, A] = (0, s.useState)(!0),
          [C, _] = (0, s.useState)(null),
          [L, E] = (0, s.useState)(""),
          [F, R] = (0, s.useState)([]),
          [U, T] = (0, s.useState)(!1),
          [I, O] = (0, s.useState)(null),
          [q, D] = (0, s.useState)([]),
          [Z, B] = (0, s.useState)(!1);
        ((0, s.useEffect)(() => {
          let l = !1;
          ((async () => {
            try {
              A(!0);
              let e = [];
              try {
                let t = await (0, n.Yf)();
                if (l) return;
                e = (Array.isArray(t) ? t : []).map((e) => {
                  var t, a, l, s, r, n, i;
                  return {
                    id: String(
                      null !==
                        (a = null !== (t = e.id) && void 0 !== t ? t : e._id) &&
                        void 0 !== a
                        ? a
                        : "",
                    ),
                    plate: e.plate,
                    numberPlate: e.numberPlate,
                    route: e.route,
                    sacco: null !== (l = e.sacco) && void 0 !== l ? l : void 0,
                    driverName:
                      null !== (s = e.driverName) && void 0 !== s ? s : void 0,
                    driverPhone:
                      null !== (r = e.driverPhone) && void 0 !== r ? r : void 0,
                    location:
                      null !== (n = e.location) && void 0 !== n ? n : null,
                    status: "online",
                    mainPhotoUrl:
                      null !== (i = e.mainPhotoUrl) && void 0 !== i ? i : null,
                    rating: e.rating,
                  };
                });
              } catch (a) {
                let t = await (0, n.Nj)();
                if (l) return;
                e = Array.isArray(t) ? t : [];
              }
              l || f(e);
            } catch (e) {
              if (l) return;
              f([]);
            } finally {
              l || A(!1);
            }
          })(),
            e(),
            console.log("[map] connect realtime for map page"));
          let s = (e) => {
              let t = Array.isArray(e) ? e : [e];
              (console.log("[map] matatus:live_update", { count: t.length }),
                f((e) => {
                  let a = new Map();
                  return (
                    e.forEach((e) => {
                      a.set(e.id, e);
                    }),
                    t.forEach((e) => {
                      if (!e || !e.id) return;
                      let t = a.get(e.id) || { id: e.id };
                      a.set(e.id, { ...t, ...e });
                    }),
                    Array.from(a.values())
                  );
                }));
            },
            r = (e) => {
              if (!e) return;
              let t =
                e.pickupLocation || e.location || e.passengerLocation || null;
              if (!t || "number" != typeof t.lat || "number" != typeof t.lng)
                return;
              let a = String(
                e.id ||
                  e.rideId ||
                  "".concat(t.lat, ",").concat(t.lng, ",").concat(Date.now()),
              );
              v((e) =>
                e.find((e) => e.id === a)
                  ? e
                  : [...e, { id: a, location: { lat: t.lat, lng: t.lng } }],
              );
            },
            i = (e) => {
              let t = Array.isArray(e) ? e : [e];
              (v((e) => {
                let a = new Map(e.map((e) => [e.id, e]));
                return (
                  t.forEach((e) => {
                    var t, l, s, r, n, i, o, d, c, u, m, x, p, h, f, g;
                    if (!e) return;
                    let v =
                        null !==
                          (c =
                            null !==
                              (d =
                                null !== (o = e.lat) && void 0 !== o
                                  ? o
                                  : null === (t = e.location) || void 0 === t
                                    ? void 0
                                    : t.lat) && void 0 !== d
                              ? d
                              : null === (l = e.pickupLocation) || void 0 === l
                                ? void 0
                                : l.lat) && void 0 !== c
                          ? c
                          : null === (s = e.passengerLocation) || void 0 === s
                            ? void 0
                            : s.lat,
                      b =
                        null !==
                          (x =
                            null !==
                              (m =
                                null !== (u = e.lng) && void 0 !== u
                                  ? u
                                  : null === (r = e.location) || void 0 === r
                                    ? void 0
                                    : r.lng) && void 0 !== m
                              ? m
                              : null === (n = e.pickupLocation) || void 0 === n
                                ? void 0
                                : n.lng) && void 0 !== x
                          ? x
                          : null === (i = e.passengerLocation) || void 0 === i
                            ? void 0
                            : i.lng,
                      y =
                        null !==
                          (g =
                            null !==
                              (f =
                                null !==
                                  (h =
                                    null !== (p = e.passengerId) && void 0 !== p
                                      ? p
                                      : e.id) && void 0 !== h
                                  ? h
                                  : e.rideId) && void 0 !== f
                              ? f
                              : e.requestId) && void 0 !== g
                          ? g
                          : null,
                      j = null != y ? String(y) : void 0;
                    if (j) {
                      if ("number" != typeof v || "number" != typeof b) {
                        a.delete(j);
                        return;
                      }
                      a.set(j, { id: j, location: { lat: v, lng: b } });
                    }
                  }),
                  Array.from(a.values())
                );
              }),
                console.log("[map] passenger:live_update", {
                  count: t.length,
                }));
            };
          return (
            t("matatus:live_update", s),
            t("ride:assigned", r),
            t("passenger:live_update", i),
            () => {
              ((l = !0),
                a("matatus:live_update", s),
                a("ride:assigned", r),
                a("passenger:live_update", i));
            }
          );
        }, [e, t, a]),
          (0, s.useEffect)(() => {
            if (!p) {
              R([]);
              return;
            }
            let e = L.trim();
            if (!e) {
              R([]);
              return;
            }
            let t = !1,
              a = window.setTimeout(async () => {
                try {
                  T(!0);
                  let a = await u(e);
                  if (t) return;
                  R(Array.isArray(a) ? a : []);
                } catch (e) {
                  if (t) return;
                  R([]);
                } finally {
                  t || T(!1);
                }
              }, 300);
            return () => {
              ((t = !0), window.clearTimeout(a));
            };
          }, [L, p]),
          (0, s.useEffect)(() => {
            if (!I) {
              D([]);
              return;
            }
            let e = !1;
            return (
              (async () => {
                try {
                  B(!0);
                  let t = await m(I._id, 150);
                  if (e) return;
                  let a = (Array.isArray(t) ? t : []).map((e) => {
                    let t =
                        e.location &&
                        "number" == typeof e.location.lat &&
                        "number" == typeof e.location.lng
                          ? { lat: e.location.lat, lng: e.location.lng }
                          : null,
                      a =
                        !t &&
                        e.lastLocation &&
                        Array.isArray(e.lastLocation.coordinates) &&
                        2 === e.lastLocation.coordinates.length
                          ? {
                              lat: e.lastLocation.coordinates[1],
                              lng: e.lastLocation.coordinates[0],
                            }
                          : null;
                    return {
                      id: String(e._id),
                      plate: e.plate,
                      route: e.route || I.name,
                      location: t || a || null,
                      status: e.status || (e.isOnline ? "online" : "offline"),
                    };
                  });
                  D(a);
                } catch (t) {
                  if (e) return;
                  D([]);
                } finally {
                  e || B(!1);
                }
              })(),
              () => {
                e = !0;
              }
            );
          }, [I]),
          (0, s.useEffect)(() => {
            let e;
            let t = () => {
              (N((e) => {
                let t = { ...e };
                return (
                  h.forEach((a) => {
                    var l;
                    if (!a.location) return;
                    let s =
                        null !== (l = e[a.id]) && void 0 !== l ? l : a.location,
                      r = a.location,
                      n = s.lat + (r.lat - s.lat) * 0.15,
                      i = s.lng + (r.lng - s.lng) * 0.15;
                    t[a.id] = { lat: n, lng: i };
                  }),
                  t
                );
              }),
                (e = window.requestAnimationFrame(t)));
            };
            return (
              (e = window.requestAnimationFrame(t)),
              () => {
                window.cancelAnimationFrame(e);
              }
            );
          }, [h]));
        let W = (0, s.useMemo)(() => {
            let e = [];
            if (
              (h.forEach((t) => {
                t.location &&
                  "number" == typeof t.location.lat &&
                  "number" == typeof t.location.lng &&
                  e.push(t.location);
              }),
              g.forEach((t) => {
                t.location &&
                  "number" == typeof t.location.lat &&
                  "number" == typeof t.location.lng &&
                  e.push(t.location);
              }),
              w && e.push(w),
              0 === e.length)
            )
              return null;
            let t = e[0].lat,
              a = e[0].lat,
              l = e[0].lng,
              s = e[0].lng;
            return (
              e.forEach((e) => {
                (e.lat < t && (t = e.lat),
                  e.lat > a && (a = e.lat),
                  e.lng < l && (l = e.lng),
                  e.lng > s && (s = e.lng));
              }),
              { minLat: t, maxLat: a, minLng: l, maxLng: s }
            );
          }, [h, g, w]),
          z = (0, s.useMemo)(() => null !== W, [W]),
          G = (0, s.useCallback)(
            (e) => {
              if (!e || !W) return { left: "50%", top: "50%" };
              let t = Math.max(W.maxLat - W.minLat, 1e-4),
                a = Math.max(W.maxLng - W.minLng, 1e-4),
                l = ((e.lng - W.minLng) / a) * 100,
                s = 100 - ((e.lat - W.minLat) / t) * 100;
              return {
                left: "".concat(Math.min(100, Math.max(0, l)), "%"),
                top: "".concat(Math.min(100, Math.max(0, s)), "%"),
              };
            },
            [W],
          ),
          H = (0, s.useMemo)(() => h.find((e) => e.id === b) || null, [h, b]),
          K = (0, s.useMemo)(() => {
            if (!H || !H.mainPhotoUrl) return null;
            let e = H.mainPhotoUrl;
            return e.startsWith("http")
              ? e
              : "".concat("https://radaa-1.onrender.com/api").concat(e);
          }, [H]),
          X = (0, s.useMemo)(() => {
            if (!I || 0 === q.length) return h;
            let e = new Map();
            return (
              h.forEach((t) => {
                e.set(t.id, t);
              }),
              q.map((t) => {
                let a = e.get(t.id) || null,
                  l = t.location || (null == a ? void 0 : a.location) || null;
                return { ...a, ...t, location: l };
              })
            );
          }, [h, q, I]),
          Y = (0, s.useMemo)(
            () => X.map((e) => ({ ...e, isTracked: null != C && e.id === C })),
            [X, C],
          ),
          J = (0, s.useMemo)(() => {
            if (!H || !H.location || !w) return null;
            let e = (function (e, t) {
              let a = ((t.lat - e.lat) * Math.PI) / 180,
                l = ((t.lng - e.lng) * Math.PI) / 180,
                s = (e.lat * Math.PI) / 180,
                r = (t.lat * Math.PI) / 180,
                n = Math.sin(a / 2),
                i = Math.sin(l / 2),
                o = n * n + Math.cos(s) * Math.cos(r) * i * i;
              return 2 * Math.atan2(Math.sqrt(o), Math.sqrt(1 - o)) * 6371e3;
            })(w, H.location);
            return { distanceMeters: e, etaMinutes: (e / 1e3 / 25) * 60 };
          }, [H, w]),
          Q = (0, s.useCallback)((e) => {
            y(e);
          }, []),
          V = () => {
            if (!navigator.geolocation) {
              S("Geolocation is not available in this browser.");
              return;
            }
            navigator.geolocation.getCurrentPosition(
              (e) => {
                (k({ lat: e.coords.latitude, lng: e.coords.longitude }),
                  S(null));
              },
              (e) => {
                S(e.message || "Unable to fetch location.");
              },
              { enableHighAccuracy: !0, timeout: 1e4 },
            );
          },
          $ = Y.length,
          ee = g.length;
        if (!p) {
          var et, ea, el, es;
          return (0, l.jsxs)("div", {
            className: "grid gap-4 md:grid-cols-[2fr,1fr]",
            children: [
              (0, l.jsxs)("div", {
                className:
                  "rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                children: [
                  (0, l.jsx)("h1", {
                    className: "text-lg font-semibold",
                    children: "Live Matatu Map",
                  }),
                  (0, l.jsx)("p", {
                    className: "mt-1 text-xs text-slate-300",
                    children:
                      "Live view of matatus and nearby passengers. Positions are updated in real time.",
                  }),
                  (0, l.jsxs)("div", {
                    className:
                      "mt-3 flex items-center justify-between text-[11px]",
                    children: [
                      (0, l.jsxs)("div", {
                        className:
                          "inline-flex rounded-md border border-slate-700 bg-slate-950/60 p-0.5",
                        children: [
                          (0, l.jsx)("button", {
                            type: "button",
                            onClick: () => x(!1),
                            className:
                              "rounded-sm px-2 py-0.5 text-[11px] ".concat(
                                c
                                  ? "text-slate-400 hover:text-slate-100"
                                  : "bg-slate-800 text-slate-100",
                              ),
                            children: "Passenger",
                          }),
                          (0, l.jsx)("button", {
                            type: "button",
                            onClick: () => x(!0),
                            className:
                              "ml-1 rounded-sm px-2 py-0.5 text-[11px] ".concat(
                                c
                                  ? "bg-emerald-600/70 text-emerald-50"
                                  : "text-slate-400 hover:text-slate-100",
                              ),
                            children: "Driver",
                          }),
                        ],
                      }),
                      (0, l.jsxs)("span", {
                        className: "text-[10px] text-slate-400",
                        children: ["Mode: ", c ? "Driver" : "Passenger"],
                      }),
                    ],
                  }),
                  (0, l.jsxs)("div", {
                    className: "mt-3 flex items-center gap-2 text-[11px]",
                    children: [
                      (0, l.jsx)("input", {
                        type: "text",
                        value: L,
                        onChange: (e) => {
                          (E(e.target.value), O(null));
                        },
                        className:
                          "w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                        placeholder: "Search routes, e.g. CBD – Westlands",
                      }),
                      U &&
                        (0, l.jsx)("span", {
                          className: "text-[10px] text-slate-400",
                          children: "Searching…",
                        }),
                    ],
                  }),
                  F.length > 0 &&
                    (0, l.jsx)("div", {
                      className: "mt-2 flex flex-wrap gap-1 text-[10px]",
                      children: F.map((e) =>
                        (0, l.jsx)(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              (O(e), E(e.name));
                            },
                            className:
                              "rounded-full border px-2 py-0.5 transition ".concat(
                                I && I._id === e._id
                                  ? "border-sky-500 bg-sky-500/10 text-sky-200"
                                  : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500",
                              ),
                            children: e.name,
                          },
                          e._id,
                        ),
                      ),
                    }),
                  (0, l.jsx)(i.Z, {
                    matatus: Y,
                    passengers: g,
                    userLocation: w,
                    displayPositions: j,
                    project: G,
                    onCenterOnMe: V,
                    onSelectMatatu: Q,
                    isLoading: P,
                    hasAnyLocation: z,
                    driverMode: c,
                  }),
                  M &&
                    (0, l.jsx)("p", {
                      className: "mt-2 text-[11px] text-amber-300",
                      children: M,
                    }),
                ],
              }),
              (0, l.jsxs)("aside", {
                className:
                  "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4",
                children: [
                  (0, l.jsx)("h2", {
                    className: "text-base font-semibold",
                    children: "Matatu details",
                  }),
                  H
                    ? (0, l.jsxs)("div", {
                        className: "space-y-2 text-xs text-slate-200",
                        children: [
                          K &&
                            (0, l.jsx)("div", {
                              className:
                                "overflow-hidden rounded-md border border-slate-800",
                              children: (0, l.jsx)("img", {
                                src: K,
                                alt: "Matatu photo",
                                className: "h-28 w-full object-cover",
                              }),
                            }),
                          (0, l.jsxs)("div", {
                            children: [
                              (0, l.jsx)("span", {
                                className: "text-slate-400",
                                children: "Plate: ",
                              }),
                              H.plate || H.numberPlate || "Unknown",
                            ],
                          }),
                          (0, l.jsxs)("div", {
                            children: [
                              (0, l.jsx)("span", {
                                className: "text-slate-400",
                                children: "Route: ",
                              }),
                              H.route || "—",
                            ],
                          }),
                          H.driverName &&
                            (0, l.jsxs)("div", {
                              className: "flex items-center gap-2",
                              children: [
                                (0, l.jsx)("div", {
                                  className:
                                    "flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100",
                                  children: H.driverName
                                    .charAt(0)
                                    .toUpperCase(),
                                }),
                                (0, l.jsxs)("div", {
                                  children: [
                                    (0, l.jsx)("span", {
                                      className: "text-slate-400",
                                      children: "Driver: ",
                                    }),
                                    H.driverName,
                                    H.driverPhone &&
                                      (0, l.jsxs)("span", {
                                        className: "text-slate-500",
                                        children: [" \xb7 ", H.driverPhone],
                                      }),
                                  ],
                                }),
                              ],
                            }),
                          H.sacco &&
                            (0, l.jsxs)("div", {
                              children: [
                                (0, l.jsx)("span", {
                                  className: "text-slate-400",
                                  children: "SACCO: ",
                                }),
                                H.sacco,
                              ],
                            }),
                          H.rating &&
                            (0, l.jsxs)("div", {
                              children: [
                                (0, l.jsx)("span", {
                                  className: "text-slate-400",
                                  children: "Rating: ",
                                }),
                                H.rating.avgRating.toFixed(1),
                                " ★ (",
                                H.rating.count,
                                ")",
                              ],
                            }),
                          (0, l.jsxs)("div", {
                            children: [
                              (0, l.jsx)("span", {
                                className: "text-slate-400",
                                children: "Lat: ",
                              }),
                              null !==
                                (el =
                                  null === (et = H.location) || void 0 === et
                                    ? void 0
                                    : et.lat) && void 0 !== el
                                ? el
                                : "—",
                            ],
                          }),
                          (0, l.jsxs)("div", {
                            children: [
                              (0, l.jsx)("span", {
                                className: "text-slate-400",
                                children: "Lng: ",
                              }),
                              null !==
                                (es =
                                  null === (ea = H.location) || void 0 === ea
                                    ? void 0
                                    : ea.lng) && void 0 !== es
                                ? es
                                : "—",
                            ],
                          }),
                          J &&
                            (0, l.jsxs)(l.Fragment, {
                              children: [
                                (0, l.jsxs)("div", {
                                  children: [
                                    (0, l.jsx)("span", {
                                      className: "text-slate-400",
                                      children: "Distance from you: ",
                                    }),
                                    (J.distanceMeters / 1e3).toFixed(1),
                                    " km",
                                  ],
                                }),
                                (0, l.jsxs)("div", {
                                  children: [
                                    (0, l.jsx)("span", {
                                      className: "text-slate-400",
                                      children: "ETA (25 km/h): ",
                                    }),
                                    Math.round(J.etaMinutes),
                                    " min",
                                  ],
                                }),
                              ],
                            }),
                          (0, l.jsx)("button", {
                            type: "button",
                            onClick: () =>
                              _((e) => (H ? (e === H.id ? null : H.id) : e)),
                            className:
                              "mt-2 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500",
                            children:
                              C === H.id
                                ? "Stop tracking"
                                : "Track this matatu",
                          }),
                        ],
                      })
                    : (0, l.jsx)("p", {
                        className: "text-xs text-slate-400",
                        children: "Select a matatu marker on the map.",
                      }),
                ],
              }),
            ],
          });
        }
        return (0, l.jsxs)("div", {
          className: "space-y-4",
          children: [
            (0, l.jsxs)("header", {
              className:
                "flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between",
              children: [
                (0, l.jsxs)("div", {
                  children: [
                    (0, l.jsx)("h1", {
                      className: "text-lg font-semibold",
                      children: "Live Matatu Map",
                    }),
                    (0, l.jsx)("p", {
                      className: "text-xs text-slate-300",
                      children:
                        "See matatus moving in real time and tap a card below to track your ride.",
                    }),
                  ],
                }),
                (0, l.jsxs)("div", {
                  className:
                    "mt-2 flex flex-col items-stretch gap-2 text-[10px] text-slate-400 md:mt-0 md:flex-row md:items-center",
                  children: [
                    (0, l.jsxs)("div", {
                      className: "flex items-center gap-2",
                      children: [
                        (0, l.jsxs)("span", {
                          className:
                            "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300",
                          children: [
                            (0, l.jsx)("span", {
                              className:
                                "mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400",
                            }),
                            "Live now",
                          ],
                        }),
                        (0, l.jsxs)("span", {
                          children: [$, " matatus \xb7 ", ee, " nearby riders"],
                        }),
                      ],
                    }),
                    (0, l.jsxs)("div", {
                      className: "flex items-center gap-2 md:min-w-[240px]",
                      children: [
                        (0, l.jsx)("input", {
                          type: "text",
                          value: L,
                          onChange: (e) => {
                            (E(e.target.value), O(null));
                          },
                          className:
                            "w-full rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[10px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                          placeholder: "Filter by route…",
                        }),
                        U &&
                          (0, l.jsx)("span", {
                            className: "text-[10px] text-slate-400",
                            children: "Searching…",
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, l.jsxs)("section", {
              className:
                "relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950",
              children: [
                (0, l.jsx)("div", {
                  className: "p-4 pb-3",
                  children: (0, l.jsx)(i.Z, {
                    matatus: Y,
                    passengers: g,
                    userLocation: w,
                    displayPositions: j,
                    project: G,
                    onCenterOnMe: V,
                    onSelectMatatu: Q,
                    isLoading: P,
                    hasAnyLocation: z,
                    driverMode: c,
                  }),
                }),
                (0, l.jsx)("div", {
                  className:
                    "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent",
                }),
              ],
            }),
            (0, l.jsxs)("section", {
              className:
                "space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4",
              children: [
                (0, l.jsxs)("div", {
                  className: "flex items-center justify-between gap-2",
                  children: [
                    (0, l.jsxs)("div", {
                      children: [
                        (0, l.jsx)("h2", {
                          className: "text-sm font-semibold",
                          children: "Matatus on this map",
                        }),
                        (0, l.jsx)("p", {
                          className: "text-[11px] text-slate-400",
                          children:
                            "Tap a card to focus the marker and start tracking it.",
                        }),
                      ],
                    }),
                    J &&
                      (0, l.jsxs)("div", {
                        className:
                          "rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[10px] text-slate-200",
                        children: ["~", Math.round(J.etaMinutes), " min away"],
                      }),
                    F.length > 0 &&
                      (0, l.jsx)("div", {
                        className: "mt-2 flex flex-wrap gap-1",
                        children: F.map((e) =>
                          (0, l.jsx)(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                (O(e), E(e.name));
                              },
                              className:
                                "rounded-full border px-2 py-0.5 text-[10px] transition ".concat(
                                  I && I._id === e._id
                                    ? "border-sky-500 bg-sky-500/10 text-sky-200"
                                    : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500",
                                ),
                              children: e.name,
                            },
                            e._id,
                          ),
                        ),
                      }),
                  ],
                }),
                (0, l.jsxs)("div", {
                  className: "grid gap-3 md:grid-cols-2",
                  children: [
                    Y.map((e) => {
                      let t = H && H.id === e.id,
                        a = C && C === e.id;
                      return (0, l.jsxs)(
                        "button",
                        {
                          type: "button",
                          onClick: () => y(e.id),
                          className:
                            "flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ".concat(
                              t || a
                                ? "border-sky-500 bg-sky-500/10"
                                : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900",
                            ),
                          children: [
                            (0, l.jsxs)("div", {
                              children: [
                                (0, l.jsxs)("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    (0, l.jsx)("span", {
                                      className: "text-[11px] font-semibold",
                                      children:
                                        e.plate ||
                                        e.numberPlate ||
                                        "Unknown plate",
                                    }),
                                    e.route &&
                                      (0, l.jsx)("span", {
                                        className:
                                          "rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-200",
                                        children: e.route,
                                      }),
                                  ],
                                }),
                                e.sacco &&
                                  (0, l.jsx)("p", {
                                    className:
                                      "mt-0.5 text-[10px] text-slate-400",
                                    children: e.sacco,
                                  }),
                                e.rating &&
                                  e.rating.count > 0 &&
                                  (0, l.jsxs)("p", {
                                    className:
                                      "mt-0.5 text-[10px] text-amber-300",
                                    children: [
                                      e.rating.avgRating.toFixed(1),
                                      " ★ \xb7 ",
                                      e.rating.count,
                                      " rides rated",
                                    ],
                                  }),
                              ],
                            }),
                            (0, l.jsxs)("div", {
                              className: "flex flex-col items-end gap-1",
                              children: [
                                (0, l.jsx)("span", {
                                  className: "text-[10px] text-slate-400",
                                  children: e.location ? "Online" : "Offline",
                                }),
                                e.isTracked &&
                                  (0, l.jsx)("span", {
                                    className:
                                      "rounded-full bg-sky-500/10 px-2 py-0.5 text-[9px] text-sky-300",
                                    children: "Tracking",
                                  }),
                              ],
                            }),
                          ],
                        },
                        e.id,
                      );
                    }),
                    0 === Y.length &&
                      (0, l.jsx)("p", {
                        className: "col-span-full text-[11px] text-slate-500",
                        children:
                          "No matatus are online yet. They'll appear here once they come online.",
                      }),
                  ],
                }),
                H &&
                  (0, l.jsxs)("div", {
                    className:
                      "mt-3 grid gap-3 md:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]",
                    children: [
                      (0, l.jsxs)("div", {
                        className: "space-y-2 text-xs text-slate-200",
                        children: [
                          K &&
                            (0, l.jsx)("div", {
                              className:
                                "overflow-hidden rounded-md border border-slate-800",
                              children: (0, l.jsx)("img", {
                                src: K,
                                alt: "Matatu photo",
                                className: "h-32 w-full object-cover",
                              }),
                            }),
                          (0, l.jsxs)("div", {
                            children: [
                              (0, l.jsx)("span", {
                                className: "text-slate-400",
                                children: "Plate: ",
                              }),
                              H.plate || H.numberPlate || "Unknown",
                            ],
                          }),
                          (0, l.jsxs)("div", {
                            children: [
                              (0, l.jsx)("span", {
                                className: "text-slate-400",
                                children: "Route: ",
                              }),
                              H.route || "—",
                            ],
                          }),
                          H.driverName &&
                            (0, l.jsxs)("div", {
                              className: "flex items-center gap-2",
                              children: [
                                (0, l.jsx)("div", {
                                  className:
                                    "flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100",
                                  children: H.driverName
                                    .charAt(0)
                                    .toUpperCase(),
                                }),
                                (0, l.jsxs)("div", {
                                  children: [
                                    (0, l.jsx)("span", {
                                      className: "text-slate-400",
                                      children: "Driver: ",
                                    }),
                                    H.driverName,
                                    H.driverPhone &&
                                      (0, l.jsxs)("span", {
                                        className: "text-slate-500",
                                        children: [" \xb7 ", H.driverPhone],
                                      }),
                                  ],
                                }),
                              ],
                            }),
                          H.sacco &&
                            (0, l.jsxs)("div", {
                              children: [
                                (0, l.jsx)("span", {
                                  className: "text-slate-400",
                                  children: "SACCO: ",
                                }),
                                H.sacco,
                              ],
                            }),
                          H.rating &&
                            (0, l.jsxs)("div", {
                              children: [
                                (0, l.jsx)("span", {
                                  className: "text-slate-400",
                                  children: "Rating: ",
                                }),
                                H.rating.avgRating.toFixed(1),
                                " ★ (",
                                H.rating.count,
                                ")",
                              ],
                            }),
                        ],
                      }),
                      (0, l.jsxs)("div", {
                        className: "space-y-2 text-[11px] text-slate-300",
                        children: [
                          J &&
                            (0, l.jsxs)(l.Fragment, {
                              children: [
                                (0, l.jsxs)("div", {
                                  children: [
                                    (0, l.jsx)("span", {
                                      className: "text-slate-400",
                                      children: "Distance from you: ",
                                    }),
                                    (J.distanceMeters / 1e3).toFixed(1),
                                    " km",
                                  ],
                                }),
                                (0, l.jsxs)("div", {
                                  children: [
                                    (0, l.jsx)("span", {
                                      className: "text-slate-400",
                                      children: "ETA (25 km/h): ",
                                    }),
                                    Math.round(J.etaMinutes),
                                    " min",
                                  ],
                                }),
                              ],
                            }),
                          (0, l.jsx)("button", {
                            type: "button",
                            onClick: () =>
                              _((e) => (H ? (e === H.id ? null : H.id) : e)),
                            className:
                              "mt-1 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500",
                            children:
                              C === H.id
                                ? "Stop tracking"
                                : "Track this matatu",
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
            M &&
              (0, l.jsx)("p", {
                className: "text-[11px] text-amber-300",
                children: M,
              }),
          ],
        });
      }
    },
    1710: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return d;
        },
      });
      var l = a(7437),
        s = a(2265),
        r = a(2858),
        n = a(357),
        i = function (e) {
          let { matatu: t, status: a, style: i, onSelect: o } = e,
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
            c = (0, r.N3)("map_photos_v1", !1),
            u = (0, s.useMemo)(() => {
              if (!c || !t.mainPhotoUrl) return null;
              let e = t.mainPhotoUrl;
              if (e.startsWith("http")) return e;
              let a = n.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
              return "".concat(a).concat(e);
            }, [c, t.mainPhotoUrl]);
          return (0, l.jsxs)("button", {
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
                })(a),
              ),
            style: i,
            "aria-label": d,
            children: [
              u &&
                (0, l.jsx)("span", {
                  className:
                    "mr-1 inline-block h-4 w-4 overflow-hidden rounded-full border border-slate-900 bg-slate-900",
                  "aria-hidden": "true",
                  children: (0, l.jsx)("img", {
                    src: u,
                    alt: "",
                    className: "h-full w-full object-cover",
                  }),
                }),
              (0, l.jsx)("span", { "aria-hidden": "true", children: d }),
            ],
          });
        },
        o = function (e) {
          let { style: t } = e;
          return (0, l.jsx)("div", {
            className:
              "absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow",
            style: t,
          });
        };
      function d(e) {
        let {
            matatus: t,
            passengers: a,
            userLocation: s,
            displayPositions: r,
            project: n,
            onCenterOnMe: d,
            onSelectMatatu: c,
            isLoading: u,
            hasAnyLocation: m,
            driverMode: x,
            showCenterOnMe: p = !0,
          } = e,
          h = !u && !m;
        return (0, l.jsxs)("div", {
          className:
            "relative mt-4 h-80 overflow-hidden rounded-lg bg-slate-950",
          children: [
            u &&
              (0, l.jsx)("div", {
                className:
                  "absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900",
                children: (0, l.jsx)("div", {
                  className:
                    "absolute inset-4 rounded-lg border border-slate-800/60",
                }),
              }),
            !u &&
              h &&
              (0, l.jsx)("div", {
                className:
                  "flex h-full items-center justify-center text-xs text-slate-500",
                children: "Waiting for live location data...",
              }),
            !u &&
              !h &&
              (0, l.jsxs)(l.Fragment, {
                children: [
                  t.map((e) => {
                    var t, a;
                    let s =
                      null !==
                        (a =
                          null !== (t = r[e.id]) && void 0 !== t
                            ? t
                            : e.location) && void 0 !== a
                        ? a
                        : null;
                    if (!s) return null;
                    let o = n(s),
                      d =
                        x || e.isTracked
                          ? "driver"
                          : e.location
                            ? "online"
                            : "offline";
                    return (0, l.jsx)(
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
                  a.map((e) => {
                    let t = n(e.location);
                    return (0, l.jsx)(o, { style: t }, e.id);
                  }),
                  s &&
                    (0, l.jsx)("div", {
                      className:
                        "absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-500 shadow-lg",
                      style: n(s),
                    }),
                ],
              }),
            p &&
              (0, l.jsx)("button", {
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
    2858: function (e, t, a) {
      "use strict";
      a.d(t, {
        FeatureFlagProvider: function () {
          return i;
        },
        N3: function () {
          return o;
        },
      });
      var l = a(7437),
        s = a(2265),
        r = a(542);
      let n = (0, s.createContext)(void 0);
      function i(e) {
        let { children: t } = e,
          [a, i] = (0, s.useState)(null),
          [o, d] = (0, s.useState)(!0),
          [c, u] = (0, s.useState)(null);
        (0, s.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (d(!0), u(null));
              try {
                let t = await (0, r.BZ)();
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
          () => ({ flags: a, loading: o, error: c }),
          [a, o, c],
        );
        return (0, l.jsx)(n.Provider, { value: m, children: t });
      }
      function o(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: a, loading: l } = (function () {
            let e = (0, s.useContext)(n);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (l || !a) return t;
        let r = a[e];
        return !!r && !!r.enabled;
      }
    },
    728: function (e, t, a) {
      "use strict";
      a.d(t, {
        RealtimeProvider: function () {
          return u;
        },
        r: function () {
          return m;
        },
      });
      var l = a(7437),
        s = a(2265),
        r = a(3901),
        n = a(4876),
        i = a(3429);
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
          { connect: a, on: u, off: m, emit: x } = (0, r.s)(),
          { addNotification: p } = (0, n.z)(),
          { user: h, token: f } = (0, i.a)(),
          [g, v] = (0, s.useState)([]),
          [b, y] = (0, s.useState)(null),
          [j, N] = (0, s.useState)(() => d()),
          [w, k] = (0, s.useState)(() => "driver" === d());
        (0, s.useEffect)(() => {
          a(f);
          let e = (e) => {
              let t = Array.isArray(e) ? e : [e];
              v((e) => {
                let a = new Map();
                return (
                  e.forEach((e) => {
                    a.set(e.id, e);
                  }),
                  t.forEach((e) => {
                    if (!e || !e.id) return;
                    let t = a.get(e.id) || { id: e.id };
                    a.set(e.id, { ...t, ...e });
                  }),
                  Array.from(a.values())
                );
              });
            },
            t = (e) => {
              if (!e) return;
              y(e);
              let t = e.matatuPlate || e.matatuName || e.matatuNumberPlate;
              p({
                type: "trip",
                title: "New ride assigned",
                message: t
                  ? "A new ride was assigned to ".concat(t, ".")
                  : "A new ride was assigned.",
              });
            },
            l = (e) => {
              e &&
                p({
                  type: "trip",
                  title: "New ride created",
                  message: "A passenger just created a new ride request.",
                });
            },
            s = (e) => {
              p({
                type: "system",
                title: "SACCO stats updated",
                message: "Live SACCO metrics were updated.",
              });
            },
            r = (e) => {};
          return (
            u("matatus:live_update", e),
            u("matatu:live_update", e),
            u("ride:assigned", t),
            u("ride:created", l),
            u("sacco:update", s),
            u("passenger:live_update", r),
            () => {
              (m("matatus:live_update", e),
                m("matatu:live_update", e),
                m("ride:assigned", t),
                m("ride:created", l),
                m("sacco:update", s),
                m("passenger:live_update", r));
            }
          );
        }, [a, u, m, p, f]);
        let M = (0, s.useCallback)(
          (e) => {
            k(e);
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
          if (!h) return;
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
            ("driver" === (null == h ? void 0 : h.role) ? M(!0) : M(!1));
        }, [h, M]);
        let S = (0, s.useMemo)(
          () => ({
            matatus: g,
            lastRideAssigned: b,
            driverOnline: w,
            setDriverOnline: M,
            activeMode: j,
          }),
          [g, b, w, M, j],
        );
        return (0, l.jsx)(c.Provider, { value: S, children: t });
      }
      function m() {
        let e = (0, s.useContext)(c);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
      }
    },
  },
  function (e) {
    (e.O(0, [472, 40, 401, 971, 23, 744], function () {
      return e((e.s = 609));
    }),
      (_N_E = e.O()));
  },
]);
