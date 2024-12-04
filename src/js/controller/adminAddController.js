import AdminAddModel from "../model/adminAddModel";
import AdminAddView from "../view/adminAddView";

const uploadProductPicture = async (file) => {
  const apiKey = "5847a1fb342e1994812f748886598a1b";
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(
        "Image upload failed: " +
          (data.error ? data.error.message : "Unknown error")
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const handleImagePreview = () => {
  const imageInput = document.querySelector(".imageInput");

  imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];
    if (file) {
      try {
        const data = await uploadProductPicture(file);
        const imageUrl = data.data.image.url;
        document.querySelector(".add-image-value").src = imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  });
};

const insertNewProduct = async () => {
  const errors = [];

  const name = AdminAddView.productName.value;
  const category = AdminAddView.productCategory.value;
  const price = AdminAddView.productPrice.value;
  const stock = AdminAddView.productStock.value;

  const imageInput = document.querySelector(".imageInput");
  const file = imageInput.files[0];

  // Check if fields are filled
  if (name === "" || category === "" || price === "" || stock === "") {
    errors.push("Fill up empty fields.");
  }

  if (!file) {
    errors.push("Product image is required.");
  }

  try {
    let fullQualityPic = "";
    let thumbnail = "";

    if (!errors.length) {
      try {
        const data = await uploadProductPicture(file);
        fullQualityPic = data.data.image.url;
        thumbnail = data.data.thumb.url;
      } catch (err) {
        errors.push("Failed to upload product image.");
        console.error("Error uploading image:", err);
      }
    }

    // If there are any errors, display them
    if (errors.length > 0) {
      AdminAddView.notifDisplay(errors);
      return;
    }

    const newProduct = new AdminAddModel.NewProduct(
      name,
      category,
      price,
      stock,
      fullQualityPic,
      thumbnail
    );

    try {
      await AdminAddModel.pushProductToDB(newProduct);
      AdminAddView.notifDisplay(["Product added successfully"], "green");
    } catch (err) {
      errors.push("Failed to add product to the database.");
      console.error("Error adding product to DB:", err);
    }

    if (errors.length > 0) {
      AdminAddView.notifDisplay(errors);
    }
  } catch (err) {
    // Catch unexpected errors
    console.error("Unexpected error:", err);
    errors.push("An unexpected error occurred.");
    AdminAddView.notifDisplay(errors);
  }
};

const init = () => {
  handleImagePreview();
  AdminAddView.addProductToDB(insertNewProduct);
};

init();
