import ProfileView from "../view/profileView";
import UserModel from "../model/userModel";
import ProfileModel from "../model/profileModel";

const insertFullName = () => {
  const firstName = `${UserModel.currentUser.firstName
    .slice(0, 1)
    .toUpperCase()}${UserModel.currentUser.firstName.slice(1)}`;
  const lastName = `${UserModel.currentUser.lastName
    .slice(0, 1)
    .toUpperCase()}${UserModel.currentUser.lastName.slice(1)}`;

  const fullName = `${firstName} ${lastName}`;
  ProfileView.userName.textContent = fullName;
};

const switchTab = (e) => {
  const tabClicked = e.target.closest(".profile-tab");

  ProfileView.profileTabs.forEach((tab) => {
    tab.classList.remove("active-tab");
  });

  if (tabClicked?.dataset.tab === "purchases") {
    localStorage.setItem("profileTab", "purchases");
    spawnPurchaseHistory();
  }
  if (tabClicked?.dataset.tab === "user") {
    localStorage.setItem("profileTab", "users");
    spawnUserInfo();
  }

  tabClicked.classList.add("active-tab");
};

const spawnUserInfo = () => {
  try {
    const currentUser = UserModel.currentUser;
    ProfileView.profileContentContainer.innerHTML = "";
    const userHTML = ProfileView.userInfoHTML(currentUser);
    ProfileView.profileContentContainer.insertAdjacentHTML(
      "beforeend",
      userHTML
    );
    ProfileView.profileTabs[0].classList.add("active-tab");
  } catch (err) {
    console.error(err.message);
  }
};
const spawnPurchaseHistory = async () => {
  try {
    ProfileView.profileContentContainer.innerHTML = "";

    const currentPurchaseHistory =
      await ProfileModel.setCurrentPurchaseHistory();

    if (!currentPurchaseHistory.length) {
      ProfileView.renderNoItems();
      return;
    }

    const historyHTML = currentPurchaseHistory
      .map((item) => ProfileView.purchaseHistoryItemHTML(item))
      .reverse()
      .join("");
    ProfileView.profileContentContainer.insertAdjacentHTML(
      "beforeend",
      historyHTML
    );
    ProfileView.profileTabs[1].classList.add("active-tab");
  } catch (err) {
    console.error(err.message);
  }
};

const checkCurrentTab = () => {
  const currentTab = localStorage.getItem("profileTab");

  ProfileView.profileTabs.forEach((tab) => {
    tab.classList.remove("active-tab");
  });

  if (currentTab === "purchases") {
    spawnPurchaseHistory();
    ProfileView.profileTabs[1].classList.add("active-tab");
  } else if (currentTab === "users") {
    spawnUserInfo();
    ProfileView.profileTabs[0].classList.add("active-tab");
  }
};

const initialSet = () => {
  const currentTab = localStorage.getItem("profileTab");
  if (!currentTab) localStorage.setItem("profileTab", "users");
};

const init = async () => {
  ProfileView.profileTabs.forEach((tab) => {
    tab.classList.remove("active-tab");
  });

  initialSet();
  UserModel.pullUsersFromDB();
  insertFullName();
  checkCurrentTab();
  ProfileView.switchTab(switchTab);
};
init();
