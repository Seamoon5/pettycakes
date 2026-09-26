/* ============================================================
   PettyCakes — main.js
   1. SHOP CONFIG   <- edit this block to make the site yours
   2. header + mobile nav
   3. scroll reveal
   4. active menu link while scrolling
   5. cake select + "Order this" buttons
   6. order form validation + team notification
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
     it below. Orders will then also arrive in your email.            */
  formspree: "",

  /* minimum notice we accept, in hours */
  minNoticeHours: 48
};

/* ---------------------------------------------------------------
   2. helpers
   --------------------------------------------------------------- */
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

/* ===============================================================
   2. HEADER — add shadow once the page is scrolled
   =============================================================== */
var header = $("#siteHeader");
function onScrollHeader() {
  if (!header) return;
  header.classList.toggle("is-stuck", window.scrollY > 12);
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

  /* close after tapping any link inside the menu */
  $$("a", nav).forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  /* close with Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* close if the screen grows back to desktop width */
  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) closeNav();
  });
}

/* ===============================================================
   3. SCROLL REVEAL — fade + rise as each block enters the screen
   =============================================================== */
var revealables = $$("[data-reveal]");

function showAll() {
  revealables.forEach(function (el) { el.classList.add("is-in"); });
}

if ("IntersectionObserver" in window) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var delay = parseInt(entry.target.getAttribute("data-reveal-delay") || "0", 10);
      window.setTimeout(function () {
        entry.target.classList.add("is-in");
      }, delay);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  revealables.forEach(function (el) { revealObserver.observe(el); });

  /* safety net: never leave content hidden if something goes wrong */
  window.setTimeout(showAll, 3500);
} else {
  showAll();
}

/* ===============================================================
   4. ACTIVE MENU LINK while scrolling
   =============================================================== */
var navLinks = $$(".nav-link");
var sections = navLinks
  .map(function (link) {
    var id = link.getAttribute("href");
    return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
  })
  .filter(Boolean);

function setActiveLink() {
  var probe = window.scrollY + (window.innerHeight * 0.35);
  var currentId = "#home";

  sections.forEach(function (section) {
    if (section.offsetTop <= probe) currentId = "#" + section.id;
  });

  /* bottom of the page always lights up the last link */
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 8) {
    var last = sections[sections.length - 1];
    if (last) currentId = "#" + last.id;
  }

  navLinks.forEach(function (link) {
    link.classList.toggle("is-active", link.getAttribute("href") === currentId);
  });
}
window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("resize", setActiveLink);
setActiveLink();

/* ===============================================================
   5. CAKE SELECT — built from the cake cards, so prices live
   in ONE place only. Edit a card in index.html and both the card
   and this dropdown update.
   =============================================================== */
var cakeSelect = $("#cake");
var cakeHint = $("#cakeHint");
var cards = $$(".cake-card");

if (cakeSelect) {
  cards.forEach(function (card) {
    var name = card.getAttribute("data-cake");
    var price = card.getAttribute("data-price");
    if (!name) return;

    var option = document.createElement("option");
    option.value = name;
    option.textContent = price ? name + " — PKR " + Number(price).toLocaleString("en-PK") : name;
    cakeSelect.appendChild(option);
  });

  cakeSelect.addEventListener("change", function () {
    if (!cakeHint) return;
    var card = cards.filter(function (c) { return c.getAttribute("data-cake") === cakeSelect.value; })[0];
    var price = card ? card.getAttribute("data-price") : null;
    cakeHint.textContent = price
      ? "PKR " + Number(price).toLocaleString("en-PK") + " per cake — final price confirmed by our team."
      : "Pick a cake, or type what you want below.";
    cakeHint.classList.toggle("is-price", !!price);
  });
}

/* "Order this" button -> jump to the form with the cake chosen */
$$(".js-pick").forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (cakeSelect) {
      cakeSelect.value = btn.getAttribute("data-cake") || "";
      cakeSelect.dispatchEvent(new Event("change"));
    }
    var target = $("#order");
    if (target) {
      var top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: top, behavior: "smooth" });
    }
    window.setTimeout(function () {
      var name = $("#name");
      if (name && !name.value) name.focus({ preventScroll: true });
    }, 650);
  });
});

