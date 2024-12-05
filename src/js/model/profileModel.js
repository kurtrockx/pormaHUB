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
}
 export default new ProfileModel()