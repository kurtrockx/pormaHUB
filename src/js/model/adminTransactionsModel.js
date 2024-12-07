class AdminTransactionsModel {
  async updateTransactionStatus(cardID, newStatus) {
    try {
      const response = await fetch(
        "http://localhost/pormaHUB/src/php/updateTransactionStatus.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: cardID,
            newStatus: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to update transaction:", error.message);
    }
  }
}

export default new AdminTransactionsModel();
