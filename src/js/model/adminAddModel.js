class AdminAddModel {
  NewProduct = class {
    constructor(name, category, price, stock, fullQualityPic, thumbnail) {
      this.name = name;
      this.category = category;
      this.price = price;
      this.stock = stock;
      this.fullQualityPic = fullQualityPic;
      this.thumbnail = thumbnail;
    }
  };
  async pushProductToDB(product) {
    console.log(product);
    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/productPush.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "add",
            product: product,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to add product");

      const data = await res.json();
      console.log("Product added:", data);
    } catch (err) {
      console.error("Error:", err.message);
    }
  }
}

export default new AdminAddModel();
