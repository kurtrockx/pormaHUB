class ProfileView {
  profileTabsContainer;
  profileTabs;
  profileContentContainer;
  userName;

  constructor() {
    this.profileTabsContainer = document.querySelector(
      ".profile-tab-container"
    );
    this.profileTabs = document.querySelectorAll(".profile-tab");
    this.profileContentContainer = document.querySelector(".profile-content");
    this.userName = document.querySelector('.user-name-username')
  }

  switchTab(switchTabFunction) {
    this.profileTabsContainer.addEventListener("click", switchTabFunction);
  }

  purchaseHistoryItemHTML(purchaseItem) {
    const date = new Date(purchaseItem.date);

    if (isNaN(date)) {
      console.error("Invalid date:", purchaseItem.date);
      return "";
    }

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);

    return `
      <div class="purchase-history-item">
        <div class="date-of-purchase">${formattedDate}</div>
        <div class="item-container">
        ${purchaseItem.items
          .map((item) => {
            return `
            <div class="item">
              <div class="item-name-picture">
                <div class="item-picture">
                  <img src="${item.thumbnail}" class="item-picture-value"/>
                </div>
                <div class="item-name">${item.name}</div>
              </div>
              <div class="size">${item.size}</div>
              <div class="quantity">${item.quantity}</div>
              <div class="total-price">$${(item.quantity * item.price).toFixed(
                2
              )}</div>
              <div class="status ${
                purchaseItem.status === "PENDING"
                  ? "state1"
                  : purchaseItem.status === "APPROVED"
                  ? "state2"
                  : purchaseItem.status === "IN SHIPPING FACILITY"
                  ? "state3"
                  : purchaseItem.status === "ON DELIVERY"
                  ? "state4"
                  : purchaseItem.status === "ORDER COMPLETE"
                  ? "state5"
                  : ""
              }">
                        ${purchaseItem.status}
                      </div>
                    </div>
                    `;
          })
          .join("")}
                </div>
            </div>`;
  }
  userInfoHTML(user) {
    return `
          <div class="details-container">
            <div class="detail">
              <div class="detail-bold">Name</div>
              <div class="detail-value">${user.firstName} ${user.lastName}</div>
            </div>
            <div class="detail">
              <div class="detail-bold">Username</div>
              <div class="detail-value">${user.username}</div>
            </div>
            <div class="detail">
              <div class="detail-bold">Email</div>
              <div class="detail-value">${user.email}</div>
            </div>
            <div class="detail">
              <div class="detail-bold">Address</div>
              <div class="detail-value">${user.location.address}</div>
            </div>
            <div class="detail">
              <div class="detail-bold">Contact No.</div>
              <div class="detail-value">${user.contactNumber}</div>
            </div>
          </div>
`;
  }
  renderNoItems() {
    this.profileContentContainer.insertAdjacentHTML(
      "beforeend",
      this.noItemsHTML()
    );
  }
  noItemsHTML() {
    return '<div class="no-items">No transactions in this account yet</div>';
  }
}

export default new ProfileView();
