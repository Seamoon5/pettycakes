/* ============================================================
   PettyCakes — js/main.js
   1. SHOP CONFIG   <- edit this block to make the site yours
   2. header + mobile nav
   3. hero slideshow
   4. scroll reveal
   5. active menu link
   6. THE MENU  (page scroll drives a horizontal cake track)
   7. order form + newsletter
   ============================================================ */

/* ---------------------------------------------------------------
   1. SHOP CONFIG
   WhatsApp number: country code + number, digits only, no "+" and
   no spaces.  Example for +92 300 1234567  ->  "923001234567"
   --------------------------------------------------------------- */
var SHOP = {
  /* your WhatsApp number (digits only) */
  whatsapp: "923001234567",

  /* optional: where Formspree should forward orders.
     Leave empty ("") and the form only shows the WhatsApp button.
     To set it up: create a form at https://formspree.io , copy the
     endpoint (looks like https://formspree.io/f/abcdwxyz) and paste
     it below. Orders will then also arrive in your email.          */
  formspree: "",

  /* minimum notice we accept, in hours */
  minNoticeHours: 48
};

/* ---------------------------------------------------------------
   2. helpers
   --------------------------------------------------------------- */
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function pad2(n) { return (n < 10 ? "0" : "") + n; }
function money(n) { return Number(n).toLocaleString("en-PK"); }

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ===============================================================
   2. HEADER — solid background once the page is scrolled
   =============================================================== */
var header = $("#siteHeader");

function onScrollHeader() {
  if (!header) return;
  header.classList.toggle("is-solid", window.scrollY > 40);
}
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

/* ===============================================================
   2b. MOBILE NAVIGATION
   =============================================================== */
var navToggle = $("#navToggle");
var nav = $("#nav");

function closeNav() {
  if (!nav) return;
  nav.classList.remove("is-open");
  if (navToggle) navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  $$("a", nav).forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) closeNav();
  });
}

/* ===============================================================
   3. HERO SLIDESHOW
   =============================================================== */
(function heroSlides() {
  var hero = $("[data-hero]");
  if (!hero) return;

  var slides = $$("[data-slide]", hero);
  var dotsWrap = $("#heroDots");
  if (slides.length < 2) return;

  var index = 0;
  var timer = null;
  var DELAY = 6000;

  /* the blurred backdrop behind each photo needs the same image URL */
  $$(".slide-media img", hero).forEach(function (img) {
    var media = img.parentNode;
    if (media && img.getAttribute("src")) {
      /* absolute URL: a relative one would resolve against css/ */
      media.style.setProperty("--img", 'url("' + (img.currentSrc || img.src) + '")');
    }
  });

  var dots = slides.map(function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Slide " + (i + 1) + " of " + slides.length);
    b.addEventListener("click", function () { show(i); restart(); });
    if (dotsWrap) dotsWrap.appendChild(b);
    return b;
  });

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
    dots.forEach(function (d, n) {
      d.classList.toggle("is-on", n === index);
      d.setAttribute("aria-selected", n === index ? "true" : "false");
    });
  }

  function start() {
    if (reduceMotion.matches) return;
    stop();
    timer = window.setInterval(function () { show(index + 1); }, DELAY);
  }
  function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }

  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  show(0);
  start();
})();

/* ===============================================================
   4. SCROLL REVEAL
   =============================================================== */
(function reveal() {
  var els = $$("[data-reveal]");

  function showAll() { els.forEach(function (el) { el.classList.add("is-in"); }); }

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    showAll();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var delay = parseInt(entry.target.getAttribute("data-reveal-delay") || "0", 10);
      window.setTimeout(function () { entry.target.classList.add("is-in"); }, delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  els.forEach(function (el) { io.observe(el); });
  window.setTimeout(showAll, 3500); /* safety net */
})();

/* ===============================================================
   5. ACTIVE NAV LINK while scrolling
   =============================================================== */
(function activeLink() {
  var links = $$(".nav-link");
  var sections = links
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  function set() {
    var probe = window.scrollY + window.innerHeight * 0.35;
    var current = "#home";

    sections.forEach(function (s) {
      if (s.offsetTop <= probe) current = "#" + s.id;
    });

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 8) {
      var last = sections[sections.length - 1];
      if (last) current = "#" + last.id;
    }

    links.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === current);
    });
  }

  window.addEventListener("scroll", set, { passive: true });
  window.addEventListener("resize", set);
  set();
})();

