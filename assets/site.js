/* Studio page: cobot chapter jumps, family price calculator, photo compare, section highlight. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ba = document.querySelector("[data-compare]");

  if (ba) {
    var range = ba.querySelector("input[type=range]");
    var paint = function () {
      ba.style.setProperty("--pos", range.value + "%");
      range.setAttribute("aria-valuetext", range.value + " percent toward the industrial cell photo");
    };
    paint();
    range.addEventListener("input", paint);
  }

  var video = document.getElementById("cobot-motion");
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-seek]"));
  var narrow = window.matchMedia("(max-width: 640px)").matches;
  if (video) {
    video.muted = true;
    video.defaultMuted = true;
    if (narrow) {
      video.removeAttribute("autoplay");
      video.autoplay = false;
      video.pause();
    }
    var sourceUrl = video.currentSrc || video.getAttribute("src");
    var ensureSeekable = function () {
      var end = video.seekable && video.seekable.length ? video.seekable.end(0) : 0;
      if (end > 1 || video.dataset.blobbed === "1" || !sourceUrl) return;
      video.dataset.blobbed = "1";
      fetch(sourceUrl).then(function (res) { return res.blob(); }).then(function (blob) {
        var resumeAt = video.currentTime || 0;
        video.src = URL.createObjectURL(blob);
        video.addEventListener("loadedmetadata", function () {
          if (resumeAt > 0.2) video.currentTime = resumeAt;
          if (!reduce && !narrow) {
            var again = video.play();
            if (again && again.catch) again.catch(function () {});
          }
        }, { once: true });
      }).catch(function () {});
    };
    video.addEventListener("loadedmetadata", ensureSeekable);
    if (video.readyState >= 1) ensureSeekable();
    var mark = function (active) {
      chips.forEach(function (chip) {
        chip.setAttribute("aria-pressed", chip === active ? "true" : "false");
      });
    };
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var t = parseFloat(chip.getAttribute("data-seek"), 10);
        var go = function () {
          var start = function () {
            var play = video.play();
            if (play && play.catch) play.catch(function () {});
          };
          var onSeeked = function () {
            video.removeEventListener("seeked", onSeeked);
            start();
          };
          video.addEventListener("seeked", onSeeked);
          try {
            video.currentTime = t;
          } catch (err) {
            video.removeEventListener("seeked", onSeeked);
          }
          if (Math.abs(video.currentTime - t) < 0.05) {
            video.removeEventListener("seeked", onSeeked);
            start();
          }
        };
        if (video.readyState >= 1) go();
        else video.addEventListener("loadedmetadata", go, { once: true });
        mark(chip);
      });
    });
    if (reduce || narrow) {
      video.removeAttribute("autoplay");
      video.autoplay = false;
      if (reduce) video.controls = true;
      video.pause();
    } else {
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
    }
  }

  var sticky = document.getElementById("sticky-cta");
  if (sticky && narrow) {
    var dismissed = false;
    try { dismissed = sessionStorage.getItem("hexkit-sticky-cta") === "off"; } catch (err) { dismissed = false; }
    if (dismissed) {
      sticky.hidden = true;
    } else {
      sticky.hidden = false;
      document.body.classList.add("has-sticky-cta");
    }
    var closeSticky = sticky.querySelector(".sticky-cta-close");
    if (closeSticky) {
      closeSticky.addEventListener("click", function () {
        sticky.hidden = true;
        sticky.classList.remove("is-tucked");
        document.body.classList.remove("has-sticky-cta");
        try { sessionStorage.setItem("hexkit-sticky-cta", "off"); } catch (err) {}
      });
    }
    var tuckTargets = [document.querySelector("#waitlist button[type=submit]"), document.querySelector(".site-footer")].filter(Boolean);
    if (!dismissed && tuckTargets.length && "IntersectionObserver" in window) {
      var tucked = new Set();
      var tuck = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) tucked.add(entry.target);
          else tucked.delete(entry.target);
        });
        var hide = tucked.size > 0;
        sticky.classList.toggle("is-tucked", hide);
        document.body.classList.toggle("has-sticky-cta", !hide && !sticky.hidden);
      }, { threshold: 0.15 });
      tuckTargets.forEach(function (target) { tuck.observe(target); });
    }
  }

  var calc = document.querySelector("[data-calculator]");
  if (calc) {
    var EARLY = 339;
    var REGULAR = 449;
    var SIBLING_OFF = 50;
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

    var renderCalc = function () {
      var base = tier === "early" ? EARLY : REGULAR;
      var second = base - SIBLING_OFF;
      var total = students === 2 ? base + second : base;
      out.tier.textContent = tier === "early" ? "Early bird $" + EARLY : "Regular $" + REGULAR;
      out.s1.textContent = "$" + base;
      out.s2.textContent = "$" + base + " minus $" + SIBLING_OFF + " = $" + second;
      out.total.textContent = "$" + total;
      out.row.hidden = students !== 2;
    };

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

  var links = Array.prototype.slice.call(document.querySelectorAll(".mini-nav a"));
  if (!("IntersectionObserver" in window)) return;

  var pairs = links.map(function (link) {
    var href = link.getAttribute("href") || "";
    var section = href.charAt(0) === "#" ? document.querySelector(href) : null;
    return { link: link, section: section };
  }).filter(function (pair) {
    return pair.section;
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        link.removeAttribute("aria-current");
      });
      pairs.forEach(function (pair) {
        if (pair.section === entry.target) pair.link.setAttribute("aria-current", "true");
      });
    });
  }, { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 });

  pairs.forEach(function (pair) {
    observer.observe(pair.section);
  });
})();
