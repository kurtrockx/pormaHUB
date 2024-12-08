import downIcon from "../../../src/assets/svg/down.svg";

class AdminTransactionsView {
  transactionsContainer;
  constructor() {
    this.transactionsContainer = document.querySelector(
      ".transactions-container"
    );
  }

  purchaseHistoryItemHTML(purchaseItem) {
    const date = new Date(purchaseItem.date);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);

    return `
      <div class="transaction-card-container" data-id="${purchaseItem.id}">
        <div class="transaction-id">
          Transaction_ID:
          <span class="transaction-id-value">${purchaseItem.id}</span>
        </div>
        <div class="transaction-date">${formattedDate}</div>
        <div class="transaction-items-container">
        ${purchaseItem.items
          .map((item) => {
            return `
            <div class="transaction-items-container">
              ${item.name}(${item.quantity}) - ${item.size} - P${
              item.quantity * item.price
            }
            </div>`;
          })
          .join("")}
        </div>
        <div class="transaction-status-container">
          <img
            src="${downIcon}"
            class="drop-down-icon-transactions"
          />
          <select class="transaction-status">
            <option value="PENDING" class="transaction-status-value" ${
              purchaseItem.status === "PENDING" ? "selected" : ""
            }>
              PENDING
            </option>
            <option value="APPROVED" class="transaction-status-value" ${
              purchaseItem.status === "APPROVED" ? "selected" : ""
            }>
              APPROVED
            </option>
            <option value="IN SHIPPING FACILITY" class="transaction-status-value" ${
              purchaseItem.status === "IN SHIPPING FACILITY" ? "selected" : ""
            }>
              IN SHIPPING FACILITY
            </option>
            <option value="ON DELIVERY" class="transaction-status-value" ${
              purchaseItem.status === "ON DELIVERY" ? "selected" : ""
            }>
              ON DELIVERY
            </option>
            <option value="ORDER COMPLETE" class="transaction-status-value" ${
              purchaseItem.status === "ORDER COMPLETE" ? "selected" : ""
            }>
              ORDER COMPLETE
            </option>
          </select>
        </div>
    `;
  }

  changeStatus(changeStatusFunction) {
    this.transactionsContainer.addEventListener("click", changeStatusFunction);
  }
}

export default new AdminTransactionsView();
