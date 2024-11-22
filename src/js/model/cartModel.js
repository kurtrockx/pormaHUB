import UserModel from "../model/userModel";

class CartModel {
  currentCart;

  constructor() {
    this.currentCart = UserModel.currentUser.cart;
  }
}
export default new CartModel();
