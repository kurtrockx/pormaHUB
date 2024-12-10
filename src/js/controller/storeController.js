import UserModel from "../model/userModel";
import StoreModel from "../model/storeModel";
import StoreView from "../view/storeView";
import CartModel from "../model/cartModel";
import { loadPaypal } from "../paypalSandboxAPI";

const renderProducts = async () => {
  try {
    StoreView.searchCategoryButton.forEach((category) =>
      category.classList.remove("underline")
    );
    const products = await StoreModel.productFetch();
    StoreView.renderProducts(products);
    console.log(products);
  } catch (err) {
    console.error("Could not render products");
  }
};

const initialRenderProducts = async () => {
  try {
    const products = await StoreModel.productFetch();
    StoreView.renderProducts(products);
  } catch (err) {
    console.error("Could not render products");
  }
};

const searchProduct = async () => {
  try {
    StoreView.searchCategoryButton.forEach((category) =>
      category.classList.remove("underline")
    );
    const data = await StoreModel.productFetch();
    if (!data) throw new Error("No data found!");
    const searchTerm = data.filter((p) =>
      p.name.toLowerCase().includes(StoreView.searchField.value)
    );

    const dataWithoutSearchedTerm = data.filter(
      (d) => !d.name.toLowerCase().includes(StoreView.searchField.value)
    );
    const searchResult = [...searchTerm, ...dataWithoutSearchedTerm];
    StoreView.renderProducts(searchResult);
  } catch (err) {
    console.error(err);
  }
};

const searchByCategory = async (e) => {
  try {
    const data = await StoreModel.productFetch();
    if (!data) throw new Error("No data fetched");

    const category = e.target.dataset?.category;
    const allCategories = e.target
      .closest(".search-window")
      ?.querySelectorAll(".search-category-button");

    allCategories.forEach((cat) => cat.classList.remove("underline"));
    e.target.classList.add("underline");

    const filteredProducts = data.filter((prod) => {
      return prod.category === category;
    });

    StoreView.renderProducts(filteredProducts);
  } catch (err) {
    console.error(err);
  }
};

const initCategory = async () => {
  try {
    const initCategory = JSON.parse(localStorage.getItem("dashboardCategory"));
    if (!initCategory) return;

    const data = await StoreModel.productFetch();
    if (!data) throw new Error("No data fetched");

    const filteredProducts = data.filter((prod) => {
      return prod.category === initCategory;
    });

    StoreView.renderProducts(filteredProducts);

    localStorage.removeItem("dashboardCategory");
  } catch (err) {
    console.error(err);
  }
};

const modalData = async () => {
  try {
    const products = await StoreModel.productFetch();
    if (!products)
      throw new Error("No product fetched from productFetch function");

    StoreView.setupProductModal(products);
    closeModal();
  } catch (err) {
    console.error(err);
  }
};

const closeModal = () => {
  StoreView.closeModalButton((e) => {
    const exitModalButton = e.target.closest(".exit-modal-button");
    if (!exitModalButton) return;
    StoreView.productModalBackground.classList.add("gone");
  });
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    StoreView.productModalBackground.classList.add("gone");
  });
};

const checkoutItem = async () => {
  try {
    const products = await StoreModel.productFetch();
    if (!products) throw new Error("No products fetched");

    StoreView.checkout(async (e) => {
      const closeModal = e.target.closest(".buy-now-button");
      if (!closeModal) return;

      const productModalContainer = closeModal.closest(
        ".product-modal-container"
      );

      const productClicked = productModalContainer?.dataset.productId;

      const productMatch = products.find(
        (prod) => prod._id.$oid === productClicked
      );

      if (!UserModel.currentUser) window.location.href = "login.html";

      const inputQuantity =
        +productModalContainer.querySelector(".input-quantity").value;

      const sizeRadio =
        productModalContainer.querySelectorAll('input[name="size"]');

      let selectedSize = "M";
      sizeRadio.forEach((r) => {
        if (r.checked) selectedSize = r.value;
      });

      const productToAdd = new StoreModel.Product(
        productMatch,
        inputQuantity,
        selectedSize
      );

      StoreView.paymentContainer.classList.remove("gone");
      const paypalResponse = await paypalCheckout(
        inputQuantity * productMatch.price
      );

      if (paypalResponse.status === "COMPLETED") {
        const newTransaction = new CartModel.transactionItem(
          paypalResponse.id,
          [productToAdd]
        );
        CartModel.addToPurchaseHistory(newTransaction);
      }
    });
  } catch (err) {
    console.err(err);
  }
};

const addToCart = async () => {
  try {
    const products = await StoreModel.productFetch();

    if (!products) throw new Error("No products fetched");
    StoreView.addToCart((e) => {
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

      const productToAdd = new StoreModel.Product(
        productMatch,
        inputQuantity,
        selectedSize
      );
      if (UserModel.currentUser) {
        StoreModel.addToCart(UserModel.currentUser, productToAdd);
        StoreView.notifDisplay(["Successfully added item(s) to cart"], "green");
      }
    });
  } catch (err) {
    console.err(err);
  }
};

const paypalCheckout = async (totalPrice) => {
  try {
    const paypal = await loadPaypal(
      "AfdEKqsv7BCcy6kJtBp4LzWp0g9ZXDL6PAI78xQ5yvwgpnPpsgbUtCmBXw-88y0nGPP-B_p4Xd1XSTYI"
    );

    return new Promise((resolve, reject) => {
      paypal
        .Buttons({
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [{ amount: { value: totalPrice } }],
            }),
          onApprove: async (data, actions) => {
            try {
              const orderDetails = await actions.order.capture();
              resolve(orderDetails);
            } catch (err) {
              reject("Order capture failed: " + err.message);
            }
          },
          onError: (err) => {
            reject("PayPal error: " + err.message);
          },
        })
        .render(".payment-container-methods");
    });
  } catch (error) {
    console.error("Failed to load PayPal:", error);
    throw error;
  }
};

const closePaypal = () => {
  document
    .querySelector(".payment-container-background")
    .addEventListener("click", () => {
      document.querySelector(".payment-container").classList.add("gone");
      StoreView.paymentContainerMethods.innerHTML = "";
    });
};

const refresh = () => {
  const refreshBack = document
    .querySelector(".refresh-back")
    .addEventListener("click", () => {
      renderProducts();
    });
};

const init = async () => {
  initialRenderProducts();
  initCategory();
  StoreView.clearCategory(renderProducts);
  modalData();
  addToCart();
  StoreView.searchInput(searchProduct);
  StoreView.categorizeProducts(searchByCategory);
  StoreModel.assignCart();
  checkoutItem();
  closePaypal();
  refresh();
};
init();
