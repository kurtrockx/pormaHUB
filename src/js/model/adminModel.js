class AdminModel {
  async changeStockDB(productName, newStock) {
    try {
      const response = await fetch(
        "http://localhost/pormaHUB/src/php/updateStock.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: productName,
            stock: newStock,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteProductDB(productName) {
    try {
      const response = await fetch(
        "http://localhost/pormaHUB/src/php/deleteProduct.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: productName,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminModel();
