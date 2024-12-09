const nav = document.querySelector(".nav");
nav.classList.add("sticky");

document
  .querySelector(".payment-container-background")
  .addEventListener("click", () => {
    document.querySelector(".payment-container").classList.add("gone");
  });
