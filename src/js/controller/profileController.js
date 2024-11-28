import ProfileView from "../view/profileView";

const switchTab = (e) => {
  const tabClicked = e.target.closest(".profile-tab");
  ProfileView.profileTabs.forEach((tab) => {
    tab.classList.remove("active-tab");
  });
  tabClicked.classList.add('active-tab')
};

const init = () => {
  ProfileView.switchTab(switchTab);
};
init();
