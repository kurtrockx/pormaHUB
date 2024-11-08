//DOM ELEMENTS
const navbar = document.querySelector(".nav");
const motto = document.querySelector(".motto");
const banner = document.querySelector(".banner");
const slideLeftButton = document.querySelector(".slide-left-button");
const slideRightButton = document.querySelector(".slide-right-button");
const slides = document.querySelectorAll(".slide");
const trendingScrollContainer = document.querySelector(".trending-scroll");
const bigTextBanner = document.querySelector(".big-text-banner");
const smallTextBanner = document.querySelector(".small-text-banner");
const navlinksBackground = document.querySelector(".navlinks-background");
const navlinksContainer = document.querySelector(".navlinks-container");
const burgerButton = document.querySelector(".nav-burger");
const burgerExitButton = document.querySelector(".burger-exit");
const bannerButtonDown = document.querySelector(".banner-button");
const bannerImage = document.querySelector(".banner-image");

const burgerMenu = () => {
  const burgerMenuOpen = () => {
    navlinksBackground.classList.remove("hidden");
    navlinksContainer.classList.remove("burger-translate");
  };
  const burgerMenuClose = () => {
    navlinksContainer.classList.add("burger-translate");
    navlinksBackground.classList.add("hidden");
  };
  burgerButton.addEventListener("click", burgerMenuOpen);
  [navlinksBackground, burgerExitButton].forEach((el) =>
    el.addEventListener("click", burgerMenuClose)
  );
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      burgerMenuClose();
    }
  });
};

const slideFunction = () => {
  const slideScroll = (currentSlide) => {
    slides.forEach((el) => {
      el.style.translate = `-${currentSlide * 100}% 0`;
    });
  };

  let curSlide = 0;

  const slideEffect = (slidesList) => {
    slidesList.forEach((el) => {
      el.classList.remove("slideOff");
    });
    slidesList[curSlide + 1].classList.add("slideOff");
  };
  slideEffect(slides);

  const slideLeft = () => {
    curSlide--;
    if (curSlide < 0) {
      curSlide = slides.length - 1;
    }

    slideScroll(curSlide);
    slideEffect(slides);
    console.log(curSlide);
  };
  const slideRight = () => {
    curSlide++;
    if (curSlide === slides.length) {
      curSlide = 0;
    }

    slideScroll(curSlide);
    slideEffect(slides);
    console.log(curSlide);
  };

  slideLeftButton.addEventListener("click", slideLeft);
  slideRightButton.addEventListener("click", slideRight);
};

const trendingScroll = () => {
  for (let x = 0; x < 20; x++) {
    const html = `<p class="trending-scroll-text">TRENDING!</p>`;
    trendingScrollContainer.insertAdjacentHTML("beforeend", html);
  }
};

const bannerTitleTransition = () => {
  const bigTextPromise = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        bigTextBanner.classList.remove("big-text-banner-transition");
        resolve();
      }, 500);
    });

  const smallTextPromise = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        smallTextBanner.classList.remove("small-text-banner-transition");
        resolve();
      }, 200);
    });

  bigTextPromise().then(() => smallTextPromise());
};

const observeNavbar = () => {
  const navbarObserver = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) {
      navbar.classList.add("sticky");
    } else navbar.classList.remove("sticky");
  };

  const observer = new IntersectionObserver(navbarObserver, {
    root: null, //WHAT IS GOING TO INTERSECT ANOTHER ELEMENT (ROOT MEANS WINDOW)
    threshold: 0, //ELEMENT VISIBLE SOMEWHAT
  });
  observer.observe(banner);
};

const scrollDown = () => {
  bannerButtonDown.addEventListener("click", () => {
    motto.scrollIntoView({ behavior: "smooth" });
  });
};
scrollDown();

const init = () => {
  burgerMenu();
  slideFunction();
  trendingScroll();
  bannerTitleTransition();
  observeNavbar();
};

init();
