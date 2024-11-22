import UserModel from "../model/userModel";

class CartModel {
  currentUserCart() {
    console.log(UserModel.currentUser);
    console.log(UserModel.users);
  }
}
export default new CartModel();
