import ProfileView from "../view/profileView";
import UserModel from "../model/userModel";
import ProfileModel from "../model/profileModel";

const switchTab = (e) => {
  const tabClicked = e.target.closest(".profile-tab");
  ProfileView.profileTabs.forEach((tab) => {
    tab.classList.remove("active-tab");
  });
  tabClicked.classList.add("active-tab");
  const tabPicked = tabClicked?.dataset.tab;
  console.log(tabPicked);
  if (tabPicked === "purchases") spawnPurchaseHistory();
  if (tabPicked === "user") spawnUserInfo();
};
const spawnUserInfo = () => {
  try {
    const currentUser = UserModel.currentUser;
    console.log(currentUser);
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

    const historyHTML = currentPurchaseHistory
      .map((item) => ProfileView.purchaseHistoryItemHTML(item))
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
  spawnUserInfo();
  ProfileView.switchTab(switchTab);
};
init();
