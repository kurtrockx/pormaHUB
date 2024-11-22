import UserModel from "../model/userModel";
import CartModel from "../model/cartModel";
import CartView from "../view/cartView";

const renderCartItems = () => {
  CartView.renderCartItems(CartModel.currentCart);
};

const init = async () => {
  UserModel.pullUsersFromDB();
  renderCartItems();
};
init();
