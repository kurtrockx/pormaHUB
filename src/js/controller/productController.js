import products from "../../../public/products.json";
import productView from "../view/productView";

const modalData = () => {
  document.addEventListener("click", (e) => {
    const data = e.target.closest(".product-container")?.dataset.productName;
    if (!data) return;

    const productMatch = products.find((el) => el.name === data);
    console.log(productMatch);
    return productMatch;
  });
};

const init = () => {
  productView.renderProducts(products);
  modalData();
};
init();
