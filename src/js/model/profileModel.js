import UserModel from "./userModel";

class ProfileModel {
  constructor() {}

  async setCurrentPurchaseHistory() {
    const userId = UserModel.currentUser._id.$oid;
    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/currentPull.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) throw new Error("Could not fetch user purchase history");
      const currentUser = await res.json();
      return currentUser.purchaseHistory;
    } catch (err) {
      console.error(err);
    }
  }

  async setCurrentUser() {
    const userId = UserModel.currentUser._id.$oid;
    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/currentPull.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) throw new Error("Could not fetch user purchase history");
      const currentUser = await res.json();
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } catch (err) {
      console.error(err);
    }
  }

  async changeUserCredentials(userData) {
    console.log(userData);
    try {
      const response = await fetch(
        "http://localhost/pormaHUB/src/php/updateUser.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("User credentials updated successfully!");
      } else {
        alert("Failed to update credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating credentials.");
    }
  }
}
export default new ProfileModel();
