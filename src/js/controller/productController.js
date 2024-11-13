import products from "../../../public/products.json";
import productView from "../view/productView";

const init = () => {
  productView.renderProducts(products);
  productView.hoverProduct();
};
init();
