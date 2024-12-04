import CartModel from "../model/cartModel";
import CartView from "../view/cartView";
import UserModel from "../model/userModel";
import { loadPaypal } from "../paypalSandboxAPI";

const checkCurrentUser = () => {
  if (!UserModel.currentUser) window.location.href = "index.html";
};

const renderCartItems = async () => {
  const currentCart = await CartModel.setCurrentCart();
  CartView.renderCartItems(currentCart);
};

const spawnCheckoutItems = async () => {
  const currentCart = await CartModel.setCurrentCart();
  CartView.spawnCheckoutItems(currentCart);
  const allPrices = currentCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  CartView.checkoutTotalPrice.textContent = allPrices.toFixed(2);
};

const changeQuantity = async (e) => {
  const quantityButton = e.target.closest(".quantity-button");
  const inputQuantity = e.target
    .closest(".cart-item")
    ?.querySelector(".input-quantity");

  if (!quantityButton) return;

  quantityButton.classList.contains("quantity-plus")
    ? inputQuantity.value++
    : inputQuantity.value--;

  const initialPriceElement = e.target
    .closest(".cart-item")
    .querySelector(".cart-item-price");

  const totalPrice = e.target
    .closest(".cart-item")
    .querySelector(".cart-item-total-price");

  const initialPrice = parseFloat(initialPriceElement.textContent.slice(1));

  totalPrice.textContent = `P${(+inputQuantity.value * initialPrice).toFixed(
    2
  )}`;

  const newQuantity = +inputQuantity.value;
  const cartItemId = e.target.closest(".cart-item").dataset.cartItem;

  const itemSize = e.target
    .closest(".cart-item")
    ?.querySelector("#cart-item-size-bold")?.textContent;

  await CartModel.changeQuantityDB(cartItemId, itemSize, newQuantity);
  spawnCheckoutItems();
};

const deleteItem = async (e) => {
  const clickedX = e.target.closest(".cart-item-delete");
  if (!clickedX) return;

  const currentCart = await CartModel.setCurrentCart();
  const cartId = clickedX.closest(".cart-item")?.dataset.cartItem;

  const toDeleteItem = currentCart.find((item) => item._id.$oid === cartId);

  const deleted = await CartModel.deleteItem(toDeleteItem);
  if (deleted) {
    clickedX.closest(".cart-item")?.remove();
  }
  spawnCheckoutItems();
};

const paypalCheckout = async () => {
  try {
    const paypal = await loadPaypal(
      "AfdEKqsv7BCcy6kJtBp4LzWp0g9ZXDL6PAI78xQ5yvwgpnPpsgbUtCmBXw-88y0nGPP-B_p4Xd1XSTYI"
    );

    return new Promise((resolve, reject) => {
      paypal
        .Buttons({
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [{ amount: { value: "10.00" } }],
            }),
          onApprove: async (data, actions) => {
            try {
              const orderDetails = await actions.order.capture(); // Capture the order
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

const checkOutItems = async () => {
  try {
    const data = await paypalCheckout();
    console.log(data);
  } catch (err) {
    console.error("Checkout failed:", err.message);
  }
};
const openCheckoutModal = () => {
  CartView.paymentContainer.classList.remove("gone");
};

const init = async () => {
  checkCurrentUser();
  renderCartItems();
  CartView.changeQuantity(changeQuantity);
  spawnCheckoutItems();
  CartView.deleteItem(deleteItem);
  CartView.openCheckoutModal(openCheckoutModal);
  checkOutItems();
};
init();
