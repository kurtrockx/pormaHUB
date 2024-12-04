import phLogo2 from "../../src/assets/images/phLogo2.png";
import houseIcon from "../../src/assets/svg/house.svg";
import userIcon from "../../src/assets/svg/users.svg";
import plusIcon from "../../src/assets/svg/plus.svg";
import editIcon from "../../src/assets/svg/edit.svg";
import logoutIcon from "../../src/assets/svg/logoutAdmin.svg";
import UserModel from "../../src/js/model/userModel";

const checkAdmin = () => {
  if (!UserModel.currentUser) window.location.href = "index.html";

  const currentUser = UserModel.currentUser;
  const adminCredentials = UserModel.adminCredentials;
  if (
    currentUser.username !== adminCredentials.username ||
    currentUser.password !== adminCredentials.password
  ) {
    window.location.href = "index.html";
  }
};

const spawnSideNav = () => {
  const html = `
    <nav class="side-nav">
      <div class="phLogo">
        <img src="${phLogo2}" class="phLogo-image" />
      </div>
      <a href="adminTransactions.html" class="nav-option add-products">
        <img src="${houseIcon}" class="side-nav-images" />
      </a>
      <a href="adminAdd.html" class="nav-option user-list">
        <img src="${plusIcon}" class="side-nav-images" />
      </a>
      <a href="adminEditProducts.html" class="nav-option edit-products">
        <img src="${editIcon}" class="side-nav-images" />
      </a>
      <a href="adminUserList.html" class="nav-option users-list">
        <img src="${userIcon}" class="side-nav-images" />
      </a>
      <div class="nav-option logout-admin">
        <img src="${logoutIcon}" class="side-nav-images" />
      </div>

    </nav>
    `;

  document.body.insertAdjacentHTML("afterbegin", html);

  document.querySelector(".logout-admin").addEventListener("click", () => {
    UserModel.logoutUser();
    window.location.href = "index.html";
  });
};

const init = () => {
  checkAdmin();
  spawnSideNav();
};

init();
