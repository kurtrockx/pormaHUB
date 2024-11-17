class ProductModel {
  productFetch = async () => {
    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/model/productsModel.php",
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
      console.log(err);
    }
  };
}

export default new ProductModel ();