import productModel from "../model/productModel";
import ProductView from "../view/productView";

const modalData = (products) => {
  document.addEventListener("click", (e) => {
    const data = e.target.closest(".product-container")?.dataset.productName;
    if (!data) return;

    const productMatch = products.find((el) => el.name === data);
    console.log(productMatch);
    return productMatch;
  });
};

const searchProduct = async () => {
  try {
    ProductView.productGridContainer.innerHTML = "";
    const data = await productModel.productFetch();
    if (!data) throw new Error("No data found!");
    const searchTerm = data.filter((p) =>
      p.name.toLowerCase().includes(ProductView.searchField.value)
    );

    const dataWithoutSearchedTerm = data.filter((d) =>
      !d.name.toLowerCase().includes(ProductView.searchField.value)
    );
    const searchResult = [...searchTerm, ...dataWithoutSearchedTerm];
    console.log(searchResult);

    ProductView.renderProducts(searchResult);
  } catch (err) {
    console.error(err);
  }
};

const init = async () => {
  try {
    const products = await productModel.productFetch(); // Fetch the products
    ProductView.renderProducts(products); // Render the products
    modalData(products); // Pass the products to modalData for click handling
  } catch (err) {
    console.error("Error initializing the application:", err);
  }

  ProductView.searchInput(searchProduct);
};
init();