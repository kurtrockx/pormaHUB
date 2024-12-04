import xIcon from "../../assets/svg/x.svg";

class CartView {
  cartItemContainer;
  checkOutItemContainer;
  checkoutTotalPrice;
  checkoutSendButton;
  paymentContainer;
  paymentBackgroundContainer;
  paymentContainerMethods;

  constructor() {
    this.cartItemContainer = document.querySelector(".cart-item-container");
    this.checkOutItemContainer = document.querySelector(
      ".checkout-item-container"
    );
    this.checkoutTotalPrice = document.querySelector(
      ".checkout-send-total-price-value"
    );
    this.checkoutSendButton = document.querySelector(".checkout-send-button");
    this.paymentContainer = document.querySelector(".payment-container");
    this.paymentBackgroundContainer = document.querySelector(
      ".payment-container-background"
    );
    this.paymentContainerMethods = document.querySelector(
      ".payment-container-methods"
    );
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
        <button class="quantity-button quantity-minus">–</button>
        <input type="number" value="${
          product.quantity
        }" class="input-quantity" max="${product.stock}"/>
        <button class="quantity-button quantity-plus">+</button>
        </div>
    </div>
    <div class="cart-item-total-price">P${(
      product.price * product.quantity
    ).toFixed(2)}</div>
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

  deleteItem(deleteItemFunction) {
    this.cartItemContainer.addEventListener("click", deleteItemFunction);
  }

  changeQuantity(changeQuantityFunction) {
    this.cartItemContainer.addEventListener("click", changeQuantityFunction);
  }

  spawnCheckoutItems(checkoutItems) {
    this.checkOutItemContainer.innerHTML = "";
    checkoutItems.forEach((item) => {
      const html = this.checkoutItemHTML(item);
      this.checkOutItemContainer.insertAdjacentHTML("beforeend", html);
    });
  }

  checkoutItemHTML(item) {
    return `
          <div class="checkout-item">
            <div class="checkout-item-quantity">${item.quantity}x</div>
            <div class="checkout-item-name">
              ${item.name} <span id="checkout-item-size">${item.size}</span>
            </div>
            <div class="checkout-item-price">P${(
              item.price * item.quantity
            ).toFixed(2)}</div>
          </div>
    `;
  }

  openCheckoutModal(openCheckoutModalFunction) {
    this.checkoutSendButton.addEventListener(
      "click",
      openCheckoutModalFunction
    );
  }
}

export default new CartView();
