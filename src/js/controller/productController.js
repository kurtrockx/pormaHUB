import UserModel from "../model/userModel";
import ProductModel from "../model/productModel";
import ProductView from "../view/productView";

const initialRenderProducts = async () => {
  try {
    const products = await ProductModel.productFetch();
    ProductView.renderProducts(products);
  } catch (err) {
    console.error("Could not render products");
  }
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

const modalData = async () => {
  try {
    const products = await ProductModel.productFetch();
    if (!products)
      throw new Error("No product fetched from productFetch function");

    ProductView.setupProductModal(products);
    closeModal();
  } catch (err) {
    console.error(err);
  }
};

const closeModal = () => {
  ProductView.closeModalButton((e) => {
    const exitModalButton = e.target.closest(".exit-modal-button");
    if (!exitModalButton) return;
    ProductView.productModalBackground.classList.add("gone");
  });
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    ProductView.productModalBackground.classList.add("gone");
  });
};

const addToCart = async () => {
  try {
    const products = await ProductModel.productFetch();

    if (!products) throw new Error("No products fetched");
    ProductView.addToCart((e) => {
      const addToCartButton = e.target.closest(".add-to-cart-button");
      if (!addToCartButton) return;

      if (!UserModel.currentUser) window.location.href = "login.html";

      const productModalContainer = addToCartButton.closest(
        ".product-modal-container"
      );

      const productClicked = productModalContainer?.dataset.productId;

      const productMatch = products.find(
        (prod) => prod._id.$oid === productClicked
      );

      const inputQuantity =
        +productModalContainer.querySelector(".input-quantity").value;

      const sizeRadio =
        productModalContainer.querySelectorAll('input[name="size"]');

      let selectedSize = "M";
      sizeRadio.forEach((r) => {
        if (r.checked) selectedSize = r.value;
      });

      const productToAdd = new ProductModel.Product(
        productMatch,
        inputQuantity,
        selectedSize,
        productMatch.price * inputQuantity
      );
      ProductModel.addToCart(UserModel.currentUser, productToAdd);
    });
  } catch (err) {
    console.err(err);
  }
};

const init = async () => {
  initialRenderProducts();
  modalData();
  addToCart();
  ProductView.searchInput(searchProduct);
  ProductView.categorizeProducts(searchByCategory);
};
init();
