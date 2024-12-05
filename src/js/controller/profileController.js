import ProfileView from "../view/profileView";
import UserModel from "../model/userModel";
import ProfileModel from "../model/profileModel";

const switchTab = (e) => {
  const tabClicked = e.target.closest(".profile-tab");
  ProfileView.profileTabs.forEach((tab) => {
    tab.classList.remove("active-tab");
  });
  tabClicked.classList.add("active-tab");

  console.log(tabClicked);
};

const spawnPurchaseHistory = async () => {
  try {
    const currentPurchaseHistory =
      await ProfileModel.setCurrentPurchaseHistory();

    const historyHTML = currentPurchaseHistory
      .map((item) => ProfileView.purchaseHistoryItemHTML(item))
      .join("");
    ProfileView.profileContentContainer.insertAdjacentHTML(
      "beforebegin",
      historyHTML
    );
    console.log(ProfileView.purchaseHistoryItemHTML());
  } catch (err) {
    console.error(err.message);
  }
};

const init = async () => {
  UserModel.pullUsersFromDB();
  ProfileView.switchTab(switchTab);
  spawnPurchaseHistory();
};
init();
