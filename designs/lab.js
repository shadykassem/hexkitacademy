/* Lab preview gadgets. Client-side only. No booking or payment backend. */
(function () {
  var EARLY = 339;
  var REGULAR = 449;
  var SIBLING_OFF = 50;

  function money(n) {
    return "$" + n;
  }

  var calc = document.querySelector("[data-calculator]");
  if (calc) {
    var tier = "early";
    var students = 1;
    var tierButtons = calc.querySelectorAll("[data-tier]");
    var studentButtons = calc.querySelectorAll("[data-students]");
    var out = {
      tier: calc.querySelector("[data-out='tier']"),
      s1: calc.querySelector("[data-out='s1']"),
      s2: calc.querySelector("[data-out='s2']"),
      total: calc.querySelector("[data-out='total']"),
      row: calc.querySelector("[data-row='s2']")
    };

    function renderCalc() {
      var base = tier === "early" ? EARLY : REGULAR;
      var second = base - SIBLING_OFF;
      var total = students === 2 ? base + second : base;
      out.tier.textContent = tier === "early" ? "Early bird " + money(EARLY) : "Regular " + money(REGULAR);
      out.s1.textContent = money(base);
      out.s2.textContent = money(base) + " minus $" + SIBLING_OFF + " = " + money(second);
      out.total.textContent = money(total);
      out.row.hidden = students !== 2;
    }

    tierButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        tier = button.getAttribute("data-tier");
        tierButtons.forEach(function (item) {
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });
        renderCalc();
      });
    });

    studentButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        students = Number(button.getAttribute("data-students"));
        studentButtons.forEach(function (item) {
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });
        renderCalc();
      });
    });

    renderCalc();
  }

  var seatBoard = document.querySelector("[data-seats]");
  if (seatBoard) {
    var seats = seatBoard.querySelectorAll(".seat");
    var readout = seatBoard.querySelector(".seat-readout");
    seats.forEach(function (seat) {
      seat.addEventListener("click", function () {
        var on = seat.getAttribute("aria-pressed") === "true";
        seats.forEach(function (item) {
          item.setAttribute("aria-pressed", "false");
        });
        if (on) {
          readout.textContent = "No seat selected. A workshop holds 6 students. This board is a room preview, not live inventory.";
          return;
        }
        seat.setAttribute("aria-pressed", "true");
        readout.textContent = "Seat " + seat.textContent.trim() + " of 6. A workshop holds 6 students. This does not reserve a seat.";
      });
    });
  }

  function setFaq(button, open) {
    var panel = document.getElementById(button.getAttribute("aria-controls"));
    var mark = button.querySelector("span");
    button.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    if (mark) mark.textContent = open ? "-" : "+";
  }

  document.querySelectorAll("[data-accordion] .faq-item > button").forEach(function (button) {
    setFaq(button, button.getAttribute("aria-expanded") === "true");
    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      document.querySelectorAll("[data-accordion] .faq-item > button").forEach(function (other) {
        setFaq(other, false);
      });
      if (!open) setFaq(button, true);
    });
  });

  var scrub = document.querySelector("[data-scrub]");
  if (scrub) {
    var tabs = scrub.querySelectorAll("[role='tab']");
    var panels = scrub.querySelectorAll("[role='tabpanel']");
    var range = scrub.querySelector("input[type='range']");

    function showStep(index) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (panel, i) {
        panel.hidden = i !== index;
      });
      range.value = String(index);
      range.setAttribute("aria-valuetext", tabs[index].textContent.trim());
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        showStep(index);
      });
    });

    range.addEventListener("input", function () {
      showStep(Number(range.value));
    });

    showStep(0);
  }

  var compare = document.querySelector("[data-toggle]");
  if (compare) {
    var modes = compare.querySelectorAll("[data-mode]");
    var views = compare.querySelectorAll("[data-view]");
    modes.forEach(function (mode) {
      mode.addEventListener("click", function () {
        var name = mode.getAttribute("data-mode");
        modes.forEach(function (item) {
          item.setAttribute("aria-pressed", item === mode ? "true" : "false");
        });
        views.forEach(function (view) {
          view.hidden = view.getAttribute("data-view") !== name;
        });
      });
    });
  }

  var chips = document.querySelectorAll("[data-pref]");
  var note = document.getElementById("l-note");
  var status = document.querySelector("[data-pref-status]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (item) {
        item.setAttribute("aria-pressed", item === chip ? "true" : "false");
      });
      var pref = chip.getAttribute("data-pref");
      var line = "Timing preference (not a booking): " + pref + ".";
      if (note) {
        var kept = note.value.split("\n").filter(function (row) {
          return row.indexOf("Timing preference (not a booking):") !== 0;
        });
        kept.push(line);
        note.value = kept.join("\n").replace(/^\n+/, "").trim();
      }
      if (status) {
        status.hidden = false;
        status.textContent = pref + " is noted on the waitlist form. This does not reserve a date.";
      }
    });
  });

  var dialog = document.querySelector("dialog.lightbox");
  if (dialog) {
    var lightImg = dialog.querySelector("img");
    var lightCap = dialog.querySelector("p");
    document.querySelectorAll("[data-full]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        lightImg.src = trigger.getAttribute("data-full");
        lightImg.alt = trigger.getAttribute("data-alt") || "";
        lightCap.textContent = trigger.getAttribute("data-caption") || "";
        if (typeof dialog.showModal === "function") dialog.showModal();
      });
    });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".mini-nav a"));
  if ("IntersectionObserver" in window && navLinks.length) {
    var navPairs = navLinks.map(function (link) {
      return { link: link, section: document.querySelector(link.getAttribute("href")) };
    }).filter(function (pair) {
      return pair.section;
    });
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.removeAttribute("aria-current");
        });
        navPairs.forEach(function (pair) {
          if (pair.section === entry.target) pair.link.setAttribute("aria-current", "page");
        });
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });
    navPairs.forEach(function (pair) {
      navObserver.observe(pair.section);
    });
  }
})();
