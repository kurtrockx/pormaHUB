import { hoverProduct } from "../../../public/js/store";
import xIcon from "../../../src/assets/svg/x.svg";

class ProductView {
  productGridContainer;
  searchField;
  searchCategoryButton;
  productModalBackground;
  addToCartButton;
  clearCategoryButton;
  notifList;
  blurBackground;

  constructor() {
    this.productGridContainer = document.querySelector(
      ".product-grid-container"
    );
    this.searchField = document.querySelector(".search-field");
    this.searchCategoryButton = document.querySelectorAll(
      ".search-category-button"
    );
    this.productModalBackground = document.querySelector(
      ".product-modal-background"
    );
    this.clearCategoryButton = document.querySelector(".clear-category-button");
    this.notifList = document.querySelector(".notification-list");
    this.blurBackground = document.querySelector(".blur-background");
  }

  renderProducts(productsArr) {
    this.productGridContainer.innerHTML = "";
    productsArr.forEach((prod) => {
      const html = this.productHTML(
        prod.thumbnail,
        prod.name,
        prod.price,
        prod._id.$oid
      );
      this.productGridContainer.insertAdjacentHTML("beforeend", html);
    });

    hoverProduct();
  }

  productHTML(productThumbnail, productName, productPrice, productID) {
    return `
        <div class="product-container" data-product-id="${productID}">
            <div class="product-background">Add to cart</div>
            <div class="product">
                <img
                    src="${productThumbnail}"
                    class="product-thumbnail-image"
                />
                <div class="product-initial-description">
                    <p class="product-initial-name">${productName}</p>
                    <p class="product-initial-price">P${productPrice}</p>
                </div>
            </div>
        </div>
        `;
  }

  searchInput(searchFunction) {
    this.searchField.addEventListener("input", searchFunction);
  }

  clearCategory(clearCategoryFunction) {
    this.clearCategoryButton.addEventListener("click", clearCategoryFunction);
  }

  categorizeProducts(categoryFunction) {
    this.searchCategoryButton.forEach((btn) =>
      btn.addEventListener("click", categoryFunction)
    );
  }

  productModalHTML(product) {
    return `
        <div class="product-modal-container" data-product-id="${product._id.$oid}">
          <div class="product-modal-image">
            <img src="${product.fullQualityPic}" class="product-full-image" />
          </div>
          <div class="product-modal-details">
            <img src="${xIcon}" class="exit-modal-button" />
            <div class="product-modal-header">${product.name}</div>
            <div class="product-size-radio-container">
              <input type="radio" style="display: none" id="XS" name="size" value="XS" />
              <label class="product-size-radio" for="XS">XS</label>
              <input type="radio" style="display: none" id="S" name="size" value="S" />
              <label class="product-size-radio" for="S">S</label>
              <input type="radio" style="display: none" id="M" name="size" value="M" checked/>
              <label class="product-size-radio" for="M">M</label>
              <input type="radio" style="display: none" id="L" name="size" value="L" />
              <label class="product-size-radio" for="L">L</label>
              <input type="radio" style="display: none" id="XL" name="size" value="XL" />
              <label class="product-size-radio" for="XL">XL</label>
              <input type="radio" style="display: none" id="XXL" name="size" value="XXL" />
              <label class="product-size-radio" for="XXL">XXL</label>
            </div>
            <div class="product-modal-bottom-section">
              <input type="number" class="input-quantity" value="1" min="1" max="${product.stock}"/>
              <button class="add-to-cart-button">ADD TO CART</button>
            </div>
            <div class="size-chart"></div>
          </div>
        </div>
    `;
  }

  setupProductModal(products) {
    document.addEventListener("click", (e) => {
      const data = e.target.closest(".product-container")?.dataset.productId;
      if (!data) return;

      const productMatch = products.find((el) => el._id.$oid === data);
      if (!productMatch) return;

      this.showProductModal(productMatch);
    });
  }

  showProductModal(productMatch) {
    this.productModalBackground.innerHTML = "";
    this.productModalBackground.classList.remove("gone");

    const html = this.productModalHTML(productMatch);
    this.productModalBackground.insertAdjacentHTML("afterbegin", html);
    this.addToCartButton = document.querySelector(".add-to-cart-button");
  }

  closeModalButton(closeModalFunction) {
    this.productModalBackground.addEventListener("click", closeModalFunction);
  }

  addToCart(addToCartFunction) {
    this.productModalBackground.addEventListener("click", addToCartFunction);
  }

  async notifDisplay(notif, type = "red") {
    const delay = () => new Promise((resolve) => setTimeout(resolve, 1500));
    const delayFaster = () =>
      new Promise((resolve) => setTimeout(resolve, 150));

    notif.forEach((notif) => {
      this.blurBackground.classList.remove("gone");
      const html = `${
        type === "red"
          ? `<div class='error'>${notif}</div>`
          : `<div class='notif'>${notif}</div>`
      }`;
      this.notifList.insertAdjacentHTML("beforeend", html);
    });

    await delay();

    this.blurBackground.classList.add("gone");

    await delayFaster();
    this.notifList.innerHTML = "";
  }
}

export default new ProductView();
