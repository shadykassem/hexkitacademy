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

  var photo = document.querySelector(".hero-media img");
  if (photo && !reduce && window.matchMedia("(min-width: 800px)").matches) {
    var onScroll = function () {
      var y = Math.min(window.scrollY, 700);
      photo.style.transform = "translate3d(0," + y * 0.16 + "px,0) scale(1.08)";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
