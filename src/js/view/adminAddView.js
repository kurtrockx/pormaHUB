class AdminAddView {
  productName;
  productCategory;
  productPrice;
  productStock;
  productImage;
  addProductButton;
  notifList;
  blurBackground;

  constructor() {
    this.productName = document.querySelector(".name-input");
    this.productCategory = document.querySelector(".category-input");
    this.productPrice = document.querySelector(".price-input");
    this.productStock = document.querySelector(".stock-input");
    this.productImage = document.querySelector(".imageInput");
    this.addProductButton = document.querySelector(".add-product-button");
    this.notifList = document.querySelector(".notification-list");
    this.blurBackground = document.querySelector(".blur-background");
  }

  addProductToDB(addProductFunction) {
    this.addProductButton.addEventListener("click", addProductFunction);
  }

  async notifDisplay(notif, type = "red") {
    const delay = () => new Promise((resolve) => setTimeout(resolve, 1500));
    const delayFaster = () =>
      new Promise((resolve) => setTimeout(resolve, 150));

    notif.forEach((notif) => {
      this.blurBackground.classList.remove("gone");
      const html = `${
        type === "red"
          ? `<div class='error'>${notif}</div>`
          : `<div class='notif'>${notif}</div>`
      }`;
      this.notifList.insertAdjacentHTML("beforeend", html);
    });

    await delay();

    this.blurBackground.classList.add("gone");

    await delayFaster();
    this.notifList.innerHTML = "";
  }
}

export default new AdminAddView();
