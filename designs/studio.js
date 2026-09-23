/* Studio preview: light parallax, photo compare, section highlight. */
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
  if (video) {
    video.muted = true;
    video.defaultMuted = true;
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
          if (!reduce) {
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
    if (reduce) {
      video.removeAttribute("autoplay");
      video.controls = true;
      video.pause();
    } else {
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
    }
  }

  var links = Array.prototype.slice.call(document.querySelectorAll(".mini-nav a"));
  if (!("IntersectionObserver" in window)) return;

  var pairs = links.map(function (link) {
    return { link: link, section: document.querySelector(link.getAttribute("href")) };
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
