function setupFullscreen() {
    function e() {
        $("body").removeClass("has-fullscreen"),
            i = null
    }
    function a(e) {
        i = e;
        var a = e.find("img, video").first().clone()
            , t = e.find(".loading-spinner").clone();
        if (n.empty().append(a).append(t),
            a.is("video")) {
            setTimeout(function () {
                n.addClass("loading")
            }, 10),
                a.on("canplay", function () {
                    a.addClass("loaded"),
                        n.addClass("loaded").removeClass("loading"),
                        a.get(0).play()
                });
            var o = a.get(0);
            o.load()
        }
        setTimeout(function () {
            $("body").addClass("has-fullscreen")
        }, 10)
    }
    var n = $("<div>").addClass("fullscreen-overlay loader-parent").click(function () {
        e()
    }).appendTo("body")
        , i = null;
    $(".page:not(.no-fullscreen) .media").click(function () {
        n.removeClass("loaded loading"),
            $(this).parents(".panning").length > 0 || a($(this))
    }),
        $(document).on("keydown", function (a) {
            27 == a.keyCode && e()
        }),
        window.loadFullscreenMedia = a,
        window.getCurrentFullscreenMedia = function () {
            return i
        }
}
function setupKeyboardNav() {
    $(document).on("keydown", function (e) {
        if (37 == e.keyCode || 39 == e.keyCode) {
            var a = 37 == e.keyCode ? -1 : 1;
            if ($("body").hasClass("has-fullscreen")) {
                var n = getCurrentFullscreenMedia();
                if (n) {
                    var i = n.parent(".page")
                        , t = i[a == -1 ? "prev" : "next"](".page:not(.no-fullscreen)");
                    t.length && loadFullscreenMedia(t.find(".media"))
                }
            } else {
                var o = $(window).height()
                    , d = null
                    , s = 0;
                $(".pages").each(function () {
                    var e = $(this).get(0).getBoundingClientRect()
                        , a = e.bottom - e.top
                        , n = Math.min(e.bottom, o) - Math.max(e.top, 0)
                        , i = n / a;
                    i > s && (d = this,
                        s = i)
                }),
                    d && d.snapToPage && d.snapToPage(d.getCurrentPage() + a)
            }
        }
    })
}
function setupVideoMedia() {
    function e() {
        playVideoMedia($(i), !0)
    }
    function a() {
        var e = $(window).width()
            , a = $(window).height();
        t.each(function () {
            var n = $(this).get(0).getBoundingClientRect();
            n.bottom < 0 || n.right < 0 || n.left > e || n.top > a || ($(this).addClass("was-visible"),
                t = $("section.project:not(.was-visible)"),
                loadPage($(this).find(".page").first()))
        })
    }
    var n, i = null;
    $(document).on("mouseenter", ".page.video .media", function () {
        n && (clearTimeout(n),
            n = 0),
            i = this,
            n = setTimeout(e, 100)
    }).on("mouseleave", ".page.video .media", function () {
        n && (clearTimeout(n),
            n = 0),
            playVideoMedia($(this), !1)
    }).on("click", ".page.video .media", function () {
        $(this).find("video").get(0).currentTime = 0
    });
    var t = $("section.project:not(.was-visible)");
    a(),
        $(window).on("scroll resize", a)
}
function setupMediaSizing() {
    $(".media video").on("resize", function () {
        sizeMedia($(this).parents(".media"))
    }),
        $(".media img").on("load", function () {
            sizeMedia($(this).parents(".media"))
        })
}
function sizeMedia(e) {
    var a = e.children().eq(0);
    if (a.length && !e.parent(".page").hasClass("no-scale")) {
        var n = e.width()
            , i = e.height()
            , t = a.get(0).offsetWidth
            , o = a.get(0).offsetHeight
            , d = 1;
        d = t / o > n / i ? n / t : i / o,
            d = Math.min(d, 1),
            a.css("transform", "scale(" + d + ")")
    }
}
function buildPagers() {
    function e() {
        a = window.screen.width < 480 ? 16 : 32,
            n = 16,
            i = $(".pages").width(),
            t = i - 2 * (a + n),
            $(".page").css({
                width: t,
                minWidth: t,
                marginRight: n
            }),
            $(".page:first-child").css({
                marginLeft: n + a
            }),
            $(".page:last-child").css({
                marginRight: a
            }),
            $(".media").each(function () {
                sizeMedia($(this))
            })
    }
    var a, n, i, t;
    e(),
        $(window).resize(e),
        $(".pages").each(function () {
            var e, i = $(this), o = this, d = $(this).find(".page-scroll"), s = $(this).find(".page"), l = 0, c = -1, r = !1, u = {};
            i.on("dragstart", function (e) {
                e.preventDefault()
            }).on("click", function (e) {
                r && (e.preventDefault(),
                    e.stopPropagation())
            }).on("wheel", function (e) {
                Math.abs(e.originalEvent.deltaX) && e.preventDefault()
            });
            var g = s.length;
            if (!(g <= 1)) {
                i.addClass("pannable");
                var p = function (e) {
                    e < 0 || e >= g || e in u || (u[e] = !0,
                        loadPage(s.eq(e)))
                }
                    , f = function (a, i, o) {
                        void 0 === o && (o = !0),
                            void 0 === i && (i = !1),
                            l = Math.max(0, Math.min((t + n) * (g - 1), a)),
                            d.toggleClass("animate-scroll", i).css("transform", "translate3d(" + -l + "px,0,0)");
                        var s = Math.round(l / t);
                        c != s && (c = s,
                            o && (p(c - 1),
                                p(c),
                                p(c + 1)),
                            e.find(".page-dot").each(function (e) {
                                $(this).toggleClass("active", e == c)
                            }))
                    }
                    , h = function (e) {
                        f(e * (t + n), !0)
                    };
                o.snapToPage = h,
                    o.getCurrentPage = function () {
                        return c
                    }
                    ,
                    $("<div>").addClass("edge-clicker prev").css("width", a).appendTo(i).click(function () {
                        h(c - 1)
                    }),
                    $("<div>").addClass("edge-clicker next").css("width", a).appendTo(i).click(function () {
                        h(c + 1)
                    }),
                    e = $("<div>").addClass("page-dots").appendTo(i);
                for (var v = function () {
                    h($(this).index())
                }, m = 0; m < g; m++)
                    e.append($("<div>").addClass("page-dot").click(v));
                var C = 0
                    , w = -1
                    , y = !1
                    , b = new Hammer(i.get(0), {
                        dragLockToAxis: !0
                    });
                b.on("panend pan swipe", function (e) {
                    e.preventDefault(),
                        e.srcEvent.preventDefault();
                    var a = e.deltaX < 0;
                    switch (e.type) {
                        case "pan":
                            if (!y) {
                                var n = e.deltaX - C;
                                r = !0,
                                    w < 0 && (w = c),
                                    i.addClass("panning"),
                                    f(l - n),
                                    C = e.deltaX
                            }
                            break;
                        case "swipe":
                            y = !0,
                                C = 0,
                                a = 0 == (e.direction & Hammer.DIRECTION_RIGHT),
                                h(w + (a ? 1 : -1)),
                                setTimeout(function () {
                                    r = !1,
                                        w = -1,
                                        i.removeClass("panning")
                                }, 0),
                                e.srcEvent.stopPropagation();
                            break;
                        case "panend":
                            y || (C = 0,
                                h(c),
                                setTimeout(function () {
                                    r = !1,
                                        w = -1,
                                        i.removeClass("panning")
                                }, 0)),
                                y = !1
                    }
                });
                var M, k, T;
                i.on("wheel", function (e) {
                    var a = e.originalEvent.deltaX < 0 ? -1 : 1
                        , n = Math.abs(e.originalEvent.deltaX);
                    return n < Math.abs(e.originalEvent.deltaY) || (T || n < 30 ? (k = n,
                        !1) : ((n > k || a != M) && (M = a,
                            T = !0,
                            setTimeout(function () {
                                T = !1
                            }, 300),
                            h(c + a)),
                            !1))
                }),
                    f(0, !1, !1)
            }
        })
}
function loadPage(e) { }
function playVideoMedia(e, a) {
    e.data("should-be-playing", a);
    var n = e.find("video");
    a ? e.hasClass("loaded") ? n.get(0).play() : (e.addClass("loading"),
        n.off("canplay").on("canplay", function () {
            e.addClass("loaded").removeClass("loading"),
                e.data("should-be-playing") && n.get(0).play()
        }),
        n.get(0).load()) : n.get(0).pause()
}
$(document).ready(function () {
    buildPagers(),
        setupMediaSizing(),
        setupVideoMedia(),
        setupFullscreen(),
        setupKeyboardNav(),
        FastClick.attach(document.body),
        $(".project a").attr("target", "_blank")
});
