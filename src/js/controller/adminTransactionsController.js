import AdminTransactionsModel from "../model/adminTransactionsModel";
import AdminTransactionsView from "../view/adminTransactionsView";
import UserModel from "../model/userModel";

const fetchAllPurchaseHistory = async () => {
  const users = UserModel.users;
  const allPurchases = users
    .map((user) => user.purchaseHistory)
    .reduce((acc, purchase) => acc.concat(purchase), []);
  return allPurchases;
};

const renderPurchases = async () => {
  try {
    const allPurchases = await fetchAllPurchaseHistory();
    if (!allPurchases) throw new Error("No purchases found");
    allPurchases.forEach((purchase) => {
      const html = AdminTransactionsView.purchaseHistoryItemHTML(purchase);
      AdminTransactionsView.transactionsContainer.insertAdjacentHTML(
        "afterbegin",
        html
      );
    });
  } catch (err) {
    console.error(err.message);
  }
};

const changeStatus = async (e) => {
  try {
    const allPurchases = await fetchAllPurchaseHistory();
    if (!allPurchases) throw new Error("No purchases found");

    const clickedCard = e.target.closest(".transaction-card-container");
    const cardID = clickedCard?.dataset.id;

    const purchaseMatch = allPurchases.find(
      (purchase) => purchase.id === cardID
    );
    if (!purchaseMatch) throw new Error("No transaction match");

    const closestDrop = clickedCard.querySelector(".transaction-status");

    closestDrop.addEventListener("change", () => {
      const newStatus = closestDrop.value;
      AdminTransactionsModel.updateTransactionStatus(cardID, newStatus);
    });
  } catch (err) {
    console.error("Error in changeStatus:", err.message);
  }
};

const init = async () => {
  await UserModel.pullUsersFromDB();
  await renderPurchases();
  AdminTransactionsView.changeStatus(changeStatus);
};

init();
