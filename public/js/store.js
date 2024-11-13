const productContainer = document.querySelectorAll(".product-container");

const hoverProduct = () => {
  document.addEventListener("mouseover", (e) => {
    const targetProduct = e.target.closest(".product-container");

    productContainer.forEach((el) => {
      el.classList.remove("product-containerZ");
    });
    targetProduct.classList.add("product-containerZ");
  });
};
hoverProduct();
