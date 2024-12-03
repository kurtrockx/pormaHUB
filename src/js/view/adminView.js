class AdminView {
  productListContainer;

  constructor() {
    this.productListContainer = document.querySelector(
      ".product-list-container"
    );
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
}

export default new AdminView();
