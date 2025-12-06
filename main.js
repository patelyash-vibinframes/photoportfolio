(function () {
  const images = (window.PORTFOLIO_IMAGES || []).slice(); // copy to be safe

  const strip = document.getElementById("image-strip");
  const bgImage = document.getElementById("bg-image");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const leftArrow = document.getElementById("arrow-left");
  const rightArrow = document.getElementById("arrow-right");
  const swipeHint = document.getElementById("swipe-hint");

  if (!strip || !images.length) {
    return;
  }

  // Build slides
  images.forEach(function (src) {
    var slide = document.createElement("div");
    slide.className = "image-slide";

    var inner = document.createElement("div");
    inner.className = "image-slide-inner";

    var img = document.createElement("img");
    img.src = src;
    img.alt = "Photograph by Yash Patel";
    img.loading = "lazy";

    inner.appendChild(img);
    slide.appendChild(inner);
    strip.appendChild(slide);

    // Lightbox on click/tap
    img.addEventListener("click", function () {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = src;
      lightbox.classList.remove("hidden");
      document.body.classList.add("no-scroll");
    });
  });

  // Initial background
  if (images[0] && bgImage) {
    bgImage.src = images[0];
  }

  // Lightbox close (tap anywhere or Esc)
  if (lightbox && lightboxImage) {
    lightbox.addEventListener("click", function (e) {
      if (
        e.target === lightbox ||
        e.target === lightboxImage ||
        e.target === lightboxImage.parentElement
      ) {
        lightbox.classList.add("hidden");
        document.body.classList.remove("no-scroll");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
        lightbox.classList.add("hidden");
        document.body.classList.remove("no-scroll");
      }
    });
  }

  // Helper: hide the swipe hint once user interacts
  function hideHint() {
    if (!swipeHint) return;
    swipeHint.classList.add("swipe-hint-hidden");
  }

  if (swipeHint) {
    var hintEvents = ["scroll", "wheel", "touchstart", "mousedown", "keydown"];
    hintEvents.forEach(function (evt) {
      strip.addEventListener(evt, hideHint, { once: true });
    });
  }

  var currentIndex = 0;
  var slideCount = images.length;

  function updateBackground(index) {
    if (!bgImage || !images[index]) return;
    bgImage.style.opacity = "0.4";
    setTimeout(function () {
      bgImage.src = images[index];
      bgImage.style.opacity = "1";
    }, 180);
  }

  function scrollToIndex(index) {
    if (!strip.children.length) return;

    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    currentIndex = index;

    var targetSlide = strip.children[index];
    var left = targetSlide.offsetLeft;

    strip.scrollTo({
      left: left,
      behavior: "smooth",
    });

    updateBackground(index);
  }

  if (leftArrow) {
    leftArrow.addEventListener("click", function () {
      hideHint();
      scrollToIndex(currentIndex - 1);
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", function () {
      hideHint();
      scrollToIndex(currentIndex + 1);
    });
  }

  // Sync background + current index when user scrolls / swipes manually
  var ticking = false;
  strip.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var slides = strip.children;
        if (!slides.length) return;

        var containerCenter = strip.scrollLeft + strip.clientWidth / 2;
        var bestIdx = 0;
        var bestDist = Infinity;

        for (var i = 0; i < slides.length; i++) {
          var slide = slides[i];
          var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
          var dist = Math.abs(slideCenter - containerCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }

        if (bestIdx !== currentIndex) {
          currentIndex = bestIdx;
          updateBackground(currentIndex);
        }

        ticking = false;
      });
      ticking = true;
    }
  });

  // Make sure first slide is nicely centered on load
  window.addEventListener("load", function () {
    scrollToIndex(0);
  });
})();

