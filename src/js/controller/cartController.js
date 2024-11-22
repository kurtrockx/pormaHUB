import UserModel from "../model/userModel";
import CartModel from "../model/cartModel";

const init = async () => {
  UserModel.pullUsersFromDB();
  CartModel.currentUserCart();
};
init();
