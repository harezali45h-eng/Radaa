(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [601],
  {
    118: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 926));
    },
    926: function (e, t, a) {
      "use strict";
      (a.r(t),
        a.d(t, {
          default: function () {
            return c;
          },
        }));
      var r = a(7437),
        s = a(2265),
        l = a(3429),
        n = a(9284),
        i = a(2858),
        d = a(728),
        o = a(3551);
      function c() {
        var e, t, a, c;
        let { user: u, token: x } = (0, l.a)(),
          m = null == u ? void 0 : u._id,
          p =
            null == u
              ? void 0
              : null === (e = u.saccoProfile) || void 0 === e
                ? void 0
                : e.saccoName,
          [h, f] = (0, s.useState)(null),
          [v, g] = (0, s.useState)([]),
          [b, y] = (0, s.useState)([]),
          [j, N] = (0, s.useState)(!0),
          [w, C] = (0, s.useState)(null),
          [S, _] = (0, s.useState)("permit"),
          [k, A] = (0, s.useState)(null),
          [E, P] = (0, s.useState)(!1),
          { matatus: M } = (0, d.r)(),
          [O, F] = (0, s.useState)(null),
          T = (null == u ? void 0 : u.role) === "admin";
        (0, i.N3)("sacco_onboard_v1", !1);
        let { cardSurfaceClass: R } = (0, o.F)();
        (0, s.useEffect)(() => {
          if (!m || !x || !T) {
            N(!1);
            return;
          }
          let e = !1;
          return (
            (async () => {
              (N(!0), C(null));
              try {
                let [t, a, r] = await Promise.all([
                  (0, n.EK)(m, x),
                  (0, n.IY)(m, x),
                  (0, n.jZ)(m, {}, x),
                ]);
                if (e) return;
                (f(t), g(a), y(r));
              } catch (t) {
                if (e) return;
                C(t instanceof Error ? t.message : "Failed to load SACCO data");
              } finally {
                e || N(!1);
              }
            })(),
            () => {
              e = !0;
            }
          );
        }, [m, x, T]);
        let L = (0, s.useMemo)(
            () => v.filter((e) => "pending" === e.driverVerificationStatus),
            [v],
          ),
          I = (0, s.useMemo)(
            () => b.filter((e) => "pending" === e.approvalStatus),
            [b],
          ),
          D = (0, s.useMemo)(() => {
            if (!Array.isArray(b) || 0 === b.length) return [];
            let e = new Map(b.map((e) => [e._id, e])),
              t = new Map();
            return (
              b.forEach((e) => {
                e.driver && t.set(String(e.driver), e);
              }),
              M.map((a) => {
                var r;
                let s;
                let l = a.id,
                  n = a.matatuId || void 0,
                  i = a.driverId || void 0;
                return (n && e.has(n)
                  ? (s = e.get(n))
                  : l && e.has(l)
                    ? (s = e.get(l))
                    : i && t.has(i) && (s = t.get(i)),
                s)
                  ? {
                      id: s._id,
                      plate: s.plate || s.numberPlate || a.plate,
                      numberPlate: s.numberPlate || a.numberPlate,
                      route: s.route || a.route,
                      location:
                        null !== (r = a.location) && void 0 !== r ? r : null,
                      status: a.status,
                    }
                  : null;
              }).filter(Boolean)
            );
          }, [b, M]),
          U = (0, s.useMemo)(() => {
            let e = [];
            if (
              (D.forEach((t) => {
                let a = t.location;
                a &&
                  "number" == typeof a.lat &&
                  "number" == typeof a.lng &&
                  e.push(a);
              }),
              0 === e.length)
            )
              return null;
            let t = e[0].lat,
              a = e[0].lat,
              r = e[0].lng,
              s = e[0].lng;
            return (
              e.forEach((e) => {
                (e.lat < t && (t = e.lat),
                  e.lat > a && (a = e.lat),
                  e.lng < r && (r = e.lng),
                  e.lng > s && (s = e.lng));
              }),
              { minLat: t, maxLat: a, minLng: r, maxLng: s }
            );
          }, [D]);
        ((0, s.useMemo)(() => null !== U, [U]),
          (0, s.useCallback)(
            (e) => {
              if (!e || !U) return { left: "50%", top: "50%" };
              let t = Math.max(U.maxLat - U.minLat, 1e-4),
                a = Math.max(U.maxLng - U.minLng, 1e-4),
                r = ((e.lng - U.minLng) / a) * 100,
                s = 100 - ((e.lat - U.minLat) / t) * 100;
              return {
                left: "".concat(Math.min(100, Math.max(0, r)), "%"),
                top: "".concat(Math.min(100, Math.max(0, s)), "%"),
              };
            },
            [U],
          ),
          (0, s.useMemo)(
            () =>
              D.reduce((e, t) => (t.location && (e[t.id] = t.location), e), {}),
            [D],
          ));
        let V = async (e) => {
            if ((e.preventDefault(), m && x && k)) {
              P(!0);
              try {
                await (0, n.o)(m, S, k, x);
              } catch (e) {
                C(e instanceof Error ? e.message : "Document upload failed");
              } finally {
                P(!1);
              }
            }
          },
          B = async (e, t) => {
            if (m && x)
              try {
                let a = await (0, n.Vh)(m, e, t, x);
                g((e) => e.map((e) => (e._id === a._id ? a : e)));
              } catch (e) {
                C(e instanceof Error ? e.message : "Unable to update driver");
              }
          },
          G = async (e, t) => {
            if (m && x)
              try {
                let a = await (0, n.v7)(m, e, t, x);
                g((e) => e.map((e) => (e._id === a._id ? a : e)));
              } catch (e) {
                C(e instanceof Error ? e.message : "Unable to update driver");
              }
          },
          Y = async (e, t) => {
            if (m && x)
              try {
                let a = await (0, n.yb)(m, e, t, x);
                y((e) => e.map((e) => (e._id === a._id ? a : e)));
              } catch (e) {
                C(e instanceof Error ? e.message : "Unable to update matatu");
              }
          };
        return T
          ? (0, r.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, r.jsxs)("header", {
                  className: "space-y-1",
                  children: [
                    (0, r.jsx)("h1", {
                      className: "text-2xl font-semibold tracking-tight",
                      children: "SACCO dashboard",
                    }),
                    (0, r.jsx)("p", {
                      className: "text-xs text-slate-300",
                      children:
                        "High-level overview of your SACCO performance, drivers, and fleet.",
                    }),
                    p &&
                      (0, r.jsxs)("p", {
                        className: "text-[11px] text-slate-400",
                        children: ["Managing: ", p],
                      }),
                  ],
                }),
                w &&
                  (0, r.jsx)("div", {
                    className:
                      "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200",
                    children: w,
                  }),
                (0, r.jsxs)("section", {
                  className: "grid gap-3 md:grid-cols-3",
                  children: [
                    (0, r.jsxs)("div", {
                      className: "".concat(R, " p-4 text-xs"),
                      children: [
                        (0, r.jsx)("div", {
                          className:
                            "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                          children: "Active matatus",
                        }),
                        (0, r.jsx)("div", {
                          className:
                            "mt-2 text-2xl font-semibold text-slate-50",
                          children:
                            null !==
                              (t = null == h ? void 0 : h.activeMatatus) &&
                            void 0 !== t
                              ? t
                              : j
                                ? "…"
                                : 0,
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className: "".concat(R, " p-4 text-xs"),
                      children: [
                        (0, r.jsx)("div", {
                          className:
                            "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                          children: "Active trips",
                        }),
                        (0, r.jsx)("div", {
                          className:
                            "mt-2 text-2xl font-semibold text-slate-50",
                          children:
                            null !== (a = null == h ? void 0 : h.activeTrips) &&
                            void 0 !== a
                              ? a
                              : j
                                ? "…"
                                : 0,
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className:
                        "rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                      children: [
                        (0, r.jsx)("div", {
                          className:
                            "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                          children: "Completed last hour",
                        }),
                        (0, r.jsx)("div", {
                          className:
                            "mt-2 text-2xl font-semibold text-slate-50",
                          children:
                            null !==
                              (c =
                                null == h
                                  ? void 0
                                  : h.completedTripsLastHour) && void 0 !== c
                              ? c
                              : j
                                ? "…"
                                : 0,
                        }),
                      ],
                    }),
                  ],
                }),
                (0, r.jsxs)("section", {
                  className: "grid gap-4 md:grid-cols-[2fr,1.2fr]",
                  children: [
                    (0, r.jsxs)("div", {
                      className: "space-y-3 ".concat(R, " p-4 text-xs"),
                      children: [
                        (0, r.jsx)("div", {
                          className: "flex items-center justify-between",
                          children: (0, r.jsxs)("div", {
                            children: [
                              (0, r.jsx)("h2", {
                                className:
                                  "text-sm font-semibold text-slate-100",
                                children: "Drivers",
                              }),
                              (0, r.jsx)("p", {
                                className: "text-[11px] text-slate-400",
                                children:
                                  "Manage your drivers, status and access.",
                              }),
                            ],
                          }),
                        }),
                        (0, r.jsx)("div", {
                          className:
                            "overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70",
                          children: (0, r.jsxs)("table", {
                            className: "min-w-full border-collapse text-[11px]",
                            children: [
                              (0, r.jsx)("thead", {
                                className: "bg-slate-900/80 text-slate-300",
                                children: (0, r.jsxs)("tr", {
                                  children: [
                                    (0, r.jsx)("th", {
                                      className:
                                        "px-3 py-2 text-left font-medium",
                                      children: "Driver",
                                    }),
                                    (0, r.jsx)("th", {
                                      className:
                                        "px-3 py-2 text-left font-medium",
                                      children: "Vehicle",
                                    }),
                                    (0, r.jsx)("th", {
                                      className:
                                        "px-3 py-2 text-left font-medium",
                                      children: "Verification",
                                    }),
                                    (0, r.jsx)("th", {
                                      className:
                                        "px-3 py-2 text-left font-medium",
                                      children: "Enabled",
                                    }),
                                    (0, r.jsx)("th", {
                                      className:
                                        "px-3 py-2 text-right font-medium",
                                      children: "Actions",
                                    }),
                                  ],
                                }),
                              }),
                              (0, r.jsx)("tbody", {
                                children: v.map((e) => {
                                  var t, a, s;
                                  return (0, r.jsxs)(
                                    "tr",
                                    {
                                      className: "border-t border-slate-800/80",
                                      children: [
                                        (0, r.jsx)("td", {
                                          className: "px-3 py-2 text-slate-100",
                                          children: (0, r.jsxs)("div", {
                                            className: "flex flex-col",
                                            children: [
                                              (0, r.jsx)("span", {
                                                className: "font-medium",
                                                children: e.username,
                                              }),
                                              (0, r.jsx)("span", {
                                                className:
                                                  "text-[10px] text-slate-400",
                                                children: e.email,
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, r.jsx)("td", {
                                          className: "px-3 py-2 text-slate-300",
                                          children:
                                            null !==
                                              (a =
                                                null ===
                                                  (t = e.driverProfile) ||
                                                void 0 === t
                                                  ? void 0
                                                  : t.vehicleRegistration) &&
                                            void 0 !== a
                                              ? a
                                              : "—",
                                        }),
                                        (0, r.jsx)("td", {
                                          className: "px-3 py-2",
                                          children: (0, r.jsx)("span", {
                                            className:
                                              "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100",
                                            children:
                                              null !==
                                                (s =
                                                  e.driverVerificationStatus) &&
                                              void 0 !== s
                                                ? s
                                                : "pending",
                                          }),
                                        }),
                                        (0, r.jsx)("td", {
                                          className: "px-3 py-2",
                                          children: (0, r.jsx)("span", {
                                            className:
                                              "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100",
                                            children: e.enabled ? "Yes" : "No",
                                          }),
                                        }),
                                        (0, r.jsx)("td", {
                                          className: "px-3 py-2 text-right",
                                          children: (0, r.jsxs)("div", {
                                            className: "inline-flex gap-1",
                                            children: [
                                              (0, r.jsx)("button", {
                                                type: "button",
                                                onClick: () =>
                                                  B(e._id, "approved"),
                                                className:
                                                  "rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80",
                                                children: "Approve",
                                              }),
                                              (0, r.jsx)("button", {
                                                type: "button",
                                                onClick: () =>
                                                  B(e._id, "rejected"),
                                                className:
                                                  "rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80",
                                                children: "Reject",
                                              }),
                                              (0, r.jsx)("button", {
                                                type: "button",
                                                onClick: () =>
                                                  G(e._id, !e.enabled),
                                                className:
                                                  "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100 hover:bg-slate-700",
                                                children: e.enabled
                                                  ? "Disable"
                                                  : "Enable",
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
                    (0, r.jsxs)("div", {
                      className:
                        "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                      children: [
                        (0, r.jsx)("h2", {
                          className: "text-sm font-semibold text-slate-100",
                          children: "Compliance documents",
                        }),
                        (0, r.jsx)("p", {
                          className: "text-[11px] text-slate-400",
                          children:
                            "Upload core SACCO documents like permits and insurance. Files are stored securely on the backend.",
                        }),
                        (0, r.jsxs)("form", {
                          onSubmit: V,
                          className: "space-y-2",
                          children: [
                            (0, r.jsxs)("div", {
                              className:
                                "grid gap-2 md:grid-cols-[1.4fr,1.6fr]",
                              children: [
                                (0, r.jsxs)("select", {
                                  value: S,
                                  onChange: (e) => _(e.target.value),
                                  className:
                                    "rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                                  children: [
                                    (0, r.jsx)("option", {
                                      value: "permit",
                                      children: "Permit",
                                    }),
                                    (0, r.jsx)("option", {
                                      value: "insurance",
                                      children: "Insurance",
                                    }),
                                    (0, r.jsx)("option", {
                                      value: "compliance",
                                      children: "Compliance doc",
                                    }),
                                    (0, r.jsx)("option", {
                                      value: "logo",
                                      children: "Logo",
                                    }),
                                  ],
                                }),
                                (0, r.jsx)("input", {
                                  type: "file",
                                  onChange: (e) => {
                                    var t, a;
                                    A(
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
                              ],
                            }),
                            (0, r.jsx)("button", {
                              type: "submit",
                              disabled: !k || E,
                              className:
                                "inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60",
                              children: E ? "Uploading..." : "Upload document",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, r.jsxs)("section", {
                  className: "space-y-3 ".concat(R, " p-4 text-xs"),
                  children: [
                    (0, r.jsx)("div", {
                      className: "flex items-center justify-between",
                      children: (0, r.jsxs)("div", {
                        children: [
                          (0, r.jsx)("h2", {
                            className: "text-sm font-semibold text-slate-100",
                            children: "Fleet",
                          }),
                          (0, r.jsx)("p", {
                            className: "text-[11px] text-slate-400",
                            children:
                              "Vehicles registered under this SACCO and their approval status.",
                          }),
                        ],
                      }),
                    }),
                    (0, r.jsx)("div", {
                      className:
                        "overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70",
                      children: (0, r.jsxs)("table", {
                        className: "min-w-full border-collapse text-[11px]",
                        children: [
                          (0, r.jsx)("thead", {
                            className: "bg-slate-900/80 text-slate-300",
                            children: (0, r.jsxs)("tr", {
                              children: [
                                (0, r.jsx)("th", {
                                  className: "px-3 py-2 text-left font-medium",
                                  children: "Matatu",
                                }),
                                (0, r.jsx)("th", {
                                  className: "px-3 py-2 text-left font-medium",
                                  children: "Route",
                                }),
                                (0, r.jsx)("th", {
                                  className: "px-3 py-2 text-left font-medium",
                                  children: "Approval",
                                }),
                                (0, r.jsx)("th", {
                                  className: "px-3 py-2 text-right font-medium",
                                  children: "Actions",
                                }),
                              ],
                            }),
                          }),
                          (0, r.jsx)("tbody", {
                            children: b.map((e) => {
                              var t, a;
                              return (0, r.jsxs)(
                                "tr",
                                {
                                  className: "border-t border-slate-800/80",
                                  children: [
                                    (0, r.jsx)("td", {
                                      className: "px-3 py-2 text-slate-100",
                                      children:
                                        e.plate ||
                                        e.numberPlate ||
                                        e._id.slice(0, 6),
                                    }),
                                    (0, r.jsx)("td", {
                                      className: "px-3 py-2 text-slate-300",
                                      children:
                                        null !== (t = e.route) && void 0 !== t
                                          ? t
                                          : "—",
                                    }),
                                    (0, r.jsx)("td", {
                                      className: "px-3 py-2",
                                      children: (0, r.jsx)("span", {
                                        className:
                                          "rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100",
                                        children:
                                          null !== (a = e.approvalStatus) &&
                                          void 0 !== a
                                            ? a
                                            : "pending",
                                      }),
                                    }),
                                    (0, r.jsx)("td", {
                                      className: "px-3 py-2 text-right",
                                      children: (0, r.jsxs)("div", {
                                        className: "inline-flex gap-1",
                                        children: [
                                          (0, r.jsx)("button", {
                                            type: "button",
                                            onClick: () => Y(e._id, "approved"),
                                            className:
                                              "rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80",
                                            children: "Approve",
                                          }),
                                          (0, r.jsx)("button", {
                                            type: "button",
                                            onClick: () => Y(e._id, "rejected"),
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
                (0, r.jsxs)("section", {
                  className: "grid gap-4 md:grid-cols-2",
                  children: [
                    (0, r.jsxs)("div", {
                      className: "space-y-2 ".concat(R, " p-4 text-xs"),
                      children: [
                        (0, r.jsx)("h3", {
                          className: "text-sm font-semibold text-slate-100",
                          children: "Pending driver approvals",
                        }),
                        0 === L.length &&
                          (0, r.jsx)("p", {
                            className: "text-[11px] text-slate-400",
                            children: "No pending drivers right now.",
                          }),
                        L.length > 0 &&
                          (0, r.jsx)("ul", {
                            className: "space-y-1 text-[11px] text-slate-200",
                            children: L.map((e) =>
                              (0, r.jsxs)(
                                "li",
                                {
                                  className:
                                    "flex items-center justify-between",
                                  children: [
                                    (0, r.jsx)("span", {
                                      children: e.username,
                                    }),
                                    (0, r.jsxs)("div", {
                                      className: "inline-flex gap-1",
                                      children: [
                                        (0, r.jsx)("button", {
                                          type: "button",
                                          onClick: () => B(e._id, "approved"),
                                          className:
                                            "rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80",
                                          children: "Approve",
                                        }),
                                        (0, r.jsx)("button", {
                                          type: "button",
                                          onClick: () => B(e._id, "rejected"),
                                          className:
                                            "rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80",
                                          children: "Reject",
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                e._id,
                              ),
                            ),
                          }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      className:
                        "space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs",
                      children: [
                        (0, r.jsx)("h3", {
                          className: "text-sm font-semibold text-slate-100",
                          children: "Pending matatu approvals",
                        }),
                        0 === I.length &&
                          (0, r.jsx)("p", {
                            className: "text-[11px] text-slate-400",
                            children: "No pending matatus right now.",
                          }),
                        I.length > 0 &&
                          (0, r.jsx)("ul", {
                            className: "space-y-1 text-[11px] text-slate-200",
                            children: I.map((e) =>
                              (0, r.jsxs)(
                                "li",
                                {
                                  className:
                                    "flex items-center justify-between",
                                  children: [
                                    (0, r.jsx)("span", {
                                      children:
                                        e.plate ||
                                        e.numberPlate ||
                                        e._id.slice(0, 6),
                                    }),
                                    (0, r.jsxs)("div", {
                                      className: "inline-flex gap-1",
                                      children: [
                                        (0, r.jsx)("button", {
                                          type: "button",
                                          onClick: () => Y(e._id, "approved"),
                                          className:
                                            "rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80",
                                          children: "Approve",
                                        }),
                                        (0, r.jsx)("button", {
                                          type: "button",
                                          onClick: () => Y(e._id, "rejected"),
                                          className:
                                            "rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80",
                                          children: "Reject",
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                e._id,
                              ),
                            ),
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          : (0, r.jsx)("div", {
              className: "space-y-4",
              children: (0, r.jsxs)("header", {
                className: "space-y-1",
                children: [
                  (0, r.jsx)("h1", {
                    className: "text-2xl font-semibold tracking-tight",
                    children: "SACCO dashboard",
                  }),
                  (0, r.jsx)("p", {
                    className: "text-xs text-slate-300",
                    children:
                      "You must be signed in as a SACCO admin to view this dashboard.",
                  }),
                ],
              }),
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
          return d;
        },
      });
      var r = a(7437),
        s = a(2265),
        l = a(542);
      let n = (0, s.createContext)(void 0);
      function i(e) {
        let { children: t } = e,
          [a, i] = (0, s.useState)(null),
          [d, o] = (0, s.useState)(!0),
          [c, u] = (0, s.useState)(null);
        (0, s.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              (o(!0), u(null));
              try {
                let t = await (0, l.BZ)();
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
                e || o(!1);
              }
            })(),
            () => {
              e = !0;
            }
          );
        }, []);
        let x = (0, s.useMemo)(
          () => ({ flags: a, loading: d, error: c }),
          [a, d, c],
        );
        return (0, r.jsx)(n.Provider, { value: x, children: t });
      }
      function d(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          { flags: a, loading: r } = (function () {
            let e = (0, s.useContext)(n);
            if (!e)
              throw Error(
                "useFeatureFlags must be used within a FeatureFlagProvider",
              );
            return e;
          })();
        if (r || !a) return t;
        let l = a[e];
        return !!l && !!l.enabled;
      }
    },
    3551: function (e, t, a) {
      "use strict";
      a.d(t, {
        F: function () {
          return o;
        },
        ThemeProvider: function () {
          return d;
        },
      });
      var r = a(7437),
        s = a(2265),
        l = a(3429),
        n = a(728);
      let i = (0, s.createContext)(void 0);
      function d(e) {
        let { children: t } = e,
          { user: a } = (0, l.a)(),
          { activeMode: d } = (0, n.r)(),
          o = null == a ? void 0 : a.role,
          c = (0, s.useMemo)(
            () =>
              "admin" === o
                ? "sacco"
                : "driver" === o && "driver" === d
                  ? "driver"
                  : o
                    ? "passenger"
                    : "generic",
            [o, d],
          ),
          u = (0, s.useMemo)(() => {
            let e = "passenger" === c || "generic" === c,
              t = "driver" === c,
              a = "sacco" === c;
            return {
              variant: c,
              isPassenger: e,
              isDriver: t,
              isSacco: a,
              headerBgClass: t
                ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-mint/20 via-radaa-teal/15 to-radaa-gold/10 backdrop-blur"
                : a
                  ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-gold/20 via-radaa-orange/15 to-radaa-mint/10 backdrop-blur"
                  : "border-b border-slate-800/70 bg-gradient-to-r from-radaa-blue/25 via-radaa-purple/20 to-radaa-mint/10 backdrop-blur",
              primaryButtonClass: t
                ? "radaa-btn-primary bg-gradient-to-r from-radaa-mint to-radaa-teal shadow-glow-mint"
                : a
                  ? "radaa-btn-primary bg-gradient-to-r from-radaa-gold to-radaa-orange shadow-glow-blue"
                  : "radaa-btn-primary bg-gradient-to-r from-radaa-blue to-radaa-purple shadow-glow-blue",
              subtleButtonClass: "radaa-btn-secondary",
              cardSurfaceClass: t
                ? "radaa-card border-radaa-mint/40"
                : a
                  ? "radaa-card border-radaa-gold/40"
                  : "radaa-card",
            };
          }, [c]);
        return (0, r.jsx)(i.Provider, { value: u, children: t });
      }
      function o() {
        let e = (0, s.useContext)(i);
        if (!e) throw Error("useTheme must be used within a ThemeProvider");
        return e;
      }
    },
    728: function (e, t, a) {
      "use strict";
      a.d(t, {
        RealtimeProvider: function () {
          return u;
        },
        r: function () {
          return x;
        },
      });
      var r = a(7437),
        s = a(2265),
        l = a(3901),
        n = a(4876),
        i = a(3429);
      let d = "radaa_active_mode";
      function o() {
        try {
          let e = window.localStorage.getItem(d);
          if ("driver" === e || "passenger" === e) return e;
        } catch (e) {
          console.error("[realtime] failed to read mode from storage", e);
        }
        return "passenger";
      }
      let c = (0, s.createContext)(void 0);
      function u(e) {
        let { children: t } = e,
          { connect: a, on: u, off: x, emit: m } = (0, l.s)(),
          { addNotification: p } = (0, n.z)(),
          { user: h, token: f } = (0, i.a)(),
          [v, g] = (0, s.useState)([]),
          [b, y] = (0, s.useState)(null),
          [j, N] = (0, s.useState)(() => o()),
          [w, C] = (0, s.useState)(() => "driver" === o());
        (0, s.useEffect)(() => {
          a(f);
          let e = (e) => {
              let t = Array.isArray(e) ? e : [e];
              g((e) => {
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
            r = (e) => {
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
            l = (e) => {};
          return (
            u("matatus:live_update", e),
            u("matatu:live_update", e),
            u("ride:assigned", t),
            u("ride:created", r),
            u("sacco:update", s),
            u("passenger:live_update", l),
            () => {
              (x("matatus:live_update", e),
                x("matatu:live_update", e),
                x("ride:assigned", t),
                x("ride:created", r),
                x("sacco:update", s),
                x("passenger:live_update", l));
            }
          );
        }, [a, u, x, p, f]);
        let S = (0, s.useCallback)(
          (e) => {
            C(e);
            let t = e ? "driver" : "passenger";
            (N(t), m(e ? "driver:online" : "driver:offline", { online: e }));
            try {
              window.localStorage.setItem(d, t);
            } catch (e) {
              console.error("[realtime] failed to persist mode to storage", e);
            }
            console.log("[realtime] setDriverOnline", { online: e, mode: t });
          },
          [m],
        );
        (0, s.useEffect)(() => {
          if (!h) return;
          let e = null;
          try {
            e = window.localStorage.getItem(d);
          } catch (e) {
            console.error(
              "[realtime] failed to read mode from storage for role init",
              e,
            );
          }
          "driver" !== e &&
            "passenger" !== e &&
            ("driver" === (null == h ? void 0 : h.role) ? S(!0) : S(!1));
        }, [h, S]);
        let _ = (0, s.useMemo)(
          () => ({
            matatus: v,
            lastRideAssigned: b,
            driverOnline: w,
            setDriverOnline: S,
            activeMode: j,
          }),
          [v, b, w, S, j],
        );
        return (0, r.jsx)(c.Provider, { value: _, children: t });
      }
      function x() {
        let e = (0, s.useContext)(c);
        if (!e)
          throw Error("useRealtime must be used within a RealtimeProvider");
        return e;
      }
    },
    9284: function (e, t, a) {
      "use strict";
      a.d(t, {
        EK: function () {
          return l;
        },
        IY: function () {
          return n;
        },
        Vh: function () {
          return c;
        },
        jZ: function () {
          return i;
        },
        o: function () {
          return d;
        },
        v7: function () {
          return o;
        },
        yb: function () {
          return u;
        },
      });
      var r = a(542);
      async function s(e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          { method: a = "GET", body: s, token: l } = t,
          n = {};
        l && (n.Authorization = "Bearer ".concat(l));
        try {
          let t = (
            await r.ZP.request({ url: e, method: a, data: s, headers: n })
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
          var i;
          let e =
            null == t
              ? void 0
              : null === (i = t.response) || void 0 === i
                ? void 0
                : i.data;
          throw Error(
            (e && "object" == typeof e && (e.message || e.error)) ||
              (null == t ? void 0 : t.message) ||
              "Request failed",
          );
        }
      }
      async function l(e, t) {
        return s("/sacco/".concat(e, "/overview"), {
          method: "GET",
          token: null != t ? t : null,
        });
      }
      async function n(e, t) {
        let a = await s("/sacco/".concat(e, "/drivers"), {
          method: "GET",
          token: null != t ? t : null,
        });
        return Array.isArray(a) ? a : [];
      }
      async function i(e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          a = arguments.length > 2 ? arguments[2] : void 0,
          r = new URLSearchParams();
        t.status && r.set("status", t.status);
        let l = r.toString(),
          n = await s(
            "/sacco/".concat(e, "/matatus").concat(l ? "?".concat(l) : ""),
            { method: "GET", token: null != a ? a : null },
          );
        return Array.isArray(n) ? n : [];
      }
      async function d(e, t, a, r) {
        let l = new FormData();
        return (
          l.append("file", a),
          l.append("type", t),
          s("/sacco/".concat(e, "/docs"), {
            method: "POST",
            body: l,
            token: null != r ? r : null,
          })
        );
      }
      async function o(e, t, a, r) {
        return s("/sacco/".concat(e, "/driver/").concat(t, "/disable"), {
          method: "POST",
          body: { enabled: a },
          token: null != r ? r : null,
        });
      }
      async function c(e, t, a, r) {
        return s("/sacco/".concat(e, "/driver/").concat(t, "/verification"), {
          method: "POST",
          body: { status: a },
          token: null != r ? r : null,
        });
      }
      async function u(e, t, a, r) {
        return s("/sacco/".concat(e, "/matatu/").concat(t, "/approval"), {
          method: "POST",
          body: { status: a },
          token: null != r ? r : null,
        });
      }
    },
  },
  function (e) {
    (e.O(0, [472, 40, 401, 971, 23, 744], function () {
      return e((e.s = 118));
    }),
      (_N_E = e.O()));
  },
]);
