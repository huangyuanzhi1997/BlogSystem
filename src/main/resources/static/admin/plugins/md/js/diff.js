function diff_match_patch() {
    this.Diff_Timeout = 1;
    this.Diff_EditCost = 4;
    this.Match_Threshold = 0.5;
    this.Match_Distance = 1000;
    this.Patch_DeleteThreshold = 0.5;
    this.Patch_Margin = 4;
    this.Match_MaxBits = 32
}

var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;
diff_match_patch.Diff;
diff_match_patch.prototype.diff_main = function (b, a, d, f) {
    if (typeof f == "undefined") {
        if (this.Diff_Timeout <= 0) {
            f = Number.MAX_VALUE
        } else {
            f = (new Date).getTime() + this.Diff_Timeout * 1000
        }
    }
    var i = f;
    if (b == null || a == null) {
        throw new Error("Null input. (diff_main)")
    }
    if (b == a) {
        if (b) {
            return [[DIFF_EQUAL, b]]
        }
        return []
    }
    if (typeof d == "undefined") {
        d = true
    }
    var j = d;
    var e = this.diff_commonPrefix(b, a);
    var h = b.substring(0, e);
    b = b.substring(e);
    a = a.substring(e);
    e = this.diff_commonSuffix(b, a);
    var c = b.substring(b.length - e);
    b = b.substring(0, b.length - e);
    a = a.substring(0, a.length - e);
    var g = this.diff_compute_(b, a, j, i);
    if (h) {
        g.unshift([DIFF_EQUAL, h])
    }
    if (c) {
        g.push([DIFF_EQUAL, c])
    }
    this.diff_cleanupMerge(g);
    return g
};
diff_match_patch.prototype.diff_compute_ = function (c, b, q, p) {
    var j;
    if (!c) {
        return [[DIFF_INSERT, b]]
    }
    if (!b) {
        return [[DIFF_DELETE, c]]
    }
    var m = c.length > b.length ? c : b;
    var d = c.length > b.length ? b : c;
    var f = m.indexOf(d);
    if (f != -1) {
        j = [[DIFF_INSERT, m.substring(0, f)], [DIFF_EQUAL, d], [DIFF_INSERT, m.substring(f + d.length)]];
        if (c.length > b.length) {
            j[0][0] = j[2][0] = DIFF_DELETE
        }
        return j
    }
    if (d.length == 1) {
        return [[DIFF_DELETE, c], [DIFF_INSERT, b]]
    }
    var a = this.diff_halfMatch_(c, b);
    if (a) {
        var l = a[0];
        var h = a[1];
        var o = a[2];
        var n = a[3];
        var e = a[4];
        var k = this.diff_main(l, o, q, p);
        var g = this.diff_main(h, n, q, p);
        return k.concat([[DIFF_EQUAL, e]], g)
    }
    if (q && c.length > 100 && b.length > 100) {
        return this.diff_lineMode_(c, b, p)
    }
    return this.diff_bisect_(c, b, p)
};
diff_match_patch.prototype.diff_lineMode_ = function (d, c, n) {
    var k = this.diff_linesToChars_(d, c);
    d = k.chars1;
    c = k.chars2;
    var e = k.lineArray;
    var g = this.diff_main(d, c, false, n);
    this.diff_charsToLines_(g, e);
    this.diff_cleanupSemantic(g);
    g.push([DIFF_EQUAL, ""]);
    var b = 0;
    var m = 0;
    var l = 0;
    var i = "";
    var h = "";
    while (b < g.length) {
        switch (g[b][0]) {
            case DIFF_INSERT:
                l++;
                h += g[b][1];
                break;
            case DIFF_DELETE:
                m++;
                i += g[b][1];
                break;
            case DIFF_EQUAL:
                if (m >= 1 && l >= 1) {
                    g.splice(b - m - l, m + l);
                    b = b - m - l;
                    var k = this.diff_main(i, h, false, n);
                    for (var f = k.length - 1; f >= 0; f--) {
                        g.splice(b, 0, k[f])
                    }
                    b = b + k.length
                }
                l = 0;
                m = 0;
                i = "";
                h = "";
                break
        }
        b++
    }
    g.pop();
    return g
};
diff_match_patch.prototype.diff_bisect_ = function (n, l, A) {
    var v = n.length;
    var g = l.length;
    var h = Math.ceil((v + g) / 2);
    var r = h;
    var o = 2 * h;
    var e = new Array(o);
    var b = new Array(o);
    for (var m = 0; m < o; m++) {
        e[m] = -1;
        b[m] = -1
    }
    e[r + 1] = 0;
    b[r + 1] = 0;
    var B = v - g;
    var i = (B % 2 != 0);
    var s = 0;
    var p = 0;
    var u = 0;
    var t = 0;
    for (var z = 0; z < h; z++) {
        if ((new Date()).getTime() > A) {
            break
        }
        for (var k = -z + s; k <= z - p; k += 2) {
            var q = r + k;
            var y;
            if (k == -z || (k != z && e[q - 1] < e[q + 1])) {
                y = e[q + 1]
            } else {
                y = e[q - 1] + 1
            }
            var f = y - k;
            while (y < v && f < g && n.charAt(y) == l.charAt(f)) {
                y++;
                f++
            }
            e[q] = y;
            if (y > v) {
                p += 2
            } else {
                if (f > g) {
                    s += 2
                } else {
                    if (i) {
                        var a = r + B - k;
                        if (a >= 0 && a < o && b[a] != -1) {
                            var w = v - b[a];
                            if (y >= w) {
                                return this.diff_bisectSplit_(n, l, y, f, A)
                            }
                        }
                    }
                }
            }
        }
        for (var j = -z + u; j <= z - t; j += 2) {
            var a = r + j;
            var w;
            if (j == -z || (j != z && b[a - 1] < b[a + 1])) {
                w = b[a + 1]
            } else {
                w = b[a - 1] + 1
            }
            var c = w - j;
            while (w < v && c < g && n.charAt(v - w - 1) == l.charAt(g - c - 1)) {
                w++;
                c++
            }
            b[a] = w;
            if (w > v) {
                t += 2
            } else {
                if (c > g) {
                    u += 2
                } else {
                    if (!i) {
                        var q = r + B - j;
                        if (q >= 0 && q < o && e[q] != -1) {
                            var y = e[q];
                            var f = r + y - q;
                            w = v - w;
                            if (y >= w) {
                                return this.diff_bisectSplit_(n, l, y, f, A)
                            }
                        }
                    }
                }
            }
        }
    }
    return [[DIFF_DELETE, n], [DIFF_INSERT, l]]
};
diff_match_patch.prototype.diff_bisectSplit_ = function (d, c, i, h, k) {
    var f = d.substring(0, i);
    var b = c.substring(0, h);
    var e = d.substring(i);
    var a = c.substring(h);
    var g = this.diff_main(f, b, false, k);
    var j = this.diff_main(e, a, false, k);
    return g.concat(j)
};
diff_match_patch.prototype.diff_linesToChars_ = function (g, e) {
    var d = [];
    var a = {};
    d[0] = "";

    function f(m) {
        var k = "";
        var i = 0;
        var l = -1;
        var j = d.length;
        while (l < m.length - 1) {
            l = m.indexOf("\n", i);
            if (l == -1) {
                l = m.length - 1
            }
            var h = m.substring(i, l + 1);
            i = l + 1;
            if (a.hasOwnProperty ? a.hasOwnProperty(h) : (a[h] !== undefined)) {
                k += String.fromCharCode(a[h])
            } else {
                k += String.fromCharCode(j);
                a[h] = j;
                d[j++] = h
            }
        }
        return k
    }

    var c = f(g);
    var b = f(e);
    return {chars1: c, chars2: b, lineArray: d}
};
diff_match_patch.prototype.diff_charsToLines_ = function (e, b) {
    for (var a = 0; a < e.length; a++) {
        var c = e[a][1];
        var d = [];
        for (var f = 0; f < c.length; f++) {
            d[f] = b[c.charCodeAt(f)]
        }
        e[a][1] = d.join("")
    }
};
diff_match_patch.prototype.diff_commonPrefix = function (e, d) {
    if (!e || !d || e.charAt(0) != d.charAt(0)) {
        return 0
    }
    var b = 0;
    var f = Math.min(e.length, d.length);
    var a = f;
    var c = 0;
    while (b < a) {
        if (e.substring(c, a) == d.substring(c, a)) {
            b = a;
            c = b
        } else {
            f = a
        }
        a = Math.floor((f - b) / 2 + b)
    }
    return a
};
diff_match_patch.prototype.diff_commonSuffix = function (d, c) {
    if (!d || !c || d.charAt(d.length - 1) != c.charAt(c.length - 1)) {
        return 0
    }
    var b = 0;
    var e = Math.min(d.length, c.length);
    var a = e;
    var f = 0;
    while (b < a) {
        if (d.substring(d.length - a, d.length - f) == c.substring(c.length - a, c.length - f)) {
            b = a;
            f = b
        } else {
            e = a
        }
        a = Math.floor((e - b) / 2 + b)
    }
    return a
};
diff_match_patch.prototype.diff_commonOverlap_ = function (b, a) {
    var g = b.length;
    var e = a.length;
    if (g == 0 || e == 0) {
        return 0
    }
    if (g > e) {
        b = b.substring(g - e)
    } else {
        if (g < e) {
            a = a.substring(0, g)
        }
    }
    var h = Math.min(g, e);
    if (b == a) {
        return h
    }
    var d = 0;
    var c = 1;
    while (true) {
        var f = b.substring(h - c);
        var i = a.indexOf(f);
        if (i == -1) {
            return d
        }
        c += i;
        if (i == 0 || b.substring(h - c) == a.substring(0, c)) {
            d = c;
            c++
        }
    }
};
diff_match_patch.prototype.diff_halfMatch_ = function (c, b) {
    if (this.Diff_Timeout <= 0) {
        return null
    }
    var j = c.length > b.length ? c : b;
    var d = c.length > b.length ? b : c;
    if (j.length < 4 || d.length * 2 < j.length) {
        return null
    }
    var n = this;

    function k(v, o, r) {
        var t = v.substring(r, r + Math.floor(v.length / 4));
        var p = -1;
        var z = "";
        var s, q, y, x;
        while ((p = o.indexOf(t, p + 1)) != -1) {
            var u = n.diff_commonPrefix(v.substring(r), o.substring(p));
            var w = n.diff_commonSuffix(v.substring(0, r), o.substring(0, p));
            if (z.length < w + u) {
                z = o.substring(p - w, p) + o.substring(p, p + u);
                s = v.substring(0, r - w);
                q = v.substring(r + u);
                y = o.substring(0, p - w);
                x = o.substring(p + u)
            }
        }
        if (z.length * 2 >= v.length) {
            return [s, q, y, x, z]
        } else {
            return null
        }
    }

    var g = k(j, d, Math.ceil(j.length / 4));
    var f = k(j, d, Math.ceil(j.length / 2));
    var a;
    if (!g && !f) {
        return null
    } else {
        if (!f) {
            a = g
        } else {
            if (!g) {
                a = f
            } else {
                a = g[4].length > f[4].length ? g : f
            }
        }
    }
    var i, h, m, l;
    if (c.length > b.length) {
        i = a[0];
        h = a[1];
        m = a[2];
        l = a[3]
    } else {
        m = a[0];
        l = a[1];
        i = a[2];
        h = a[3]
    }
    var e = a[4];
    return [i, h, m, l, e]
};
diff_match_patch.prototype.diff_cleanupSemantic = function (m) {
    var n = false;
    var l = [];
    var e = 0;
    var f = null;
    var a = 0;
    var k = 0;
    var j = 0;
    var i = 0;
    var h = 0;
    while (a < m.length) {
        if (m[a][0] == DIFF_EQUAL) {
            l[e++] = a;
            k = i;
            j = h;
            i = 0;
            h = 0;
            f = m[a][1]
        } else {
            if (m[a][0] == DIFF_INSERT) {
                i += m[a][1].length
            } else {
                h += m[a][1].length
            }
            if (f && (f.length <= Math.max(k, j)) && (f.length <= Math.max(i, h))) {
                m.splice(l[e - 1], 0, [DIFF_DELETE, f]);
                m[l[e - 1] + 1][0] = DIFF_INSERT;
                e--;
                e--;
                a = e > 0 ? l[e - 1] : -1;
                k = 0;
                j = 0;
                i = 0;
                h = 0;
                f = null;
                n = true
            }
        }
        a++
    }
    if (n) {
        this.diff_cleanupMerge(m)
    }
    this.diff_cleanupSemanticLossless(m);
    a = 1;
    while (a < m.length) {
        if (m[a - 1][0] == DIFF_DELETE && m[a][0] == DIFF_INSERT) {
            var g = m[a - 1][1];
            var b = m[a][1];
            var d = this.diff_commonOverlap_(g, b);
            var c = this.diff_commonOverlap_(b, g);
            if (d >= c) {
                if (d >= g.length / 2 || d >= b.length / 2) {
                    m.splice(a, 0, [DIFF_EQUAL, b.substring(0, d)]);
                    m[a - 1][1] = g.substring(0, g.length - d);
                    m[a + 1][1] = b.substring(d);
                    a++
                }
            } else {
                if (c >= g.length / 2 || c >= b.length / 2) {
                    m.splice(a, 0, [DIFF_EQUAL, g.substring(0, c)]);
                    m[a - 1][0] = DIFF_INSERT;
                    m[a - 1][1] = b.substring(0, b.length - c);
                    m[a + 1][0] = DIFF_DELETE;
                    m[a + 1][1] = g.substring(c);
                    a++
                }
            }
            a++
        }
        a++
    }
};
diff_match_patch.prototype.diff_cleanupSemanticLossless = function (i) {
    function c(r, y) {
        if (!r || !y) {
            return 6
        }
        var t = r.charAt(r.length - 1);
        var s = y.charAt(0);
        var x = t.match(diff_match_patch.nonAlphaNumericRegex_);
        var w = s.match(diff_match_patch.nonAlphaNumericRegex_);
        var o = x && t.match(diff_match_patch.whitespaceRegex_);
        var n = w && s.match(diff_match_patch.whitespaceRegex_);
        var q = o && t.match(diff_match_patch.linebreakRegex_);
        var p = n && s.match(diff_match_patch.linebreakRegex_);
        var v = q && r.match(diff_match_patch.blanklineEndRegex_);
        var u = p && y.match(diff_match_patch.blanklineStartRegex_);
        if (v || u) {
            return 5
        } else {
            if (q || p) {
                return 4
            } else {
                if (x && !o && n) {
                    return 3
                } else {
                    if (o || n) {
                        return 2
                    } else {
                        if (x || w) {
                            return 1
                        }
                    }
                }
            }
        }
        return 0
    }

    var a = 1;
    while (a < i.length - 1) {
        if (i[a - 1][0] == DIFF_EQUAL && i[a + 1][0] == DIFF_EQUAL) {
            var m = i[a - 1][1];
            var l = i[a][1];
            var k = i[a + 1][1];
            var j = this.diff_commonSuffix(m, l);
            if (j) {
                var b = l.substring(l.length - j);
                m = m.substring(0, m.length - j);
                l = b + l.substring(0, l.length - j);
                k = b + k
            }
            var g = m;
            var h = l;
            var f = k;
            var e = c(m, l) + c(l, k);
            while (l.charAt(0) === k.charAt(0)) {
                m += l.charAt(0);
                l = l.substring(1) + k.charAt(0);
                k = k.substring(1);
                var d = c(m, l) + c(l, k);
                if (d >= e) {
                    e = d;
                    g = m;
                    h = l;
                    f = k
                }
            }
            if (i[a - 1][1] != g) {
                if (g) {
                    i[a - 1][1] = g
                } else {
                    i.splice(a - 1, 1);
                    a--
                }
                i[a][1] = h;
                if (f) {
                    i[a + 1][1] = f
                } else {
                    i.splice(a + 1, 1);
                    a--
                }
            }
        }
        a++
    }
};
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;
diff_match_patch.prototype.diff_cleanupEfficiency = function (g) {
    var i = false;
    var f = [];
    var c = 0;
    var d = null;
    var a = 0;
    var h = false;
    var j = false;
    var b = false;
    var e = false;
    while (a < g.length) {
        if (g[a][0] == DIFF_EQUAL) {
            if (g[a][1].length < this.Diff_EditCost && (b || e)) {
                f[c++] = a;
                h = b;
                j = e;
                d = g[a][1]
            } else {
                c = 0;
                d = null
            }
            b = e = false
        } else {
            if (g[a][0] == DIFF_DELETE) {
                e = true
            } else {
                b = true
            }
            if (d && ((h && j && b && e) || ((d.length < this.Diff_EditCost / 2) && (h + j + b + e) == 3))) {
                g.splice(f[c - 1], 0, [DIFF_DELETE, d]);
                g[f[c - 1] + 1][0] = DIFF_INSERT;
                c--;
                d = null;
                if (h && j) {
                    b = e = true;
                    c = 0
                } else {
                    c--;
                    a = c > 0 ? f[c - 1] : -1;
                    b = e = false
                }
                i = true
            }
        }
        a++
    }
    if (i) {
        this.diff_cleanupMerge(g)
    }
};
diff_match_patch.prototype.diff_cleanupMerge = function (h) {
    h.push([DIFF_EQUAL, ""]);
    var g = 0;
    var f = 0;
    var e = 0;
    var c = "";
    var b = "";
    var a;
    while (g < h.length) {
        switch (h[g][0]) {
            case DIFF_INSERT:
                e++;
                b += h[g][1];
                g++;
                break;
            case DIFF_DELETE:
                f++;
                c += h[g][1];
                g++;
                break;
            case DIFF_EQUAL:
                if (f + e > 1) {
                    if (f !== 0 && e !== 0) {
                        a = this.diff_commonPrefix(b, c);
                        if (a !== 0) {
                            if ((g - f - e) > 0 && h[g - f - e - 1][0] == DIFF_EQUAL) {
                                h[g - f - e - 1][1] += b.substring(0, a)
                            } else {
                                h.splice(0, 0, [DIFF_EQUAL, b.substring(0, a)]);
                                g++
                            }
                            b = b.substring(a);
                            c = c.substring(a)
                        }
                        a = this.diff_commonSuffix(b, c);
                        if (a !== 0) {
                            h[g][1] = b.substring(b.length - a) + h[g][1];
                            b = b.substring(0, b.length - a);
                            c = c.substring(0, c.length - a)
                        }
                    }
                    if (f === 0) {
                        h.splice(g - e, f + e, [DIFF_INSERT, b])
                    } else {
                        if (e === 0) {
                            h.splice(g - f, f + e, [DIFF_DELETE, c])
                        } else {
                            h.splice(g - f - e, f + e, [DIFF_DELETE, c], [DIFF_INSERT, b])
                        }
                    }
                    g = g - f - e + (f ? 1 : 0) + (e ? 1 : 0) + 1
                } else {
                    if (g !== 0 && h[g - 1][0] == DIFF_EQUAL) {
                        h[g - 1][1] += h[g][1];
                        h.splice(g, 1)
                    } else {
                        g++
                    }
                }
                e = 0;
                f = 0;
                c = "";
                b = "";
                break
        }
    }
    if (h[h.length - 1][1] === "") {
        h.pop()
    }
    var d = false;
    g = 1;
    while (g < h.length - 1) {
        if (h[g - 1][0] == DIFF_EQUAL && h[g + 1][0] == DIFF_EQUAL) {
            if (h[g][1].substring(h[g][1].length - h[g - 1][1].length) == h[g - 1][1]) {
                h[g][1] = h[g - 1][1] + h[g][1].substring(0, h[g][1].length - h[g - 1][1].length);
                h[g + 1][1] = h[g - 1][1] + h[g + 1][1];
                h.splice(g - 1, 1);
                d = true
            } else {
                if (h[g][1].substring(0, h[g + 1][1].length) == h[g + 1][1]) {
                    h[g - 1][1] += h[g + 1][1];
                    h[g][1] = h[g][1].substring(h[g + 1][1].length) + h[g + 1][1];
                    h.splice(g + 1, 1);
                    d = true
                }
            }
        }
        g++
    }
    if (d) {
        this.diff_cleanupMerge(h)
    }
};
diff_match_patch.prototype.diff_xIndex = function (g, f) {
    var d = 0;
    var b = 0;
    var e = 0;
    var c = 0;
    var a;
    for (a = 0; a < g.length; a++) {
        if (g[a][0] !== DIFF_INSERT) {
            d += g[a][1].length
        }
        if (g[a][0] !== DIFF_DELETE) {
            b += g[a][1].length
        }
        if (d > f) {
            break
        }
        e = d;
        c = b
    }
    if (g.length != a && g[a][0] === DIFF_DELETE) {
        return c
    }
    return c + (f - e)
};
diff_match_patch.prototype.diff_prettyHtml = function (f) {
    var d = [];
    var h = /&/g;
    var c = /</g;
    var a = />/g;
    var g = /\n/g;
    for (var i = 0; i < f.length; i++) {
        var e = f[i][0];
        var b = f[i][1];
        var j = b.replace(h, "&amp;").replace(c, "&lt;").replace(a, "&gt;").replace(g, "&para;<br>");
        switch (e) {
            case DIFF_INSERT:
                d[i] = '<ins style="background:#e6ffe6;">' + j + "</ins>";
                break;
            case DIFF_DELETE:
                d[i] = '<del style="background:#ffe6e6;">' + j + "</del>";
                break;
            case DIFF_EQUAL:
                d[i] = "<span>" + j + "</span>";
                break
        }
    }
    return d.join("")
};
diff_match_patch.prototype.diff_text1 = function (c) {
    var b = [];
    for (var a = 0; a < c.length; a++) {
        if (c[a][0] !== DIFF_INSERT) {
            b[a] = c[a][1]
        }
    }
    return b.join("")
};
diff_match_patch.prototype.diff_text2 = function (c) {
    var b = [];
    for (var a = 0; a < c.length; a++) {
        if (c[a][0] !== DIFF_DELETE) {
            b[a] = c[a][1]
        }
    }
    return b.join("")
};
diff_match_patch.prototype.diff_levenshtein = function (f) {
    var e = 0;
    var b = 0;
    var d = 0;
    for (var a = 0; a < f.length; a++) {
        var g = f[a][0];
        var c = f[a][1];
        switch (g) {
            case DIFF_INSERT:
                b += c.length;
                break;
            case DIFF_DELETE:
                d += c.length;
                break;
            case DIFF_EQUAL:
                e += Math.max(b, d);
                b = 0;
                d = 0;
                break
        }
    }
    e += Math.max(b, d);
    return e
};
diff_match_patch.prototype.diff_toDelta = function (c) {
    var b = [];
    for (var a = 0; a < c.length; a++) {
        switch (c[a][0]) {
            case DIFF_INSERT:
                b[a] = "+" + encodeURI(c[a][1]);
                break;
            case DIFF_DELETE:
                b[a] = "-" + c[a][1].length;
                break;
            case DIFF_EQUAL:
                b[a] = "=" + c[a][1].length;
                break
        }
    }
    return b.join("\t").replace(/%20/g, " ")
};
diff_match_patch.prototype.diff_fromDelta = function (b, j) {
    var f = [];
    var e = 0;
    var a = 0;
    var h = j.split(/\t/g);
    for (var i = 0; i < h.length; i++) {
        var d = h[i].substring(1);
        switch (h[i].charAt(0)) {
            case"+":
                try {
                    f[e++] = [DIFF_INSERT, decodeURI(d)]
                } catch (g) {
                    throw new Error("Illegal escape in diff_fromDelta: " + d)
                }
                break;
            case"-":
            case"=":
                var c = parseInt(d, 10);
                if (isNaN(c) || c < 0) {
                    throw new Error("Invalid number in diff_fromDelta: " + d)
                }
                var k = b.substring(a, a += c);
                if (h[i].charAt(0) == "=") {
                    f[e++] = [DIFF_EQUAL, k]
                } else {
                    f[e++] = [DIFF_DELETE, k]
                }
                break;
            default:
                if (h[i]) {
                    throw new Error("Invalid diff operation in diff_fromDelta: " + h[i])
                }
        }
    }
    if (a != b.length) {
        throw new Error("Delta length (" + a + ") does not equal source text length (" + b.length + ").")
    }
    return f
};
diff_match_patch.prototype.match_main = function (c, a, b) {
    if (c == null || a == null || b == null) {
        throw new Error("Null input. (match_main)")
    }
    b = Math.max(0, Math.min(b, c.length));
    if (c == a) {
        return 0
    } else {
        if (!c.length) {
            return -1
        } else {
            if (c.substring(b, b + a.length) == a) {
                return b
            } else {
                return this.match_bitap_(c, a, b)
            }
        }
    }
};
diff_match_patch.prototype.match_bitap_ = function (l, t, i) {
    if (t.length > this.Match_MaxBits) {
        throw new Error("Pattern too long for this browser.")
    }
    var m = this.match_alphabet_(t);
    var a = this;

    function b(y, d) {
        var s = y / t.length;
        var j = Math.abs(i - d);
        if (!a.Match_Distance) {
            return j ? 1 : s
        }
        return s + (j / a.Match_Distance)
    }

    var o = this.Match_Threshold;
    var c = l.indexOf(t, i);
    if (c != -1) {
        o = Math.min(b(0, c), o);
        c = l.lastIndexOf(t, i + t.length);
        if (c != -1) {
            o = Math.min(b(0, c), o)
        }
    }
    var v = 1 << (t.length - 1);
    c = -1;
    var f, k;
    var g = t.length + l.length;
    var h;
    for (var u = 0; u < t.length; u++) {
        f = 0;
        k = g;
        while (f < k) {
            if (b(u, i + k) <= o) {
                f = k
            } else {
                g = k
            }
            k = Math.floor((g - f) / 2 + f)
        }
        g = k;
        var e = Math.max(1, i - k + 1);
        var n = Math.min(i + k, l.length) + t.length;
        var p = Array(n + 2);
        p[n + 1] = (1 << u) - 1;
        for (var q = n; q >= e; q--) {
            var w = m[l.charAt(q - 1)];
            if (u === 0) {
                p[q] = ((p[q + 1] << 1) | 1) & w
            } else {
                p[q] = (((p[q + 1] << 1) | 1) & w) | (((h[q + 1] | h[q]) << 1) | 1) | h[q + 1]
            }
            if (p[q] & v) {
                var r = b(u, q - 1);
                if (r <= o) {
                    o = r;
                    c = q - 1;
                    if (c > i) {
                        e = Math.max(1, 2 * i - c)
                    } else {
                        break
                    }
                }
            }
        }
        if (b(u + 1, i) > o) {
            break
        }
        h = p
    }
    return c
};
diff_match_patch.prototype.match_alphabet_ = function (c) {
    var b = {};
    for (var a = 0; a < c.length; a++) {
        b[c.charAt(a)] = 0
    }
    for (var a = 0; a < c.length; a++) {
        b[c.charAt(a)] |= 1 << (c.length - a - 1)
    }
    return b
};
diff_match_patch.prototype.patch_addContext_ = function (f, e) {
    if (e.length == 0) {
        return
    }
    var b = e.substring(f.start2, f.start2 + f.length1);
    var d = 0;
    while (e.indexOf(b) != e.lastIndexOf(b) && b.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin) {
        d += this.Patch_Margin;
        b = e.substring(f.start2 - d, f.start2 + f.length1 + d)
    }
    d += this.Patch_Margin;
    var a = e.substring(f.start2 - d, f.start2);
    if (a) {
        f.diffs.unshift([DIFF_EQUAL, a])
    }
    var c = e.substring(f.start2 + f.length1, f.start2 + f.length1 + d);
    if (c) {
        f.diffs.push([DIFF_EQUAL, c])
    }
    f.start1 -= a.length;
    f.start2 -= a.length;
    f.length1 += a.length + c.length;
    f.length2 += a.length + c.length
};
diff_match_patch.prototype.patch_make = function (o, c, p) {
    var d, k;
    if (typeof o == "string" && typeof c == "string" && typeof p == "undefined") {
        d = (o);
        k = this.diff_main(d, (c), true);
        if (k.length > 2) {
            this.diff_cleanupSemantic(k);
            this.diff_cleanupEfficiency(k)
        }
    } else {
        if (o && typeof o == "object" && typeof c == "undefined" && typeof p == "undefined") {
            k = (o);
            d = this.diff_text1(k)
        } else {
            if (typeof o == "string" && c && typeof c == "object" && typeof p == "undefined") {
                d = (o);
                k = (c)
            } else {
                if (typeof o == "string" && typeof c == "string" && p && typeof p == "object") {
                    d = (o);
                    k = (p)
                } else {
                    throw new Error("Unknown call format to patch_make.")
                }
            }
        }
    }
    if (k.length === 0) {
        return []
    }
    var b = [];
    var e = new diff_match_patch.patch_obj();
    var h = 0;
    var j = 0;
    var i = 0;
    var g = d;
    var m = d;
    for (var n = 0; n < k.length; n++) {
        var f = k[n][0];
        var l = k[n][1];
        if (!h && f !== DIFF_EQUAL) {
            e.start1 = j;
            e.start2 = i
        }
        switch (f) {
            case DIFF_INSERT:
                e.diffs[h++] = k[n];
                e.length2 += l.length;
                m = m.substring(0, i) + l + m.substring(i);
                break;
            case DIFF_DELETE:
                e.length1 += l.length;
                e.diffs[h++] = k[n];
                m = m.substring(0, i) + m.substring(i + l.length);
                break;
            case DIFF_EQUAL:
                if (l.length <= 2 * this.Patch_Margin && h && k.length != n + 1) {
                    e.diffs[h++] = k[n];
                    e.length1 += l.length;
                    e.length2 += l.length
                } else {
                    if (l.length >= 2 * this.Patch_Margin) {
                        if (h) {
                            this.patch_addContext_(e, g);
                            b.push(e);
                            e = new diff_match_patch.patch_obj();
                            h = 0;
                            g = m;
                            j = i
                        }
                    }
                }
                break
        }
        if (f !== DIFF_INSERT) {
            j += l.length
        }
        if (f !== DIFF_DELETE) {
            i += l.length
        }
    }
    if (h) {
        this.patch_addContext_(e, g);
        b.push(e)
    }
    return b
};
diff_match_patch.prototype.patch_deepCopy = function (c) {
    var d = [];
    for (var b = 0; b < c.length; b++) {
        var f = c[b];
        var a = new diff_match_patch.patch_obj();
        a.diffs = [];
        for (var e = 0; e < f.diffs.length; e++) {
            a.diffs[e] = f.diffs[e].slice()
        }
        a.start1 = f.start1;
        a.start2 = f.start2;
        a.length1 = f.length1;
        a.length2 = f.length2;
        d[b] = a
    }
    return d
};
diff_match_patch.prototype.patch_apply = function (a, p) {
    if (a.length == 0) {
        return [p, []]
    }
    a = this.patch_deepCopy(a);
    var c = this.patch_addPadding(a);
    p = c + p + c;
    this.patch_splitMax(a);
    var o = 0;
    var g = [];
    for (var n = 0; n < a.length; n++) {
        var b = a[n].start2 + o;
        var e = this.diff_text1(a[n].diffs);
        var f;
        var k = -1;
        if (e.length > this.Match_MaxBits) {
            f = this.match_main(p, e.substring(0, this.Match_MaxBits), b);
            if (f != -1) {
                k = this.match_main(p, e.substring(e.length - this.Match_MaxBits), b + e.length - this.Match_MaxBits);
                if (k == -1 || f >= k) {
                    f = -1
                }
            }
        } else {
            f = this.match_main(p, e, b)
        }
        if (f == -1) {
            g[n] = false;
            o -= a[n].length2 - a[n].length1
        } else {
            g[n] = true;
            o = f - b;
            var d;
            if (k == -1) {
                d = p.substring(f, f + e.length)
            } else {
                d = p.substring(f, k + this.Match_MaxBits)
            }
            if (e == d) {
                p = p.substring(0, f) + this.diff_text2(a[n].diffs) + p.substring(f + e.length)
            } else {
                var i = this.diff_main(e, d, false);
                if (e.length > this.Match_MaxBits && this.diff_levenshtein(i) / e.length > this.Patch_DeleteThreshold) {
                    g[n] = false
                } else {
                    this.diff_cleanupSemanticLossless(i);
                    var j = 0;
                    var h;
                    for (var m = 0; m < a[n].diffs.length; m++) {
                        var l = a[n].diffs[m];
                        if (l[0] !== DIFF_EQUAL) {
                            h = this.diff_xIndex(i, j)
                        }
                        if (l[0] === DIFF_INSERT) {
                            p = p.substring(0, f + h) + l[1] + p.substring(f + h)
                        } else {
                            if (l[0] === DIFF_DELETE) {
                                p = p.substring(0, f + h) + p.substring(f + this.diff_xIndex(i, j + l[1].length))
                            }
                        }
                        if (l[0] !== DIFF_DELETE) {
                            j += l[1].length
                        }
                    }
                }
            }
        }
    }
    p = p.substring(c.length, p.length - c.length);
    return [p, g]
};
diff_match_patch.prototype.patch_addPadding = function (d) {
    var c = this.Patch_Margin;
    var b = "";
    for (var a = 1; a <= c; a++) {
        b += String.fromCharCode(a)
    }
    for (var a = 0; a < d.length; a++) {
        d[a].start1 += c;
        d[a].start2 += c
    }
    var g = d[0];
    var f = g.diffs;
    if (f.length == 0 || f[0][0] != DIFF_EQUAL) {
        f.unshift([DIFF_EQUAL, b]);
        g.start1 -= c;
        g.start2 -= c;
        g.length1 += c;
        g.length2 += c
    } else {
        if (c > f[0][1].length) {
            var e = c - f[0][1].length;
            f[0][1] = b.substring(f[0][1].length) + f[0][1];
            g.start1 -= e;
            g.start2 -= e;
            g.length1 += e;
            g.length2 += e
        }
    }
    g = d[d.length - 1];
    f = g.diffs;
    if (f.length == 0 || f[f.length - 1][0] != DIFF_EQUAL) {
        f.push([DIFF_EQUAL, b]);
        g.length1 += c;
        g.length2 += c
    } else {
        if (c > f[f.length - 1][1].length) {
            var e = c - f[f.length - 1][1].length;
            f[f.length - 1][1] += b.substring(0, e);
            g.length1 += e;
            g.length2 += e
        }
    }
    return b
};
diff_match_patch.prototype.patch_splitMax = function (a) {
    var i = this.Match_MaxBits;
    for (var l = 0; l < a.length; l++) {
        if (a[l].length1 <= i) {
            continue
        }
        var f = a[l];
        a.splice(l--, 1);
        var c = f.start1;
        var b = f.start2;
        var g = "";
        while (f.diffs.length !== 0) {
            var e = new diff_match_patch.patch_obj();
            var j = true;
            e.start1 = c - g.length;
            e.start2 = b - g.length;
            if (g !== "") {
                e.length1 = e.length2 = g.length;
                e.diffs.push([DIFF_EQUAL, g])
            }
            while (f.diffs.length !== 0 && e.length1 < i - this.Patch_Margin) {
                var h = f.diffs[0][0];
                var k = f.diffs[0][1];
                if (h === DIFF_INSERT) {
                    e.length2 += k.length;
                    b += k.length;
                    e.diffs.push(f.diffs.shift());
                    j = false
                } else {
                    if (h === DIFF_DELETE && e.diffs.length == 1 && e.diffs[0][0] == DIFF_EQUAL && k.length > 2 * i) {
                        e.length1 += k.length;
                        c += k.length;
                        j = false;
                        e.diffs.push([h, k]);
                        f.diffs.shift()
                    } else {
                        k = k.substring(0, i - e.length1 - this.Patch_Margin);
                        e.length1 += k.length;
                        c += k.length;
                        if (h === DIFF_EQUAL) {
                            e.length2 += k.length;
                            b += k.length
                        } else {
                            j = false
                        }
                        e.diffs.push([h, k]);
                        if (k == f.diffs[0][1]) {
                            f.diffs.shift()
                        } else {
                            f.diffs[0][1] = f.diffs[0][1].substring(k.length)
                        }
                    }
                }
            }
            g = this.diff_text2(e.diffs);
            g = g.substring(g.length - this.Patch_Margin);
            var d = this.diff_text1(f.diffs).substring(0, this.Patch_Margin);
            if (d !== "") {
                e.length1 += d.length;
                e.length2 += d.length;
                if (e.diffs.length !== 0 && e.diffs[e.diffs.length - 1][0] === DIFF_EQUAL) {
                    e.diffs[e.diffs.length - 1][1] += d
                } else {
                    e.diffs.push([DIFF_EQUAL, d])
                }
            }
            if (!j) {
                a.splice(++l, 0, e)
            }
        }
    }
};
diff_match_patch.prototype.patch_toText = function (b) {
    var c = [];
    for (var a = 0; a < b.length; a++) {
        c[a] = b[a]
    }
    return c.join("")
};
diff_match_patch.prototype.patch_fromText = function (g) {
    var a = [];
    if (!g) {
        return a
    }
    var h = g.split("\n");
    var j = 0;
    var b = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
    while (j < h.length) {
        var e = h[j].match(b);
        if (!e) {
            throw new Error("Invalid patch string: " + h[j])
        }
        var c = new diff_match_patch.patch_obj();
        a.push(c);
        c.start1 = parseInt(e[1], 10);
        if (e[2] === "") {
            c.start1--;
            c.length1 = 1
        } else {
            if (e[2] == "0") {
                c.length1 = 0
            } else {
                c.start1--;
                c.length1 = parseInt(e[2], 10)
            }
        }
        c.start2 = parseInt(e[3], 10);
        if (e[4] === "") {
            c.start2--;
            c.length2 = 1
        } else {
            if (e[4] == "0") {
                c.length2 = 0
            } else {
                c.start2--;
                c.length2 = parseInt(e[4], 10)
            }
        }
        j++;
        while (j < h.length) {
            var d = h[j].charAt(0);
            try {
                var i = decodeURI(h[j].substring(1))
            } catch (f) {
                throw new Error("Illegal escape in patch_fromText: " + i)
            }
            if (d == "-") {
                c.diffs.push([DIFF_DELETE, i])
            } else {
                if (d == "+") {
                    c.diffs.push([DIFF_INSERT, i])
                } else {
                    if (d == " ") {
                        c.diffs.push([DIFF_EQUAL, i])
                    } else {
                        if (d == "@") {
                            break
                        } else {
                            if (d === "") {
                            } else {
                                throw new Error('Invalid patch mode "' + d + '" in: ' + i)
                            }
                        }
                    }
                }
            }
            j++
        }
    }
    return a
};
diff_match_patch.patch_obj = function () {
    this.diffs = [];
    this.start1 = null;
    this.start2 = null;
    this.length1 = 0;
    this.length2 = 0
};
diff_match_patch.patch_obj.prototype.toString = function () {
    var b, e;
    if (this.length1 === 0) {
        b = this.start1 + ",0"
    } else {
        if (this.length1 == 1) {
            b = this.start1 + 1
        } else {
            b = (this.start1 + 1) + "," + this.length1
        }
    }
    if (this.length2 === 0) {
        e = this.start2 + ",0"
    } else {
        if (this.length2 == 1) {
            e = this.start2 + 1
        } else {
            e = (this.start2 + 1) + "," + this.length2
        }
    }
    var c = ["@@ -" + b + " +" + e + " @@\n"];
    var d;
    for (var a = 0; a < this.diffs.length; a++) {
        switch (this.diffs[a][0]) {
            case DIFF_INSERT:
                d = "+";
                break;
            case DIFF_DELETE:
                d = "-";
                break;
            case DIFF_EQUAL:
                d = " ";
                break
        }
        c[a + 1] = d + encodeURI(this.diffs[a][1]) + "\n"
    }
    return c.join("").replace(/%20/g, " ")
};
this["diff_match_patch"] = diff_match_patch;
this["DIFF_DELETE"] = DIFF_DELETE;
this["DIFF_INSERT"] = DIFF_INSERT;
this["DIFF_EQUAL"] = DIFF_EQUAL;