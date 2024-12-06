import AdminView from "../view/adminEditView";
import AdminModel from "../model/adminEditModel";
import StoreModel from "../model/storeModel";
import Swal from "sweetalert2";

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

const showConfirmation = (productClicked) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this product?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteProduct(productClicked);
      Swal.fire("Deleted!", "Successfully deleted product.", "success");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Failed to delete product", "error");
    }
  });
};

const deleteProduct = async (productClicked) => {
  await AdminModel.deleteProductDB(productClicked);
  spawnProducts();
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
    showConfirmation(productClicked);
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
};
init();
