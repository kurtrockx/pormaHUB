import AdminView from "../view/adminView";
import AdminModel from "../model/adminModel";
import StoreModel from "../model/storeModel";

const renderProducts = (products) => {
  products.forEach((product) => {
    const html = AdminView.productsHTML(product);
    AdminView.productListContainer.insertAdjacentHTML("beforeend", html);
  });
};

const spawnProducts = async () => {
  try {
    const data = await StoreModel.productFetch();
    if (!data) throw new Error("No products fetched");
    renderProducts(data);
  } catch (err) {
    console.error(err.message);
  }
};

const updateQuantity = async (e) => {
  const productClicked =
    e.target.closest(".product-container")?.dataset.productName;

  //CHANGE STOCK
  const stockInput = e.target.closest(".product-stock-value");
  if (stockInput) AdminModel.changeStockDB(productClicked, stockInput.value);

  //DELETE PRODUCT
  const deleteButton = e.target.closest(".delete-product");
  if (deleteButton) {
    AdminModel.deleteProductDB(productClicked);
    AdminView.productListContainer.innerHTML = "";
    spawnProducts();
  }
};

const init = () => {
  spawnProducts();
  AdminView.updateQuantity(updateQuantity);
};
init();
