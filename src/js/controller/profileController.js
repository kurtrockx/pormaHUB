import ProfileView from "../view/profileView";
import UserModel from "../model/userModel";
import ProfileModel from "../model/profileModel";

const checkCurrentUser = () => {
  if (!UserModel.currentUser) {
    window.location.href = "index.html";
  }
};

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

const modalData = () => {
  return {
    userId: UserModel.currentUser._id.$oid,
    firstName: ProfileView.modalFirstName.value,
    lastName: ProfileView.modalLastName.value,
    username: ProfileView.modalUsername.value,
    email: ProfileView.modalEmail.value,
    address: ProfileView.modalAddress.value,
    contactNumber: ProfileView.modalContact.value,
  };
};

const changeUserCredentials = async () => {
  const data = modalData();
  await ProfileModel.changeUserCredentials(data);
  await ProfileModel.setCurrentUser();

  window.location.reload();
};

const openModalFunction = (e) => {
  const openModalButton = e.target.closest(".open-modal-button");
  if (!openModalButton) return;

  ProfileView.userCredentialsModal.classList.remove("gone");
};

const closeModalFunction = () => {
  ProfileView.userCredentialsModal.classList.add("gone");
};

const init = async () => {
  checkCurrentUser();

  ProfileView.profileTabs.forEach((tab) => {
    tab.classList.remove("active-tab");
  });

  UserModel.pullUsersFromDB();
  initialSet();
  insertFullName();
  checkCurrentTab();
  ProfileView.switchTab(switchTab);
  ProfileView.changeCredentials(changeUserCredentials);
  ProfileView.openModal(openModalFunction);
  ProfileView.closeModal(closeModalFunction);
};
init();
