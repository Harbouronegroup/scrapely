/* Pureview Exteriors site script. No dependencies. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Mobile menu */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () { setOpen(!links.classList.contains("is-open")); });
    links.addEventListener("click", function (e) { if (e.target.tagName === "A") setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* Header hides on scroll down, returns on scroll up */
  var header = document.querySelector(".site-header");
  var lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    var menuOpen = links && links.classList.contains("is-open");
    if (header && !menuOpen) header.classList.toggle("is-hidden", y > lastY && y > 400);
    lastY = y;
  }, { passive: true });

  /* Scroll reveal */
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.remove("reveal-init"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    $("[data-reveal]").forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("reveal-init"); io.observe(el); }
    });
  }

  /* 3D tilt on cards (pointer devices only) */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    $(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (x * 9).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-y * 9).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* Before and after sliders */
  $(".ba").forEach(function (fig) {
    var input = fig.querySelector("input[type=range]");
    var stage = fig.querySelector(".ba-stage");
    var set = function () { stage.style.setProperty("--pos", input.value + "%"); };
    input.addEventListener("input", set);
    set();
  });

  /* Copy buttons */
  $(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy");
      var done = function () { var t = b.textContent; b.textContent = "Copied"; setTimeout(function () { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {});
      }
    });
  });

  /* Water canvas: glass droplets and rising bubbles */
  $("canvas[data-water]").forEach(function (cv) {
    var ctx = cv.getContext("2d");
    var w = 0, h = 0, drops = [], running = false, raf = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function size() {
      var r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(46, w / 26));
      drops = [];
      for (var i = 0; i < n; i++) drops.push(make(true));
    }
    function make(anywhere) {
      var bubble = Math.random() < 0.35;
      var r = bubble ? 3 + Math.random() * 9 : 4 + Math.random() * 15;
      return {
        b: bubble, r: r, x: Math.random() * w,
        y: anywhere ? Math.random() * h : (bubble ? h + r : -r),
        v: (bubble ? -1 : 1) * (0.12 + Math.random() * 0.35) * (r / 9),
        p: Math.random() * 6.28, a: 0.35 + Math.random() * 0.5
      };
    }
    function drawOne(d) {
      var x = d.x + Math.sin(d.p) * (d.b ? 6 : 1.5), y = d.y, r = d.r;
      ctx.save();
      ctx.globalAlpha = d.a;
      if (!d.b) { ctx.translate(x, y); ctx.scale(1, 1.18); ctx.translate(-x, -y); }
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,.75)");
      g.addColorStop(0.35, "rgba(160,210,255,.22)");
      g.addColorStop(0.85, "rgba(40,110,220,.18)");
      g.addColorStop(1, "rgba(220,240,255,.55)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.85)";
      ctx.beginPath(); ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.2, r * 0.12, -0.6, 0, 6.2832); ctx.fill();
      ctx.restore();
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        d.y += d.v; d.p += 0.012;
        if (d.y > h + 30 || d.y < -30) drops[i] = make(false);
        drawOne(d);
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    size();
    frame();
    window.addEventListener("resize", function () { size(); if (!running) frame(); });
    if (!reduce && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var on = en[0].isIntersecting;
        if (on && !running) { running = true; raf = requestAnimationFrame(frame); }
        if (!on) { running = false; cancelAnimationFrame(raf); }
      }).observe(cv);
    }
  });

  /* Quote form */
  $("form.quote").forEach(function (form) {
    var msg = form.querySelector(".form-msg");
    var btn = form.querySelector("button[type=submit]");
    var files = form.querySelector("input[type=file]");
    var fileHint = form.querySelector("[data-files]");
    if (files && fileHint) {
      files.addEventListener("change", function () {
        var n = files.files.length;
        fileHint.textContent = n ? n + (n === 1 ? " photo selected" : " photos selected") : "Up to 5 photos, 8MB each.";
      });
    }
    function show(text, bad) { msg.hidden = false; msg.textContent = text; msg.classList.toggle("err", !!bad); msg.focus(); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (files && files.files.length > 5) { show("Please choose 5 photos or fewer.", true); return; }
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = "Sending your request";
      fetch(form.getAttribute("data-endpoint"), { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (j) {
          if (!j || !j.ok) return Promise.reject();
          form.reset();
          if (fileHint) fileHint.textContent = "Up to 5 photos, 8MB each.";
          show("Thank you. Your quote request has been sent and we will be in touch shortly.");
        })
        .catch(function () {
          show("Sorry, your request could not be sent from this page. Please call or text 07743 972243, or email Pureview.exteriors@outlook.com, and we will get straight back to you.", true);
        })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });
})();
