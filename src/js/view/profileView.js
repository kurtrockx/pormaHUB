class ProfileView {
  profileTabsContainer;
  profileTabs;

  constructor() {
    this.profileTabsContainer = document.querySelector(
      ".profile-tab-container"
    );
    this.profileTabs = document.querySelectorAll(".profile-tab");
  }

  switchTab(switchTabFunction) {
    this.profileTabsContainer.addEventListener("click", switchTabFunction);
  }
}

export default new ProfileView();
