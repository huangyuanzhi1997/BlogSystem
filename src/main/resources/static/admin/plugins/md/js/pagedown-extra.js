(function () {
    var l = new RegExp(["^(<\\/?(a|abbr|acronym|applet|area|b|basefont|", "bdo|big|button|cite|code|del|dfn|em|figcaption|", "font|img|iframe|img|input|ins|kbd|label|map|", "mark|meter|object|param|progress|q|ruby|rp|rt|s|", "samp|script|select|small|span|strike|strong|", "sub|sup|textarea|time|tt|u|var|wbr)[^>]*>|", "<(br)\\s?\\/?>)$"].join(""), "i");
    if (!Array.indexOf) {
        Array.prototype.indexOf = function (s) {
            for (var r = 0; r < this.length; r++) {
                if (this[r] == s) {
                    return r
                }
            }
            return -1
        }
    }

    function d(r) {
        return r.replace(/^\s+|\s+$/g, "")
    }

    function g(r) {
        return r.replace(/\s+$/g, "")
    }

    function k(r) {
        return r.replace(new RegExp("^(\\t|[ ]{1,4})", "gm"), "")
    }

    function e(s, r) {
        return s.indexOf(r) != -1
    }

    function m(r, s) {
        return r.replace(/<[^>]*>?/gi, function (t) {
            return t.match(s) ? t : ""
        })
    }

    function j(r, w) {
        var v = {};
        for (var u = 0; u < r.length; u++) {
            v[r[u]] = r[u]
        }
        for (u = 0; u < w.length; u++) {
            v[w[u]] = w[u]
        }
        var t = [];
        for (var s in v) {
            if (v.hasOwnProperty(s)) {
                t.push(v[s])
            }
        }
        return t
    }

    function p(r) {
        if (r.charAt(0) != "\x02") {
            r = "\x02" + r
        }
        if (r.charAt(r.length - 1) != "\x03") {
            r = r + "\x03"
        }
        return r
    }

    function o(r) {
        if (r.charAt(0) == "\x02") {
            r = r.substr(1)
        }
        if (r.charAt(r.length - 1) == "\x03") {
            r = r.substr(0, r.length - 1)
        }
        return r
    }

    function i(s, r) {
        return m(h(s, r), l)
    }

    function h(t, s) {
        var r = s.blockGamutHookCallback(t);
        r = a(r);
        r = r.replace(/~D/g, "$$").replace(/~T/g, "~");
        r = s.previousPostConversion(r);
        return r
    }

    function c(r) {
        return r.replace(/\\\|/g, "&#124;").replace(/\\:/g, "&#58;")
    }

    function a(r) {
        r = r.replace(/~E(\d+)E/g, function (s, u) {
            var t = parseInt(u);
            return String.fromCharCode(t)
        });
        return r
    }

    function n(r) {
        return r.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "")
    }

    Markdown.Extra = function () {
        this.converter = null;
        this.hashBlocks = [];
        this.footnotes = {};
        this.usedFootnotes = [];
        this.attributeBlocks = false;
        this.googleCodePrettify = false;
        this.highlightJs = false;
        this.tableClass = "";
        this.tabWidth = 4
    };
    Markdown.Extra.init = function (v, t) {
        var r = new Markdown.Extra();
        var w = [];
        var u = [];
        var s = ["unHashExtraBlocks"];
        t = t || {};
        t.extensions = t.extensions || ["all"];
        if (e(t.extensions, "all")) {
            t.extensions = ["tables", "fenced_code_gfm", "def_list", "attr_list", "footnotes", "smartypants"]
        }
        u.push("wrapHeaders");
        if (e(t.extensions, "attr_list")) {
            w.push("hashFcbAttributeBlocks");
            u.push("hashHeaderAttributeBlocks");
            s.push("applyAttributeBlocks");
            r.attributeBlocks = true
        }
        if (e(t.extensions, "fenced_code_gfm")) {
            w.push("fencedCodeBlocks")
        }
        if (e(t.extensions, "tables")) {
            u.push("tables")
        }
        if (e(t.extensions, "def_list")) {
            u.push("definitionLists")
        }
        if (e(t.extensions, "footnotes")) {
            w.push("stripFootnoteDefinitions");
            u.push("doFootnotes");
            s.push("printFootnotes")
        }
        if (e(t.extensions, "smartypants")) {
            s.push("runSmartyPants")
        }
        v.hooks.chain("postNormalization", function (x) {
            return r.doTransform(w, x) + "\n"
        });
        v.hooks.chain("preBlockGamut", function (y, x) {
            r.blockGamutHookCallback = x;
            y = c(y);
            return r.doTransform(u, y) + "\n"
        });
        r.previousPostConversion = v.hooks.postConversion;
        v.hooks.chain("postConversion", function (x) {
            x = r.doTransform(s, x);
            r.hashBlocks = [];
            r.footnotes = {};
            r.usedFootnotes = [];
            return x
        });
        if ("highlighter" in t) {
            r.googleCodePrettify = t.highlighter === "prettify";
            r.highlightJs = t.highlighter === "highlight"
        }
        if ("table_class" in t) {
            r.tableClass = t.table_class
        }
        r.converter = v;
        return r
    };
    Markdown.Extra.prototype.doTransform = function (r, t) {
        for (var s = 0; s < r.length; s++) {
            t = this[r[s]](t)
        }
        return t
    };
    Markdown.Extra.prototype.hashExtraBlock = function (r) {
        return "\n<p>~X" + (this.hashBlocks.push(r) - 1) + "X</p>\n"
    };
    Markdown.Extra.prototype.hashExtraInline = function (r) {
        return "~X" + (this.hashBlocks.push(r) - 1) + "X"
    };
    Markdown.Extra.prototype.unHashExtraBlocks = function (t) {
        var s = this;

        function r() {
            var u = false;
            t = t.replace(/(?:<p>)?~X(\d+)X(?:<\/p>)?/g, function (v, w) {
                u = true;
                var x = parseInt(w, 10);
                return s.hashBlocks[x]
            });
            if (u === true) {
                r()
            }
        }

        r();
        return t
    };
    Markdown.Extra.prototype.wrapHeaders = function (s) {
        function r(t) {
            return "\n" + t + "\n"
        }

        s = s.replace(/^.+[ \t]*\n=+[ \t]*\n+/gm, r);
        s = s.replace(/^.+[ \t]*\n-+[ \t]*\n+/gm, r);
        s = s.replace(/^\#{1,6}[ \t]*.+?[ \t]*\#*\n+/gm, r);
        return s
    };
    Markdown.Extra.prototype.hashHeaderAttributeBlocks = function (v) {
        var w = "\\{\\s*[.|#][^}]+\\}";
        var u = new RegExp("^(#{1,6}.*#{0,6})\\s+(" + w + ")[ \\t]*(\\n|0x03)", "gm");
        var s = new RegExp("^(.*)\\s+(" + w + ")[ \\t]*\\n(?=[\\-|=]+\\s*(\\n|0x03))", "gm");
        var t = this;

        function r(y, z, x) {
            return "<p>~XX" + (t.hashBlocks.push(x) - 1) + "XX</p>\n" + z + "\n"
        }

        v = v.replace(u, r);
        v = v.replace(s, r);
        return v
    };
    Markdown.Extra.prototype.hashFcbAttributeBlocks = function (t) {
        var v = "\\{\\s*[.|#][^}]+\\}";
        var u = new RegExp("^(```[^{\\n]*)\\s+(" + v + ")[ \\t]*\\n(?=([\\s\\S]*?)\\n```\\s*(\\n|0x03))", "gm");
        var s = this;

        function r(x, y, w) {
            return "<p>~XX" + (s.hashBlocks.push(w) - 1) + "XX</p>\n" + y + "\n"
        }

        return t.replace(u, r)
    };
    Markdown.Extra.prototype.applyAttributeBlocks = function (t) {
        var r = this;
        var s = new RegExp('<p>~XX(\\d+)XX</p>[\\s]*(?:<(h[1-6]|pre)(?: +class="(\\S+)")?(>[\\s\\S]*?</\\2>))', "gm");
        t = t.replace(s, function (C, y, F, E, v) {
            if (!F) {
                return ""
            }
            var D = parseInt(y, 10);
            var z = r.hashBlocks[D];
            var u = z.match(/#[^\s{}]+/g) || [];
            var B = u[0] ? ' id="' + u[0].substr(1, u[0].length - 1) + '"' : "";
            var w = z.match(/\.[^\s{}]+/g) || [];
            for (var A = 0; A < w.length; A++) {
                w[A] = w[A].substr(1, w[A].length - 1)
            }
            var x = "";
            if (E) {
                w = j(w, [E])
            }
            if (w.length > 0) {
                x = ' class="' + w.join(" ") + '"'
            }
            return "<" + F + B + x + v
        });
        return t
    };
    Markdown.Extra.prototype.tables = function (v) {
        var s = this;
        var r = new RegExp(["^", "[ ]{0,3}", "[|]", "(.+)\\n", "[ ]{0,3}", "[|]([ ]*[-:]+[-| :]*)\\n", "(", "(?:[ ]*[|].*\\n?)*", ")", "(?:\\n|$)"].join(""), "gm");
        var t = new RegExp(["^", "[ ]{0,3}", "(\\S.*[|].*)\\n", "[ ]{0,3}", "([-:]+[ ]*[|][-| :]*)\\n", "(", "(?:.*[|].*\\n?)*", ")", "(?:\\n|$)"].join(""), "gm");
        v = v.replace(r, u);
        v = v.replace(t, u);

        function u(F, M, B, H, C, w) {
            M = M.replace(/^ *[|]/m, "");
            B = B.replace(/^ *[|]/m, "");
            H = H.replace(/^ *[|]/gm, "");
            M = M.replace(/[|] *$/m, "");
            B = B.replace(/[|] *$/m, "");
            H = H.replace(/[|] *$/gm, "");
            alignspecs = B.split(/ *[|] */);
            align = [];
            for (var N = 0; N < alignspecs.length; N++) {
                var E = alignspecs[N];
                if (E.match(/^ *-+: *$/m)) {
                    align[N] = ' style="text-align:right;"'
                } else {
                    if (E.match(/^ *:-+: *$/m)) {
                        align[N] = ' style="text-align:center;"'
                    } else {
                        if (E.match(/^ *:-+ *$/m)) {
                            align[N] = ' style="text-align:left;"'
                        } else {
                            align[N] = ""
                        }
                    }
                }
            }
            var A = M.split(/ *[|] */);
            var K = A.length;
            var z = s.tableClass ? ' class="' + s.tableClass + '"' : "";
            var I = ["<table", z, ">\n", "<thead>\n", "<tr>\n"].join("");
            for (N = 0; N < K; N++) {
                var x = i(d(A[N]), s);
                I += ["  <th", align[N], ">", x, "</th>\n"].join("")
            }
            I += "</tr>\n</thead>\n";
            var G = H.split("\n");
            for (N = 0; N < G.length; N++) {
                if (G[N].match(/^\s*$/)) {
                    continue
                }
                var D = G[N].split(/ *[|] */);
                var J = K - D.length;
                for (var L = 0; L < J; L++) {
                    D.push("")
                }
                I += "<tr>\n";
                for (L = 0; L < K; L++) {
                    var y = i(d(D[L]), s);
                    I += ["  <td", align[L], ">", y, "</td>\n"].join("")
                }
                I += "</tr>\n"
            }
            I += "</table>\n";
            return s.hashExtraBlock(I)
        }

        return v
    };
    Markdown.Extra.prototype.stripFootnoteDefinitions = function (s) {
        var r = this;
        s = s.replace(/\n[ ]{0,3}\[\^(.+?)\]\:[ \t]*\n?([\s\S]*?)\n{1,2}((?=\n[ ]{0,3}\S)|$)/g, function (t, v, u) {
            v = n(v);
            u += "\n";
            u = u.replace(/^[ ]{0,3}/g, "");
            r.footnotes[v] = u;
            return "\n"
        });
        return s
    };
    Markdown.Extra.prototype.doFootnotes = function (s) {
        var r = this;
        if (r.isConvertingFootnote === true) {
            return s
        }
        var t = 0;
        s = s.replace(/\[\^(.+?)\]/g, function (u, v) {
            var y = n(v);
            var x = r.footnotes[y];
            if (x === undefined) {
                return u
            }
            t++;
            r.usedFootnotes.push(y);
            var w = '<a href="#fn:' + y + '" id="fnref:' + y + '" title="See footnote" class="footnote">' + t + "</a>";
            return r.hashExtraInline(w)
        });
        return s
    };
    Markdown.Extra.prototype.printFootnotes = function (u) {
        var s = this;
        if (s.usedFootnotes.length === 0) {
            return u
        }
        u += '\n\n<div class="footnotes">\n<hr>\n<ol>\n\n';
        for (var t = 0; t < s.usedFootnotes.length; t++) {
            var w = s.usedFootnotes[t];
            var v = s.footnotes[w];
            s.isConvertingFootnote = true;
            var r = i(v, s);
            delete s.isConvertingFootnote;
            u += '<li id="fn:' + w + '">' + r + ' <a href="#fnref:' + w + '" title="Return to article" class="reversefootnote">&#8617;</a></li>\n\n'
        }
        u += "</ol>\n</div>";
        return u
    };
    Markdown.Extra.prototype.fencedCodeBlocks = function (t) {
        function s(u) {
            u = u.replace(/&/g, "&amp;");
            u = u.replace(/</g, "&lt;");
            u = u.replace(/>/g, "&gt;");
            u = u.replace(/~D/g, "$$");
            u = u.replace(/~T/g, "~");
            return u
        }

        var r = this;
        t = t.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function (x, w, v) {
            var B = w, A = v;
            var u = r.googleCodePrettify ? ' class="prettyprint"' : "";
            var z = "";
            if (B) {
                if (r.googleCodePrettify || r.highlightJs) {
                    z = ' class="language-' + B + '"'
                } else {
                    z = ' class="' + B + '"'
                }
            }
            var y = ["<pre", u, "><code", z, ">", s(A), "</code></pre>"].join("");
            return r.hashExtraBlock(y)
        });
        return t
    };
    var q = function (t) {
        var r = "";
        var s = 0;
        t.replace(/(<)([a-zA-Z1-6]+)([^\n]*?>)([\s\S]*?)(<\/\2>)/g, function (w, y, x, v, u, A, z) {
            r += f(t.substring(s, z));
            s = z + w.length;
            if (!/code|kbd|pre|script|noscript|iframe|math|ins|del|pre/i.test(x)) {
                u = q(u)
            }
            r += y + x + v + u + A
        });
        return r + f(t.substring(s))
    };

    function b(r, s) {
        var t = s;
        t = t.replace(/&\#8220;/g, '"');
        t = t.replace(/&\#8221;/g, '"');
        t = t.replace(/&\#8216;/g, "'");
        t = t.replace(/&\#8217;/g, "'");
        t = t.replace(/&\#8212;/g, "---");
        t = t.replace(/&\#8211;/g, "--");
        t = t.replace(/&\#8230;/g, "...");
        return t
    }

    function f(r) {
        r = r.replace(/``/g, "&#8220;").replace(/''/g, "&#8221;");
        r = r.replace(/---/g, "&#8212;").replace(/--/g, "&#8211;");
        r = r.replace(/\.\.\./g, "&#8230;").replace(/\.\s\.\s\./g, "&#8230;");
        r = r.replace(/^'(?=[!"#\$\%'()*+,\-.\/:;<=>?\@\[\\]\^_`{|}~]\B)/g, "&#8216;");
        r = r.replace(/^"(?=[!"#\$\%'()*+,\-.\/:;<=>?\@\[\\]\^_`{|}~]\B)/g, "&#8220;");
        r = r.replace(/^"(?=\w)/g, "&#8220;");
        r = r.replace(/^'(?=\w)/g, "&#8216;");
        r = r.replace(/"'(?=\w)/g, "&#8220;&#8216;");
        r = r.replace(/'"(?=\w)/g, "&#8216;&#8220;");
        r = r.replace(/'(?=\d{2}s)/g, "&#8217;");
        r = r.replace(/(>|\t|\n|\s|&nbsp;|--|&[mn]dash;|&\#8211;|&\#8212;|&\#x201[34];)'(?=\w)/g, "$1&#8216;");
        r = r.replace(/([^<>\\ \t\r\n\[\{\(\-])'(?=\s | s\b)/g, "$1&#8217;");
        r = r.replace(/`/g, "&#8216;").replace(/'/g, "&#8217;");
        r = r.replace(/(>|\t|\n|\s|&nbsp;|--|&[mn]dash;|&\#8211;|&\#8212;|&\#x201[34];)"(?=\w)/g, "$1&#8220;");
        r = r.replace(/([^<>\\ \t\r\n\[\{\(\-])"(?=\s | s\b)/g, "$1&#8221;");
        r = r.replace(/"/ig, "&#8221;");
        return r
    }

    Markdown.Extra.prototype.runSmartyPants = function (r) {
        r = q(r);
        r = r.replace(/(<([a-zA-Z1-6]+)\b([^\n>]*?)(\/)?>)/g, b);
        return r
    };
    Markdown.Extra.prototype.definitionLists = function (t) {
        var s = new RegExp(["(\\x02\\n?|\\n\\n)", "(?:", "(", "(", "[ ]{0,3}", "((?:[ \\t]*\\S.*\\n)+)", "\\n?", "[ ]{0,3}:[ ]+", ")", "([\\s\\S]+?)", "(", "(?=\\0x03)", "|", "(?=", "\\n{2,}", "(?=\\S)", "(?!", "[ ]{0,3}", "(?:\\S.*\\n)+?", "\\n?", "[ ]{0,3}:[ ]+", ")", "(?!", "[ ]{0,3}:[ ]+", ")", ")", ")", ")", ")"].join(""), "gm");
        var r = this;
        t = p(t);
        t = t.replace(s, function (v, x, w) {
            var u = d(r.processDefListItems(w));
            u = "<dl>\n" + u + "\n</dl>";
            return x + r.hashExtraBlock(u) + "\n\n"
        });
        return o(t)
    };
    Markdown.Extra.prototype.processDefListItems = function (s) {
        var t = this;
        var u = new RegExp(["(\\x02\\n?|\\n\\n+)", "(", "[ ]{0,3}", "(?![:][ ]|[ ])", "(?:\\S.*\\n)+?", ")", "(?=\\n?[ ]{0,3}:[ ])"].join(""), "gm");
        var r = new RegExp(["\\n(\\n+)?", "(", "[ ]{0,3}", "[:][ ]+", ")", "([\\s\\S]+?)", "(?=\\n*", "(?:", "\\n[ ]{0,3}[:][ ]|", "<dt>|\\x03", ")", ")"].join(""), "gm");
        s = p(s);
        s = s.replace(/\n{2,}(?=\\x03)/, "\n");
        s = s.replace(u, function (v, A, y) {
            var z = d(y).split("\n");
            var B = "";
            for (var x = 0; x < z.length; x++) {
                var w = z[x];
                w = i(d(w), t);
                B += "\n<dt>" + w + "</dt>"
            }
            return B + "\n"
        });
        s = s.replace(r, function (v, y, w, x) {
            if (y || x.match(/\n{2,}/)) {
                x = Array(w.length + 1).join(" ") + x;
                x = k(x) + "\n\n";
                x = "\n" + h(x, t) + "\n"
            } else {
                x = g(x);
                x = i(k(x), t)
            }
            return "\n<dd>" + x + "</dd>\n"
        });
        return o(s)
    }
})();