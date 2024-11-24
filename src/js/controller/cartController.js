import UserModel from "../model/userModel";
import CartModel from "../model/cartModel";
import CartView from "../view/cartView";

const renderCartItems = async () => {
  const currentCart = await CartModel.setCurrentCart();
  CartView.renderCartItems(currentCart);
};

const changeQuantity = async (e) => {
  const quantityButton = e.target.closest(".quantity-button");
  const inputQuantity = e.target
    .closest(".cart-item")
    .querySelector(".input-quantity");

  if (!quantityButton) return;

  quantityButton.classList.contains("quantity-plus")
    ? inputQuantity.value++
    : inputQuantity.value--;

  const newQuantity = +inputQuantity.value;
  const cartItemId = e.target.closest(".cart-item").dataset.cartItem;

  await CartModel.changeQuantityDB(cartItemId, newQuantity);
};

const init = async () => {
  renderCartItems();
  CartView.changeQuantity(changeQuantity);
};
init();