/* ===============================================================
   6. ORDER FORM
   =============================================================== */
var form = $("#orderForm");
var done = $("#orderDone");
var doneText = $("#doneText");
var errorBox = $("#formError");
var submitBtn = $("#submitBtn");
var waLink = $("#waLink");
var againBtn = $("#orderAgain");

/* earliest sensible order date = tomorrow */
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
    var digits = value.replace(/[^\d]/g, "");
    if (digits.length < 10) return "Please enter a full phone number (at least 10 digits).";
  }

  if (input.type === "number" && value) {
    var n = Number(value);
    var min = Number(input.min || 1);
    var max = Number(input.max || 999);
    if (!Number.isFinite(n) || n < min || n > max) {
      return "Please enter a number between " + min + " and " + max + ".";
    }
  }

  if (input.type === "date" && value && input.min && value < input.min) {
    return "We need at least " + SHOP.minNoticeHours + " hours' notice — please pick a later date.";
  }

  return "";
}

/* human-readable name of the field an input belongs to */
function labelFor(input) {
  var wrap = input.closest ? input.closest(".field") : null;
  var label = wrap ? wrap.querySelector("label") : null;
  return label ? label.textContent.trim().replace(/\?$/, "") : "This field";
}

/* check every field, return the list of problems */
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

/* name the field(s) so the buyer knows exactly what to fix */
function showProblems(problems) {
  if (problems.length === 1) {
    showError(problems[0].name + " — " + problems[0].msg);
  } else {
    var names = problems.map(function (p) { return p.name; });
    showError("Please check these: " + names.join(", ") + ".");
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

/* keep the red state and the message in sync while the buyer types */
if (form) {
  ["input", "change"].forEach(function (evt) {
    form.addEventListener(evt, function (e) {
      var t = e.target;
      if (!t || !t.classList || !errorBox || errorBox.hidden) return;

      var problems = collectProblems();
      if (problems.length) {
        showProblems(problems);
      } else {
        hideError();
      }
    });
  });
}

/* build the plain-text order message */
function orderMessage(data) {
  var lines = [
    "New PettyCakes order",
    "------------------------------",
    "Cake    : " + data.cake,
    "Quantity: " + data.qty,
    "Needed  : " + data.dateNeeded,
    "",
    "Name    : " + data.name,
    "Phone   : " + data.phone,
    "Email   : " + data.email
  ];

  if (data.custom) {
    lines.push("", "Customisation:", data.custom);
  }

  return lines.join("\n");
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validate()) return;

    var data = {
      cake:    ($("#cake") && $("#cake").value) || "Not chosen yet",
      qty:     ($("#qty") && $("#qty").value) || "1",
      dateNeeded: ($("#dateNeeded") && $("#dateNeeded").value) || "Not specified",
      name:    ($("#name") && $("#name").value) || "",
      email:   ($("#email") && $("#email").value) || "",
      phone:   ($("#phone") && $("#phone").value) || "",
      custom:  ($("#custom") && $("#custom").value) || ""
    };

    var message = orderMessage(data);
    var buyerName = data.name.split(" ")[0] || "there";

    /* --- optional: forward the order to your email via Formspree --- */
    if (SHOP.formspree) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch(SHOP.formspree, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "New PettyCakes order — " + data.cake + " x" + data.qty,
          message: message,
          cake: data.cake,
          quantity: data.qty,
          date_needed: data.dateNeeded,
          name: data.name,
          email: data.email,
          phone: data.phone,
          customisation: data.custom
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

    /* --- default: no backend, so hand the order over on WhatsApp --- */
    showDone(message, buyerName);
  });
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
    var url = "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(message);
    waLink.setAttribute("href", url);
  }
  if (done) {
    done.scrollIntoView({ behavior: "smooth", block: "center" });
  }
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
        cakeHint.textContent = "Pick a cake, or type what you want below.";
        cakeHint.classList.remove("is-price");
      }
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

/* ===============================================================
   7. FOOTER YEAR
   =============================================================== */
var yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
