class AdminView {
  productListContainer;
  searchProductInput;
  logoutButton;

  constructor() {
    this.productListContainer = document.querySelector(
      ".product-list-container"
    );
    this.searchProductInput = document.querySelector(".search-product-input");
  }

  productsHTML(products) {
    return `
            <div class="product-container" data-product-name="${products.name}">
              <div class="product-image">
                <img src="${products.thumbnail}" class="product-image-value" />
              </div>
              <div class="product-name">${products.name}</div>
              <div class="product-category">${products.category}</div>
              <div class="product-price">P${products.price}</div>
              <div class="product-stock">
                <input type="number" class="product-stock-value" value="${products.stock}" />
              </div>
              <button class="delete-product">DELETE</button>
            </div>
        `;
  }

  updateQuantity(updateQuantityFunction) {
    this.productListContainer.addEventListener("click", updateQuantityFunction);
  }

  searchProduct(searchProductFunction) {
    this.searchProductInput.addEventListener("input", searchProductFunction);
  }
}

export default new AdminView();
