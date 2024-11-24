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
}
export default new CartModel();
