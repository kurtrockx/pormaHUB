import UserModel from "../../src/js/model/userModel";


const chatMessage = document.querySelector(".chat-message-container");
const sendMessageButton = document.querySelector(".send-message-button");
const messageInput = document.querySelector(".message-input");

const chatMessages = async () => {
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
    if (!res.ok) throw new Error("Could not fetch user cart");
    const currentUser = await res.json();
    return currentUser.chat;
  } catch (err) {
    console.error(err);
  }
};

const sendMessageToDB = async (message) => {
  const user = UserModel.currentUser;
  try {
    const response = await fetch(
      "http://localhost/pormaHUB/src/php/sendMessage.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          userId: user._id.$oid,
          chatMessage: message,
        }),
      }
    );
    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result.message);
    } else {
      console.error("Error:", result.error || "Failed to send message");
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
};

const renderChart = async () => {
  chatMessage.innerHTML = "";
  const allMessages = await chatMessages();
  allMessages.forEach((msg) => {
    const html =
      msg.sender === "user"
        ? `<div class="chat-message chat-user">${msg.message}</div>`
        : `<div class="chat-message chat-admin">${msg.message}</div>`;

    chatMessage.insertAdjacentHTML("beforeend", html);
  });
};

const sendMessage = () => {
  sendMessageButton.addEventListener("click", async () => {
    const userMessage = messageInput.value;
    sendMessageToDB({ sender: "user", message: userMessage });
    messageInput.value = "";
    await chatMessages();
    renderChart();
  });
};

let chatLength = 0;
let previousChatLength = 0;

const autoUpdateChat = () => {
  setInterval(async () => {
    if (chatLength !== previousChatLength) {
      await chatMessages();
      renderChart();

      previousChatLength = chatLength;
    }
  }, 500);
};

const init = async () => {
  await renderChart();
  sendMessage();
  autoUpdateChat();
};
init();

document.addEventListener("DOMContentLoaded", () => {
  if (chatMessage) {
    chatMessage.scrollTop = chatMessage.scrollHeight;

    const observer = new MutationObserver(() => {
      chatMessage.scrollTop = chatMessage.scrollHeight;
    });

    observer.observe(chatMessage, { childList: true, subtree: true });
  } else {
    console.error("Chat message container not found!");
  }
});
