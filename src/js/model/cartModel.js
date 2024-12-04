import UserModel from "../model/userModel";

class CartModel {
  transactionItem = class {
    constructor(items) {
      this.date = new Date();
      this.items = items;
      this.status = "PENDING";
    }
  };

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

  async changeQuantityDB(cartItemId, itemSize, newQuantity) {
    const userId = UserModel.currentUser._id.$oid;
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
            itemSize: itemSize,
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

  async deleteItem(toDeleteItem) {
    const userId = UserModel.currentUser._id.$oid;

    const { name, size } = toDeleteItem;

    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/deleteCartItem.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            itemName: name,
            itemSize: size,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        console.error("Failed to delete item:", result.message);
      } else {
        console.log("Item deleted successfully");
        return true;
      }
    } catch (err) {
      console.error("Error deleting item:", err.message);
    }
  }

  async addToPurchaseHistory(purchaseItem) {
    const user = UserModel.currentUser;
    try {
      const response = await fetch(
        "http://localhost/pormaHUB/src/php/addToHistory.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "updatePurchaseHistory",
            userId: user._id.$oid,
            purchaseItem: purchaseItem,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result.message);
      } else {
        console.error(
          "Error:",
          result.error || "Failed to update purchase history"
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }

  async clearCart() {
    const user = UserModel.currentUser;

    try {
      const response = await fetch(
        "http://localhost/pormaHUB/src/php/addToHistory.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "clearCart",
            userId: user._id.$oid,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result.message);
      } else {
        console.error("Error:", result.error || "Failed to clear cart");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }
}
export default new CartModel();
