import UserModel from "./userModel";

class ProductModel {
  Product = class {
    constructor(product, quantity, size, calculatedPrice) {
      this._id = product._id;
      this.name = product.name;
      this.category = product.category;
      this.price = product.price;
      this.stock = product.stock;
      this.thumbnail = product.thumbnail;
      this.fullQualityPic = product.fullQualityPic;
      this.quantity = quantity;
      this.size = size;
      this.calculatedPrice = calculatedPrice;
    }
  };
  productFetch = async () => {
    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/productsPull.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("No response");
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  async addToCart(user, product) {
    try {
      const response = await fetch(
        "http://localhost/pormaHUB/src/php/addToCart.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "updateCart",
            userId: user._id.$oid,
            cartItem: product,
          }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result.message);
      } else {
        console.error("Error:", result.error || "Failed to update cart");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }

  assignCart() {
    this.cart = UserModel.currentUser.cart;
  }
}

export default new ProductModel();
