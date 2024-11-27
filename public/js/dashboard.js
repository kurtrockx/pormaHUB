import downSVG from "../../src/assets/svg/down.svg";

//Navigation
const navbar = document.querySelector(".nav");
//Banner
const banner = document.querySelector(".banner");
const bannerButtonDown = document.querySelector(".banner-button");
const bannerImage = document.querySelector(".banner-image");
const bigTextBanner = document.querySelector(".big-text-banner");
const smallTextBanner = document.querySelector(".small-text-banner");
//Motto and infinite scroll
const motto = document.querySelector(".motto");
const trendingScrollContainer = document.querySelector(".trending-scroll");
//Slider
const slideLeftButton = document.querySelector(".slide-left-button");
const slideRightButton = document.querySelector(".slide-right-button");
const slides = document.querySelectorAll(".slide");
const slidesContainer = document.querySelector(".slides-container");
//FAQs
const questionerContainer = document.querySelector(".questioner-container");

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
    const html = `<p class="trending-scroll-text">BUY NOW</p>`;
    trendingScrollContainer.insertAdjacentHTML("beforeend", html);
  }
};

const bannerTitleTransition = () => {
  const bigTextPromise = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        bigTextBanner.classList.remove("big-text-banner-transition");
        resolve();
      }, 300);
    });

  const smallTextPromise = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        smallTextBanner.classList.remove("small-text-banner-transition");
        resolve();
      }, 300);
    });

  bigTextPromise().then(() => smallTextPromise());
};

const observeNavbar = () => {
  const navbarObserver = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) {
      navbar.classList.add("sticky");
      document.querySelector(".motto-line").classList.add("hide");
    } else {
      navbar.classList.remove("sticky");
      document.querySelector(".motto-line").classList.remove("hide");
    }
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

const frequentlyAskedQuestionToggler = () => {
  const frequentlyAskedQuestions = [
    {
      question: "Bakit may question mark yung header na faqs?",
      answer: "Aba ewan ko ante",
    },
    {
      question: "Kumain kana ba?",
      answer: "Dipa po",
    },
    {
      question: "Ano gusto mo kainin?",
      answer: "Ikaw",
    },
    {
      question: "What if di ka mahal ng mahal mo?",
      answer: "Iyaq",
    },
    {
      question: "What if sinabi kong crush kita?",
      answer: "Edi ang galing",
    },
    {
      question: "What is your name?",
      answer: "Kurt De Belen",
    },
  ];

  document.addEventListener("click", (e) => {
    const clicked = e.target.closest(".question");
    if (!clicked) return;
    const answerContainer = clicked
      .closest(".question-container")
      .querySelector(".answer-container");
    const questionDown = clicked
      .closest(".question-container")
      .querySelector(".question-down");

    document.querySelectorAll(".answer-container").forEach((el) => {
      if (el !== answerContainer) el.classList.remove("answer-show");
    });
    document.querySelectorAll(".question-down").forEach((el) => {
      if (el !== questionDown) el.classList.remove("rotate");
    });
    answerContainer.classList.toggle("answer-show");
    questionDown.classList.toggle("rotate");
  });

  frequentlyAskedQuestions.forEach((q) => {
    const html = `
      <div class="question-container">
        <div class="question">
          ${q.question}
          <img src="${downSVG}" class="question-down"/>
        </div>
        <div class="answer-container">
          <div class="answer"> ${q.answer}</div>
        </div>
      </div>
    `;

    questionerContainer.insertAdjacentHTML("beforeend", html);
  });
};

const setCategory = () => {
  slidesContainer.addEventListener("click", (e) => {
    const category = e.target.closest(".slide")?.dataset.category;
    if (!category) return;
    localStorage.setItem("dashboardCategory", JSON.stringify(category));
  });
};

const init = () => {
  slideFunction();
  trendingScroll();
  bannerTitleTransition();
  observeNavbar();
  setCategory();
  scrollDown();
  frequentlyAskedQuestionToggler();
};

init();
