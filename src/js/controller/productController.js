import ProductModel from "../model/ProductModel";
import ProductView from "../view/productView";

const modalData = async () => {
  const products = await ProductModel.productFetch();
  document.addEventListener("click", (e) => {
    data = e.target.closest(".product-container")?.dataset.productName;
    if (!data) return;

    const productMatch = products.find((el) => el.name === data);
    console.log(productMatch);
    return productMatch;
  });
};

const searchProduct = async () => {
  try {
    const data = await ProductModel.productFetch();
    if (!data) throw new Error("No data found!");
    const searchTerm = data.filter((p) =>
      p.name.toLowerCase().includes(ProductView.searchField.value)
    );

    const dataWithoutSearchedTerm = data.filter(
      (d) => !d.name.toLowerCase().includes(ProductView.searchField.value)
    );
    const searchResult = [...searchTerm, ...dataWithoutSearchedTerm];
    ProductView.renderProducts(searchResult);
  } catch (err) {
    console.error(err);
  }
};

const initialRenderProducts = async () => {
  try {
    const products = await ProductModel.productFetch();
    ProductView.renderProducts(products);
  } catch (err) {
    console.error("Could not render products");
  }
};

const searchByCategory = async (e) => {
  try {
    const data = await ProductModel.productFetch();
    if (!data) throw new Error("No data fetched");

    const category = e.target.dataset.category;

    const filteredProducts = data.filter((prod) => {
      return prod.category === category;
    });

    ProductView.renderProducts(filteredProducts);
  } catch (err) {
    console.error(err);
  }
};

const init = async () => {
  initialRenderProducts();
  modalData();
  ProductView.searchInput(searchProduct);
  ProductView.categorizeProducts(searchByCategory);
};
init();
