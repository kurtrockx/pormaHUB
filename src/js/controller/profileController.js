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
  tabClicked.classList.add("active-tab");
  const tabPicked = tabClicked?.dataset.tab;
  if (tabPicked === "purchases") spawnPurchaseHistory();
  if (tabPicked === "user") spawnUserInfo();
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
    console.log(ProfileView.purchaseHistoryItemHTML());
  } catch (err) {
    console.error(err.message);
  }
};

const init = async () => {
  UserModel.pullUsersFromDB();
  insertFullName();
  spawnUserInfo();
  ProfileView.switchTab(switchTab);
};
init();
