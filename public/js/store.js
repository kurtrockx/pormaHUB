const productContainer = document.querySelectorAll(".product-container");

const hoverProductHightlight = () => {
  document.addEventListener("mouseover", (e) => {
    const targetProduct = e.target
      .closest(".product-container")
      .querySelector(".product");

    if (!targetProduct) return;

    productContainer.forEach((el) => {
      const product = el.querySelector(".product");
      if (product !== targetProduct) {
        product.classList.remove("productZ");
      }
    });

    targetProduct.classList.add("productZ");
  });
};

hoverProductHightlight();
