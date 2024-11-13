const productGridContainer = document.querySelector(".product-grid-container");
const productContainer = document.querySelectorAll(".product-container");

export const hoverProduct = () => {
  document.addEventListener("mouseover", (e) => {
    const targetProduct = e.target.closest(".product-container");

    if (productContainer.length < 2) return;

    productContainer.forEach((el) => {
      el.classList.remove("product-containerZ");
    });
    targetProduct.classList.add("product-containerZ");
  });
};
