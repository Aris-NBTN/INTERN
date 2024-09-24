/*! grapesjs-component-icon - 1.0.3 */ ! function (t, e) {
    'object' == typeof exports && 'object' == typeof module ? module.exports = e() : 'function' == typeof define && define.amd ? define([], e) : 'object' == typeof exports ? exports["grapesjs-component-icon"] = e() : t["grapesjs-component-icon"] = e()
}('undefined' != typeof globalThis ? globalThis : 'undefined' != typeof window ? window : this, (() => (() => {
    "use strict";
    var t = {
        d: (e, n) => {
            for (var o in n) t.o(n, o) && !t.o(e, o) && Object.defineProperty(e, o, {
                enumerable: !0,
                get: n[o]
            })
        },
        o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
        r: t => {
            'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: 'Module'
            }), Object.defineProperty(t, '__esModule', {
                value: !0
            })
        }
    },
        e = {};

    function n(t) {
        return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }, n(t)
    }

    function o(t) {
        var e = function (t, e) {
            if ("object" !== n(t) || null === t) return t;
            var o = t[Symbol.toPrimitive];
            if (void 0 !== o) {
                var r = o.call(t, e || "default");
                if ("object" !== n(r)) return r;
                throw new TypeError("@@toPrimitive must return a primitive value.")
            }
            return ("string" === e ? String : Number)(t)
        }(t, "string");
        return "symbol" === n(e) ? e : String(e)
    }

    function r(t, e, n) {
        return (e = o(e)) in t ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = n, t
    }

    function i(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, o = new Array(e); n < e; n++) o[n] = t[n];
        return o
    }

    function c(t) {
        return function (t) {
            if (Array.isArray(t)) return i(t)
        }(t) || function (t) {
            if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t)
        }(t) || function (t, e) {
            if (t) {
                if ("string" == typeof t) return i(t, e);
                var n = Object.prototype.toString.call(t).slice(8, -1);
                return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(t, e) : void 0
            }
        }(t) || function () {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }

    function a(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(t);
            e && (o = o.filter((function (e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable
            }))), n.push.apply(n, o)
        }
        return n
    }

    function l(t) {
        for (var e = 1; e < arguments.length; e++) {
            var n = null != arguments[e] ? arguments[e] : {};
            e % 2 ? a(Object(n), !0).forEach((function (e) {
                r(t, e, n[e])
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : a(Object(n)).forEach((function (e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
            }))
        }
        return t
    }
    t.r(e), t.d(e, {
        default: () => y
    });
    var s = "icon";

    function u(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(t);
            e && (o = o.filter((function (e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable
            }))), n.push.apply(n, o)
        }
        return n
    }
    const f = function (t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            n = t.Blocks,
            o = e.iconBlock;
        o && n.add(s, function (t) {
            for (var e = 1; e < arguments.length; e++) {
                var n = null != arguments[e] ? arguments[e] : {};
                e % 2 ? u(Object(n), !0).forEach((function (e) {
                    r(t, e, n[e])
                })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : u(Object(n)).forEach((function (e) {
                    Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                }))
            }
            return t
        }({
            label: "Icon",
            category: "Basic",
            media: `
            <svg fill="#000000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M116.65 219.35a15.68 15.68 0 0 0 22.65 0l96.75-99.83c28.15-29 26.5-77.1-4.91-103.88C203.75-7.7 163-3.5 137.86 22.44L128 32.58l-9.85-10.14C93.05-3.5 52.25-7.7 24.86 15.64c-31.41 26.78-33 74.85-5 103.88zm143.92 100.49h-48l-7.08-14.24a27.39 27.39 0 0 0-25.66-17.78h-71.71a27.39 27.39 0 0 0-25.66 17.78l-7 14.24h-48A27.45 27.45 0 0 0 0 347.3v137.25A27.44 27.44 0 0 0 27.43 512h233.14A27.45 27.45 0 0 0 288 484.55V347.3a27.45 27.45 0 0 0-27.43-27.46zM144 468a52 52 0 1 1 52-52 52 52 0 0 1-52 52zm355.4-115.9h-60.58l22.36-50.75c2.1-6.65-3.93-13.21-12.18-13.21h-75.59c-6.3 0-11.66 3.9-12.5 9.1l-16.8 106.93c-1 6.3 4.88 11.89 12.5 11.89h62.31l-24.2 83c-1.89 6.65 4.2 12.9 12.23 12.9a13.26 13.26 0 0 0 10.92-5.25l92.4-138.91c4.88-6.91-1.16-15.7-10.87-15.7zM478.08.33L329.51 23.17C314.87 25.42 304 38.92 304 54.83V161.6a83.25 83.25 0 0 0-16-1.7c-35.35 0-64 21.48-64 48s28.65 48 64 48c35.2 0 63.73-21.32 64-47.66V99.66l112-17.22v47.18a83.25 83.25 0 0 0-16-1.7c-35.35 0-64 21.48-64 48s28.65 48 64 48c35.2 0 63.73-21.32 64-47.66V32c0-19.48-16-34.42-33.92-31.67z"></path></g></svg>
            `,
            content: {
                type: s
            }
        }, o))
    };

    function d(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(t);
            e && (o = o.filter((function (e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable
            }))), n.push.apply(n, o)
        }
        return n
    }

    function p(t) {
        for (var e = 1; e < arguments.length; e++) {
            var n = null != arguments[e] ? arguments[e] : {};
            e % 2 ? d(Object(n), !0).forEach((function (e) {
                r(t, e, n[e])
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : d(Object(n)).forEach((function (e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
            }))
        }
        return t
    }
    const y = function (t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            n = p(p({}, {
                iconBlock: {}
            }), e);
        ! function (t) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                n = l(l({}, {
                    config: {},
                    constructor: "",
                    labelIconPicker: "Icon Picker",
                    commandId: "icon-finder",
                    onEvent: 0,
                    onEventAfter: function (t) {
                        return console.log("Event: ", t)
                    },
                    maxWidth: "100%",
                    maxHeight: "600px",
                    script: ["http://localhost:8082/plugins/Icon/Search.js"],
                    style: ["http://localhost:8082/plugins/Icon/Index.css"]
                }), e),
                o = n.script,
                r = n.style,
                i = n.onEvent,
                a = n.onEventAfter,
                u = n.maxWidth,
                f = n.maxHeight,
                d = n.commandId,
                p = t.getConfig("stylePrefix"),
                y = "".concat(p, "mdl-dialog-ntl"),
                b = function () {
                    return n.constructor || window.IconFinder
                },
                m = b();
            if (!m && o) {
                var g = document.head,
                    h = Array.isArray(o) ? c(o) : [o];
                ! function t(e) {
                    if (e.length) {
                        var n = document.createElement("link");
                        n.href = e.shift(), n.rel = "stylesheet", g.appendChild(n), t(e)
                    }
                }(Array.isArray(r) ? c(r) : [r]),
                    function t(e) {
                        if (e.length) {
                            var n = document.createElement("script");
                            n.src = e.shift(), n.onerror = n.onload = t.bind(null, e), g.appendChild(n)
                        } else m = b()
                    }(h)
            }
            t.DomComponents.addType(s, {
                model: {
                    defaults: {
                        icon: '<i class="fa fa-diamond"></i>',
                        resizable: true,
                        components: '<span class="iconify w-full h-full" data-icon="fa:home"></span>',
                        attributes: {
                            class: "icon-display w-[5rem]"
                        },
                    }
                },
                view: {
                    events: {
                        dblclick: "onActive"
                    },
                    onActive: function () {
                        t.runCommand(d)
                    }
                }
            }), t.Commands.add(d, {
                run: function (t, e) {
                    var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                        r = this.id,
                        i = this.applyChanges,
                        c = document.querySelector(".".concat(p, "mdl-dialog"));
                    if (c.classList.add(y), !m) return t.log("IconifyFinder not found", {
                        level: "error",
                        ns: d
                    }), t.stopCommand(r);
                    this.editor = t, this.target = o.target || t.getSelected();
                    var a = document.getElementById("blc-finder") || this.createContent(),
                        s = n.labelIconPicker,
                        u = a.children[0];
                    t.Modal.open({
                        title: s,
                        content: a
                    }).getModel().once("change:open", (function () {
                        t.stopCommand(r), c.classList.remove(y)
                    })), this.iconFinder || (this.iconFinder = new m(l({
                        container: u,
                        callback: i.bind(this)
                    }, n.config))), t.getModel().setEditing(1)
                },
                stop: function (t) {
                    t.getModel().setEditing(0)
                },
                createContent: function () {
                    var t = document.createElement("div");
                    return t.style = "position: relative", t.innerHTML = "<div id=\"blc-finder\" style=\"max-height:".concat(f, ";max-width:").concat(u, ";overflow:auto;margin: 0 auto;\"></div>"), t
                },
                applyChanges: function (t) {
                    var e = this.target,
                        n = this.editor;
                    if (i) i(t);
                    else {
                        if ("button" === t.type && "submit" === t.button) {
                            var o = t.state,
                                r = o.icons,
                                c = o.customisations,
                                l = e.getEl();
                            l.innerHTML = "<span style='height: 100%; width: 100%; min-width: 30px; min-height: 30px;' class=\"iconify\" data-icon=\"".concat(r[0].prefix, ":").concat(r[0].name, "\" \n            ").concat(c.width && "data-width=\"".concat(c.width, "px\"") || "", "\n            ").concat(c.height && "data-height=\"".concat(c.height, "px\"") || "", "\n            ").concat(!c.vFlip && c.hFlip && 'data-flip="horizontal"' || "", "\n            ").concat(c.vFlip && !c.hFlip && 'data-flip="vertical"' || "", "\n            ").concat(c.vFlip && c.hFlip && 'data-flip="horizontal,vertical"' || "", "\n            ").concat(c.rotate && "data-rotate=\"".concat(["0deg", "90deg", "180deg", "270deg"][c.rotate], "\"") || "", "\n            ").concat(c.color && "style=\"color:".concat(c.color, ";\"") || "", "\n          ></span>"), l.classList.remove("".concat(p, "selected")), n.select(e.replaceWith(l.outerHTML)), a && a(t), n.Modal.close()
                        }
                        "button" === t.type && "cancel" === t.button && n.Modal.close()
                    }
                }
            })
        }(t, n), f(t, n)
    };
    return e
})()));
//# sourceMappingURL=index.js.map