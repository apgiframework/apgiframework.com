/* Shared UI enhancements. Self-contained; safe to load on any retained page.
 *
 * Opt-outs (attributes on <body>): data-no-widget, data-no-toc, data-no-top.
 * Public API: window.APGIToast.show(message, { type, duration }).
 */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, text) {
    var node = doc.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      node.setAttribute(k, attrs[k]);
    });
    if (text) node.textContent = text;
    return node;
  }

  /* ---- Toasts (dismissible) ---- */
  var toastHost;
  function show(message, options) {
    options = options || {};
    if (!toastHost) {
      toastHost = el("div", { class: "se-toasts", role: "status", "aria-live": "polite" });
      doc.body.appendChild(toastHost);
    }
    var toast = el("div", { class: "se-toast se-toast--" + (options.type || "info") });
    toast.appendChild(el("span", { class: "se-toast__msg" }, message));
    var close = el("button", { type: "button", class: "se-toast__close", "aria-label": "Dismiss notification" }, "×");
    toast.appendChild(close);
    toastHost.appendChild(toast);

    var timer;
    function dismiss() {
      clearTimeout(timer);
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }
    close.addEventListener("click", dismiss);
    toast.addEventListener("keydown", function (e) {
      if (e.key === "Escape") dismiss();
    });
    var duration = options.duration === undefined ? 6000 : options.duration;
    if (duration > 0) timer = setTimeout(dismiss, duration);
    return dismiss;
  }
  window.APGIToast = { show: show };

  function init() {
    var body = doc.body;
    var path = location.pathname;

    /* ---- Floating actions: back to top (after 300px) + contact ---- */
    var stack = el("div", { class: "se-fab-stack" });
    var top;
    if (!body.hasAttribute("data-no-top")) {
      top = el("button", { type: "button", class: "se-fab se-fab--top se-hidden", "aria-label": "Back to top" }, "↑ Top");
      top.hidden = true;
      top.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
      stack.appendChild(top);
      var onScroll = function () {
        var past = window.scrollY > 300;
        if (past) top.hidden = false;
        top.classList.toggle("se-hidden", !past);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    if (!body.hasAttribute("data-no-widget") && !/\/contact(\.html)?$/.test(path)) {
      var contact = el("a", { class: "se-fab", href: "/contact.html", "aria-label": "Contact us" }, "Contact");
      stack.appendChild(contact);
    }
    if (stack.children.length) body.appendChild(stack);

    /* ---- Code-block copy buttons ---- */
    doc.querySelectorAll("pre").forEach(function (pre) {
      if (pre.querySelector(".se-copy") || !pre.textContent.trim()) return;
      pre.classList.add("se-has-copy");
      var btn = el("button", { type: "button", class: "se-copy", "aria-label": "Copy code to clipboard" }, "Copy");
      btn.addEventListener("click", function () {
        var text = Array.prototype.map
          .call(pre.childNodes, function (n) {
            return n === btn ? "" : n.textContent;
          })
          .join("");
        var done = function (ok) {
          show(ok ? "Code copied to clipboard." : "Copy failed. Select the text and copy it manually.", {
            type: ok ? "success" : "error",
            duration: 3000,
          });
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else {
          done(false);
        }
      });
      pre.appendChild(btn);
    });

    /* ---- Auto-generated table of contents for long pages ---- */
    var main = doc.querySelector("main") || doc.querySelector("article") || doc.body;
    if (main && !body.hasAttribute("data-no-toc") && !main.querySelector("[data-toc], .se-toc")) {
      var pick = function (sel) {
        return Array.prototype.filter.call(main.querySelectorAll(sel), function (h) {
          return h.textContent.trim() && !h.closest("nav, aside, details, .se-faq");
        });
      };
      var headings = pick("h2");
      if (headings.length < 4) headings = pick("h3");
      var words = main.textContent.split(/\s+/).length;
      var h1 = main.querySelector("h1");
      if (headings.length >= 4 && words >= 600 && h1) {
        var used = {};
        var list = el("ol");
        headings.forEach(function (h) {
          if (!h.id) {
            var base = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
            var id = base, n = 2;
            while (doc.getElementById(id) || used[id]) id = base + "-" + n++;
            h.id = id;
          }
          used[h.id] = true;
          var li = el("li");
          li.appendChild(el("a", { href: "#" + h.id }, h.textContent.trim()));
          list.appendChild(li);
        });
        var toc = el("details", { class: "se-toc" });
        toc.open = true;
        toc.appendChild(el("summary", {}, "On this page"));
        var nav = el("nav", { "aria-label": "On this page" });
        nav.appendChild(list);
        toc.appendChild(nav);
        var anchor = h1;
        // Sit after the page's intro block if one directly follows the title.
        while (anchor.nextElementSibling && /^(P|TIME)$/.test(anchor.nextElementSibling.tagName) && anchor.nextElementSibling.className.match(/lede|updated|subtitle/)) {
          anchor = anchor.nextElementSibling;
        }
        anchor.parentNode.insertBefore(toc, anchor.nextSibling);
      }
    }


    /* ---- See also: related pages for research content ---- */
    var related = {
      "/framework-paper.html": ["/liquid-networks-paper.html", "/epistemic-architecture-paper.html", "/how-to-falsify-apgi.html"],
      "/liquid-networks-paper.html": ["/framework-paper.html", "/epistemic-architecture-paper.html", "/apgi_protocol_reference.html"],
      "/epistemic-architecture-paper.html": ["/framework-paper.html", "/how-to-falsify-apgi.html", "/papers-index.html"],
      "/how-to-falsify-apgi.html": ["/apgi_protocol_reference.html", "/framework-paper.html", "/epistemic-architecture-paper.html"],
      "/apgi_protocol_reference.html": ["/how-to-falsify-apgi.html", "/framework-paper.html", "/apgi-experiments.html"],
      "/apgi-experiments.html": ["/apgi_protocol_reference.html", "/apgi-software-system.html", "/how-to-falsify-apgi.html"],
      "/apgi-software-system.html": ["/apgi-experiments.html", "/framework-paper.html", "/app-appendix.html"],
      "/app-appendix.html": ["/apgi-software-system.html", "/papers-index.html", "/framework-paper.html"],
      "/papers-index.html": ["/how-to-falsify-apgi.html", "/apgi_protocol_reference.html", "/about.html"],
      "/about.html": ["/papers-index.html", "/faq.html", "/contact.html"],
      "/faq.html": ["/about.html", "/papers-index.html", "/contact.html"]
    };
    var titles = {
      "/framework-paper.html": "Allostatic Precision-Gating of Conscious Access",
      "/liquid-networks-paper.html": "Conscious Access Through Liquid Network Dynamics",
      "/epistemic-architecture-paper.html": "Epistemic Architecture: Evaluating Theories of Conscious Access",
      "/how-to-falsify-apgi.html": "How to Falsify APGI",
      "/apgi_protocol_reference.html": "Empirical Protocol Reference",
      "/apgi-experiments.html": "Experiment Paradigms",
      "/apgi-software-system.html": "APGI Software System",
      "/app-appendix.html": "Appendix",
      "/papers-index.html": "Research Papers",
      "/about.html": "About APGI",
      "/faq.html": "FAQ",
      "/contact.html": "Contact"
    };
    var key = path.replace(/\/index$/, "");
    var links = related[key];
    if (links && !doc.querySelector(".se-related")) {
      var box = el("aside", { class: "se-related", "aria-labelledby": "se-related-h" });
      box.appendChild(el("h2", { id: "se-related-h" }, "See also"));
      var ul = el("ul");
      links.forEach(function (href) {
        var li = el("li");
        li.appendChild(el("a", { href: href }, titles[href] || href));
        ul.appendChild(li);
      });
      box.appendChild(ul);
      var footer = doc.querySelector("body > footer, footer");
      if (footer && footer.parentNode) footer.parentNode.insertBefore(box, footer);
      else (doc.querySelector("main") || body).appendChild(box);
    }

    /* ---- Last-updated line from <meta name="apgi:last-updated"> ---- */
    var meta = doc.querySelector('meta[name="apgi:last-updated"]');
    if (meta && main && !main.querySelector(".updated, [data-last-updated]")) {
      var d = new Date(meta.content + "T00:00:00Z");
      if (!isNaN(d)) {
        var p = el("p", { class: "updated", "data-last-updated": "" }, "Last updated: ");
        var t = el("time", { datetime: meta.content });
        t.textContent = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
        p.appendChild(t);
        var h = main.querySelector("h1");
        if (h) h.parentNode.insertBefore(p, h.nextSibling);
      }
    }
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