/* ===============================================================
   6. THE MENU
   ---------------------------------------------------------------
   Desktop (wide screens): the section is taller than the screen and
   sticks to the top, so scrolling DOWN moves the cake row from right
   to left, one cake at a time. The panel on the right always shows
   the cake that is currently in focus.
   Mobile / reduced motion: the row becomes a normal swipeable
   carousel and the panel below follows whatever is centred.
   =============================================================== */
(function menu() {
  var section = $("[data-menu]");
  if (!section) return;

  var track = $("#menuTrack", section);
  var viewport = $("#menuViewport", section);
  var items = $$(".menu-item", track);
  if (!track || !viewport || !items.length) return;

  var n = items.length;
  var cards = items.map(function (it) { return $(".menu-card", it); });

  var dotsWrap = $("#menuDots", section);
  var panelTotal = $("#panelTotal", section);
  var panelName = $("#panelName", section);
  var panelDesc = $("#panelDesc", section);
  var panelMeta = $("#panelMeta", section);
  var panelPrice = $("#panelPrice", section);
  var panelNum = $("#panelNum", section);
  var panelOrder = $("#panelOrder", section);
  var panelNext = $("#panelNext", section);
  var panel = $(".menu-panel", section);
  var bar = $("#menuProgressBar", section);
  var hint = $("#menuHint", section);

  /* cake data comes straight from the markup, so the card, this
     panel and the order dropdown can never drift apart */
  var data = items.map(function (item, i) {
    var card = cards[i];
    return {
      name: item.getAttribute("data-name") || "",
      price: item.getAttribute("data-price") || "",
      desc: card.getAttribute("data-desc") || "",
      meta: (card.getAttribute("data-meta") || "").split("|").filter(Boolean)
    };
  });

  if (panelTotal) panelTotal.textContent = pad2(n);

  var dots = data.map(function (d, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Show " + d.name);
    b.addEventListener("click", function () { goTo(i, true); });
    if (dotsWrap) dotsWrap.appendChild(b);
    return b;
  });

  var mode = "pinned";   /* "pinned" | "swipe"  */
  var step = 0;          /* distance between two cakes, in px */
  var centreOffset = 0;  /* swipe mode: keeps the focused cake centred */
  var active = -1;
  var ticking = false;

  /* --------------------------------------------------------- measure */
  function measure() {
    var wide = window.innerWidth > 980 && !reduceMotion.matches;
    mode = wide ? "pinned" : "swipe";

    /* offsetWidth (not getBoundingClientRect) because the cards are
       scaled with a transform and that would corrupt the step */
    var cardW = items[0].offsetWidth;
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 24;
    step = cardW + gap;
    centreOffset = Math.max(0, (viewport.clientWidth - cardW) / 2);

    if (mode === "pinned") {
      section.style.height = ((n - 1) * step + window.innerHeight) + "px";
      track.style.transform = "translate3d(0,0,0)";
      viewport.scrollLeft = 0;
      if (hint) hint.textContent = "Keep scrolling to move through the list";
    } else {
      section.style.height = "";
      track.style.transform = "";
      if (hint) hint.textContent = "Swipe the row to see the rest";
    }
  }

  /* Each cake gets a moment of stillness: the row holds with a cake flush
     in the anchor, then glides to the next one. Scroll position is mapped
     through this so the panel and the photo on screen always agree. */
  function easeStep(v) {
    var i = Math.floor(v);
    var f = v - i;
    if (f <= 0.32) return i;
    if (f >= 0.68) return i + 1;
    var u = (f - 0.32) / 0.36;
    return i + u * u * (3 - 2 * u); /* smoothstep */
  }

  /* ---------------------------------------------------------- render */
  function paint(t) {
    var i;

    if (mode === "pinned") {
      track.style.transform = "translate3d(" + (-t * step).toFixed(2) + "px,0,0)";
      if (bar) bar.style.width = (n > 1 ? (t / (n - 1)) * 100 : 100).toFixed(2) + "%";
    } else {
      var max = viewport.scrollWidth - viewport.clientWidth;
      if (bar) bar.style.width = (max > 0 ? (viewport.scrollLeft / max) * 100 : 0).toFixed(2) + "%";
    }

    for (i = 0; i < n; i++) {
      var dist = Math.min(Math.abs(i - t), 1.5);
      items[i].style.transform = "scale(" + (1 - dist * 0.07).toFixed(3) + ")";
      items[i].style.opacity = (1 - Math.min(dist, 1) * 0.3).toFixed(3);
    }

    focus(Math.max(0, Math.min(n - 1, Math.round(t))));
  }

  /* ------------------------------------------------- the right panel */
  function focus(i) {
    if (i === active) return;
    active = i;

    var d = data[i];

    if (panelNum) panelNum.textContent = pad2(i + 1);
    if (panelName) panelName.textContent = d.name;
    if (panelDesc) panelDesc.textContent = d.desc;
    var cur = $(".panel-cur", section);
    if (panelPrice) panelPrice.textContent = d.price ? money(d.price) : "On request";
    if (cur) cur.style.display = d.price ? "" : "none";
    if (panelOrder) panelOrder.setAttribute("data-cake", d.name);

    if (panelMeta) {
      panelMeta.innerHTML = "";
      d.meta.forEach(function (m) {
        var li = document.createElement("li");
        li.textContent = m;
        panelMeta.appendChild(li);
      });
    }

    dots.forEach(function (dot, k) { dot.classList.toggle("is-on", k === i); });
    if (panelNext) panelNext.style.visibility = (i === n - 1) ? "hidden" : "";

    /* replay the entrance animation on the text */
    if (panel && !reduceMotion.matches) {
      panel.classList.remove("is-in");
      void panel.offsetWidth;
      panel.classList.add("is-in");
    }
  }

  /* -------------------------------------------------------- navigate */
  function goTo(i, smooth) {
    i = Math.max(0, Math.min(n - 1, i));
    var behavior = smooth && !reduceMotion.matches ? "smooth" : "auto";

    if (mode === "pinned") {
      var total = section.offsetHeight - window.innerHeight;
      var p = n > 1 ? i / (n - 1) : 0;
      window.scrollTo({ top: Math.round(section.offsetTop + p * total), behavior: behavior });
    } else {
      viewport.scrollTo({
        left: Math.max(0, i * step - centreOffset),
        behavior: behavior
      });
      focus(i);
    }
  }

  /* ------------------------------------------------- page scroll link */
  function onScroll() {
    if (mode !== "pinned") return;

    var rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return; /* off screen */

    var total = section.offsetHeight - window.innerHeight;
    var p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
    paint(easeStep(p * (n - 1)));
  }

  function requestPaint() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      onScroll();
    });
  }

  window.addEventListener("scroll", requestPaint, { passive: true });

  viewport.addEventListener("scroll", function () {
    if (mode !== "swipe") return;
    paint((viewport.scrollLeft + centreOffset) / step);
  }, { passive: true });

  /* ------------------------------------------------------ listeners */
  cards.forEach(function (card, i) {
    if (!card) return;
    card.addEventListener("click", function () { goTo(i, true); });
    card.addEventListener("focus", function () { goTo(i, false); });
  });

  section.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(active + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(active - 1, true); }
  });

  if (panelNext) {
    panelNext.addEventListener("click", function () { goTo(active + 1, true); });
  }

  /* ---------------------------------------------------------- resize */
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      var keep = Math.max(active, 0);
      measure();
      if (mode === "pinned") {
        paint(keep);
      } else {
        viewport.scrollLeft = Math.max(0, keep * step - centreOffset);
        paint(keep);
      }
    }, 160);
  });

  window.addEventListener("load", function () {
    measure();
    if (mode === "pinned") onScroll(); else focus(0);
  });

  /* ------------------------------------------------------------- go */
  measure();
  if (mode === "pinned") onScroll(); else focus(0);
})();

