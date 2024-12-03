import AdminView from "../view/adminEditView";
import AdminModel from "../model/adminEditModel";
import StoreModel from "../model/storeModel";
import UserModel from "../model/userModel";

const renderProducts = (products) => {
  AdminView.productListContainer.innerHTML = "";
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
    await AdminModel.deleteProductDB(productClicked);
    spawnProducts();
  }
};

const searchProduct = async () => {
  try {
    const data = await StoreModel.productFetch();
    if (!data) throw new Error("No data found!");

    const searchTerm = data.filter((product) =>
      product.name.toLowerCase().includes(AdminView.searchProductInput.value)
    );

    const dataWithoutSearchedTerm = data.filter(
      (notIncluded) =>
        !notIncluded.name
          .toLowerCase()
          .includes(AdminView.searchProductInput.value)
    );
    const searchResult = [...searchTerm, ...dataWithoutSearchedTerm];

    renderProducts(searchResult);
  } catch (err) {
    console.error(err);
  }
};

const init = () => {
  spawnProducts();
  AdminView.updateQuantity(updateQuantity);
  AdminView.searchProduct(searchProduct);
  uploadProductPicture();
};
init();
