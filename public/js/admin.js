import phLogo2 from "../../src/assets/images/phLogo2.png";
import houseIcon from "../../src/assets/svg/house.svg";
import userIcon from "../../src/assets/svg/users.svg";
import plusIcon from "../../src/assets/svg/plus.svg";
import editIcon from "../../src/assets/svg/edit.svg";

const spawnSideNav = () => {
  const html = `
    <nav class="side-nav">
      <div class="phLogo">
        <img src="${phLogo2}" class="phLogo-image" />
      </div>
      <a href="#add" class="nav-option add-products">
        <img src="${houseIcon}" class="side-nav-images" />
      </a>
      <a href="#add" class="nav-option user-list">
        <img src="${plusIcon}" class="side-nav-images" />
      </a>
      <a href="#edit" class="nav-option edit-products">
        <img src="${editIcon}" class="side-nav-images" />
      </a>
      <a href="#users" class="nav-option users-list">
        <img src="${userIcon}" class="side-nav-images" />
      </a>
    </nav>
    `;

  document.body.insertAdjacentHTML("afterbegin", html);
};

const init = () => {
  spawnSideNav();
};

init();