/* ===============================================================
   7. ORDER FORM
   =============================================================== */
var form = $("#orderForm");
var done = $("#orderDone");
var doneText = $("#doneText");
var errorBox = $("#formError");
var submitBtn = $("#submitBtn");
var waLink = $("#waLink");
var againBtn = $("#orderAgain");
var cakeSelect = $("#cake");
var cakeHint = $("#cakeHint");

/* the dropdown is built from the same markup as the menu */
if (cakeSelect) {
  $$("[data-menu] .menu-item").forEach(function (item) {
    var name = item.getAttribute("data-name");
    var price = item.getAttribute("data-price");
    if (!name) return;

    var option = document.createElement("option");
    option.value = name;
    option.textContent = price ? name + " — PKR " + money(price) : name + " — On request";
    cakeSelect.appendChild(option);
  });

  cakeSelect.addEventListener("change", function () {
    if (!cakeHint) return;
    var card = $('[data-name="' + cakeSelect.value + '"]');
    var price = card ? card.getAttribute("data-price") : null;
    cakeHint.textContent = price
      ? "PKR " + money(price) + " per cake — final price confirmed by our team."
      : (card
          ? "Tell us the size, shape and flavour in the customisation box and we will price it."
          : "Pick a cake from the menu above, or type what you want below.");
    cakeHint.classList.toggle("is-price", !!price);
  });
}

