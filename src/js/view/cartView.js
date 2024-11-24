import xIcon from "../../assets/svg/x.svg";

class CartView {
  cartItemContainer;

  constructor() {
    this.cartItemContainer = document.querySelector(".cart-item-container");
  }

  cartItemHTML(product) {
    return `
    <div class="cart-item" data-cart-item="${product._id.$oid}">
    <div class="cart-item-delete">
        <img src="${xIcon}" class="cart-item-delete-image" />
    </div>
    <div class="cart-item-image-name">
        <img class="cart-item-image" src="${product.thumbnail}" alt="" />
        <div class="cart-item-description">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-size">
            Size: <span id="cart-item-size-bold">${product.size}</span>
        </div>
        </div>
    </div>
    <div class="cart-item-price">P${product.price}</div>
    <div class="cart-item-quantity-container">
        <div class="cart-item-quantity">
        <div class="quantity-button quantity-minus">–</div>
        <input type="number" value="${product.quantity}" class="input-quantity"/>
        <div class="quantity-button quantity-plus">+</div>
        </div>
    </div>
    <div class="cart-item-total-price">P${((product.price * product.quantity).toFixed(2))}</div>
    </div>
        `;
  }
  renderCartItems(products) {
    this.cartItemContainer.innerHTML = "";
    products.forEach((prod) => {
      const html = this.cartItemHTML(prod);
      this.cartItemContainer.insertAdjacentHTML("beforeend", html);
    });
  }

  changeQuantity(changeQuantityFunction) {
    this.cartItemContainer.addEventListener("click", changeQuantityFunction);
  }
}

export default new CartView();
