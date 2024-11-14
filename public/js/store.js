const productGridContainer = document.querySelector(".product-grid-container");

export const hoverProduct = () => {
  productGridContainer.addEventListener("mouseover", (e) => {
    const targetProduct = e.target.closest(".product-container");
    if (!targetProduct) return;
    const productContainer = document.querySelectorAll(".product-container");

    if (productContainer.length === 1) return;

    productContainer.forEach((el) => {
      el.classList.remove("product-containerZ");
    });
    targetProduct.classList.add("product-containerZ");
  });
};