/* "Order this cake" — jump to the form with the cake already chosen */
function pickCake(name) {
  if (cakeSelect && name) {
    cakeSelect.value = name;
    cakeSelect.dispatchEvent(new Event("change"));
  }

  var target = $("#order");
  if (target) {
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 80,
      behavior: reduceMotion.matches ? "auto" : "smooth"
    });
  }
  window.setTimeout(function () {
    var name2 = $("#name");
    if (name2 && !name2.value) name2.focus({ preventScroll: true });
  }, reduceMotion.matches ? 60 : 700);
}

var panelOrder = $("#panelOrder");
if (panelOrder) {
  panelOrder.addEventListener("click", function () {
    pickCake(panelOrder.getAttribute("data-cake"));
  });
}

/* earliest sensible order date */
var dateInput = $("#dateNeeded");
if (dateInput) {
  var lead = new Date();
  lead.setDate(lead.getDate() + Math.ceil(SHOP.minNoticeHours / 24));
  var iso = function (d) {
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  };
  dateInput.min = iso(lead);
  if (!dateInput.value) dateInput.value = iso(lead);
}

function fieldError(input) {
  var value = (input.value || "").trim();

  if (input.hasAttribute("required") && !value) return "This field is required.";

  if (input.type === "email" && value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Please enter a valid email address.";
  }

  if (input.type === "tel" && value) {
    if (value.replace(/[^\d]/g, "").length < 10) {
      return "Please enter a full phone number (at least 10 digits).";
    }
  }

  if (input.type === "number" && value) {
    var v = Number(value);
    var min = Number(input.min || 1);
    var max = Number(input.max || 999);
    if (!Number.isFinite(v) || v < min || v > max) {
      return "Please enter a number between " + min + " and " + max + ".";
    }
  }

  if (input.type === "date" && value && input.min && value < input.min) {
    return "We need at least " + SHOP.minNoticeHours + " hours' notice — please pick a later date.";
  }

  return "";
}

function labelFor(input) {
  var wrap = input.closest ? input.closest(".field") : null;
  var label = wrap ? wrap.querySelector("label") : null;
  return label ? label.textContent.trim().replace(/\?$/, "") : "This field";
}

function collectProblems() {
  var problems = [];
  if (!form) return problems;

  $$("input, select, textarea", form).forEach(function (input) {
    var msg = fieldError(input);
    input.classList.toggle("is-bad", !!msg);
    if (msg) problems.push({ input: input, msg: msg, name: labelFor(input) });
  });

  return problems;
}

function showError(msg) {
  if (!errorBox) return;
  errorBox.textContent = msg;
  errorBox.hidden = false;
}
function hideError() {
  if (!errorBox) return;
  errorBox.hidden = true;
  errorBox.textContent = "";
}

