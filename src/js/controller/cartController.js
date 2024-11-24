import UserModel from "../model/userModel";
import CartModel from "../model/cartModel";
import CartView from "../view/cartView";

const renderCartItems = async() => {
  const currentCart = await CartModel.setCurrentCart();
  CartView.renderCartItems(currentCart);
};

const init = async () => {
  renderCartItems();
};
init();
