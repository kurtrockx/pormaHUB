const uploadProductPicture = async () => {
  const imageInput = document.getElementById("imageInput");
  const uploadButton = document.getElementById("uploadButton");
  const statusElement = document.getElementById("status");
  const imageUrlElement = document.getElementById("imageUrl");
  const apiKey = "5847a1fb342e1994812f748886598a1b";
  // Event listener for upload button
  uploadButton.addEventListener("click", async () => {
    const file = imageInput.files[0]; // Get the selected file

    if (!file) {
      alert("Please select an image to upload!");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      statusElement.textContent = "Error uploading image.";
      console.error(error);
    }
  });
};

const init = () => {
  uploadProductPicture();
};

init();