function showProblems(problems) {
  if (problems.length === 1) {
    showError(problems[0].name + " — " + problems[0].msg);
  } else {
    showError("Please check these: " + problems.map(function (p) { return p.name; }).join(", ") + ".");
  }
}

function validate() {
  var problems = collectProblems();

  if (!problems.length) {
    hideError();
    return true;
  }

  showProblems(problems);
  problems[0].input.focus({ preventScroll: true });
  return false;
}

if (form) {
  ["input", "change"].forEach(function (evt) {
    form.addEventListener(evt, function (e) {
      var t = e.target;
      if (!t || !t.classList || !errorBox || errorBox.hidden) return;

      var problems = collectProblems();
      if (problems.length) showProblems(problems); else hideError();
    });
  });
}

function orderMessage(d) {
  var lines = [
    "New PettyCakes order",
    "------------------------------",
    "Cake     : " + d.cake,
    "Quantity : " + d.qty,
    "Needed   : " + d.dateNeeded,
    "",
    "Name     : " + d.name,
    "Phone    : " + d.phone,
    "Email    : " + d.email
  ];

  if (d.custom) lines.push("", "Customisation:", d.custom);

  return lines.join("\n");
}

function showDone(message, buyerName) {
  if (form) form.hidden = true;
  if (done) {
    done.hidden = false;
    if (doneText) {
      doneText.textContent =
        "Thank you, " + buyerName + ". Your order for " +
        ((cakeSelect && cakeSelect.value) || "your cake") +
        " is noted. Send it on WhatsApp below and our team will confirm the " +
        "details, the final price and the pickup time.";
    }
  }
  if (waLink) {
    waLink.setAttribute("href",
      "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(message));
  }
  if (done) done.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validate()) return;

    var d = {
      cake: (cakeSelect && cakeSelect.value) || "Not chosen yet",
      qty: ($("#qty") && $("#qty").value) || "1",
      dateNeeded: (dateInput && dateInput.value) || "Not specified",
      name: ($("#name") && $("#name").value) || "",
      email: ($("#email") && $("#email").value) || "",
      phone: ($("#phone") && $("#phone").value) || "",
      custom: ($("#custom") && $("#custom").value) || ""
    };

    var message = orderMessage(d);
    var buyerName = d.name.split(" ")[0] || "there";

    /* optional: forward the order to your email via Formspree */
    if (SHOP.formspree) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch(SHOP.formspree, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "New PettyCakes order — " + d.cake + " x" + d.qty,
          message: message,
          cake: d.cake,
          quantity: d.qty,
          date_needed: d.dateNeeded,
          name: d.name,
          email: d.email,
          phone: d.phone,
          customisation: d.custom
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Bad response " + res.status);
          submitBtn.disabled = false;
          submitBtn.textContent = "Send my order";
          showDone(message, buyerName);
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send my order";
          /* email failed — still show WhatsApp so the order is not lost */
          showDone(message, buyerName);
        });
      return;
    }

    /* default: no backend, so hand the order over on WhatsApp */
    showDone(message, buyerName);
  });
}

if (againBtn) {
  againBtn.addEventListener("click", function () {
    if (done) done.hidden = true;
    if (form) {
      form.hidden = false;
      form.reset();
      if (dateInput) dateInput.value = dateInput.min;
      $$(".is-bad", form).forEach(function (el) { el.classList.remove("is-bad"); });
      hideError();
      if (cakeSelect) cakeSelect.value = "";
      if (cakeHint) {
        cakeHint.textContent = "Pick a cake from the menu above, or type what you want below.";
        cakeHint.classList.remove("is-price");
      }
      form.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
    }
  });
}

/* ===============================================================
   7b. NEWSLETTER (front-end only — connect it to your mail list)
   =============================================================== */
(function newsletter() {
  var newsForm = $("#newsForm");
  var note = $("#newsNote");
  if (!newsForm || !note) return;

  newsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var input = $("#newsEmail");
    var value = (input.value || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      note.textContent = "Please type a valid email address.";
      note.hidden = false;
      return;
    }

    input.value = "";
    note.textContent = "Thanks — you are on the list.";
    note.hidden = false;
  });
})();

/* ===============================================================
   8. FOOTER YEAR
   =============================================================== */
var yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
