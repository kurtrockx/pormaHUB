import UserModel from "../model/userModel";

class CartModel {
  async setCurrentCart() {
    const userId = UserModel.currentUser._id.$oid;
    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/cartPull.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) throw new Error("Could not fetch user cart");
      const currentUser = await res.json();
      return currentUser.cart;
    } catch (err) {
      console.error(err);
    }
  }

  async changeQuantityDB(cartItemId, newQuantity) {
    const userId = UserModel.currentUser._id.$oid; // Get the current user's ID
    try {
      const response = await fetch(
        "http://localhost/pormaHUB/src/php/updateCart.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            cartItemId: cartItemId,
            quantity: newQuantity,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}
export default new CartModel();
