import { hoverProduct } from "../../../public/js/store";

class ProductView {
  productGridContainer = document.querySelector(".product-grid-container");
  searchField = document.querySelector(".search-field");

  renderProducts(productsArr) {
    productsArr.forEach((prod) => {
      const html = this.productHTML(prod.thumbnail, prod.name, prod.price);
      this.productGridContainer.insertAdjacentHTML("beforeend", html);
    });
    hoverProduct();
  }

  productHTML(productThumbnail, productName, productPrice) {
    return `
        <div class="product-container" data-product-name="${productName}">
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
}

export default new ProductView();
