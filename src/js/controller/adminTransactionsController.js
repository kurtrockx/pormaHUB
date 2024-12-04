import AdminTransactionsModel from "../model/adminTransactionsModel";
import AdminTransactionsView from "../view/adminTransactionsView";
import UserModel from "../model/userModel";

const fetchAllPurchaseHistory = async () => {
  const users = UserModel.users;
  console.log(users);
};

const init = async() => {
  UserModel.pullUsersFromDB();
  fetchAllPurchaseHistory();
};

init();
