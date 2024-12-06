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
    const html = `<p class="trending-scroll-text">PORMA</p>`;
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
      question: "What is Porma Hub?",
      answer:
        "Porma Hub is a fashion-forward clothing brand that blends contemporary styles with timeless designs. We offer a wide range of high-quality clothing for men and women, from casual wear to special occasion pieces, all crafted to help you express your unique style.",
    },
    {
      question: "How long does it take to receive my order?",
      answer:
        "Domestic orders typically arrive within 3-7 business days, while international orders may take 7-14 business days, depending on the destination. Delivery times are subject to change based on factors like location and shipping carrier.",
    },
    {
      question: "What is your return and exchange policy?",
      answer:
        "We offer a 30-day return and exchange policy. If you're not completely satisfied with your purchase, you can return unworn, unwashed items with original tags for a refund or exchange. Please refer to our Return & Exchange Policy page for detailed instructions.",
    },
    {
      question: "Do you have a physical store?",
      answer:
        "At the moment, Porma Hub operates exclusively online. However, we are working on opening physical locations in the near future. Stay tuned for announcements!",
    },
    {
      question: "Do you offer custom or personalized items?",
      answer:
        "Currently, we do not offer customization for our items. However, we are exploring this option for future collections. Keep an eye on our website for updates!",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Our sole payment method that is available at the moment is through Paypal Sandbox API",
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
