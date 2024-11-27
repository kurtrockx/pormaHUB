import CartModel from "../model/cartModel";
import CartView from "../view/cartView";
import UserModel from "../model/userModel";

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

const init = async () => {
  renderCartItems();
  CartView.changeQuantity(changeQuantity);
  spawnCheckoutItems();
  CartView.deleteItem(deleteItem);
};
init();
