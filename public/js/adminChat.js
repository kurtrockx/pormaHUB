import UserModel from "../../src/js/model/userModel";

const userContainer = document.querySelector(".user-container");
const messageContainer = document.querySelector(".message-container");
const messageInput = document.querySelector(".message-input-value");
const sendMessageButton = document.querySelector(".send-message-button");

let selectedUserId = null; // Track the currently selected user's ID
let previousChatLength = 0; // Store the last known chat length for the selected user
let isSendMessageListenerAttached = false; // Track if sendMessage event listeners are attached

const renderUsers = async () => {
  const allUsers = await getAllUsers();
  allUsers.forEach((user) => {
    const html = `
        <div class="user" data-username="${user.username}" data-user-id="${user._id.$oid}">
          <div class="user-name">${user.username}</div>
          <div class="user-email">${user.email}</div>
        </div>`;
    userContainer.insertAdjacentHTML("beforeend", html);
  });
};

const getAllUsers = async () => {
  await UserModel.pullUsersFromDB();
  return UserModel.users;
};

const renderChat = async (chat) => {
  messageContainer.innerHTML = "";
  chat.forEach((msg) => {
    const html =
      msg.sender === "user"
        ? `<div class="chat-message chat-user">${msg.message}</div>`
        : `<div class="chat-message chat-admin">${msg.message}</div>`;
    messageContainer.insertAdjacentHTML("beforeend", html);
  });

  // Update the scroll position to show the latest messages
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const fetchUserChat = async (userId) => {
  try {
    const res = await fetch(
      "http://localhost/pormaHUB/src/php/currentPull.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );
    if (!res.ok) throw new Error("Could not fetch user chat messages");
    const user = await res.json();
    return user.chat;
  } catch (err) {
    console.error("Error fetching user chat:", err);
    return [];
  }
};

const sendMessageToDB = async (userId, message) => {
  try {
    const response = await fetch(
      "http://localhost/pormaHUB/src/php/sendMessage.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          userId,
          chatMessage: { sender: "admin", message },
        }),
      }
    );
    if (!response.ok) throw new Error("Failed to send message");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const sendMessage = async () => {
  if (!selectedUserId) return; // Make sure a user is selected before sending

  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // Send the message to the selected user only
  await sendMessageToDB(selectedUserId, userMessage);

  // Optimistically update UI
  const newMessageHTML = `<div class="chat-message chat-admin">${userMessage}</div>`;
  messageContainer.insertAdjacentHTML("beforeend", newMessageHTML);
  messageInput.value = "";
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const attachSendMessageHandlers = () => {
  if (isSendMessageListenerAttached) return; // Prevent adding the listener again

  sendMessageButton.addEventListener("click", async () => {
    await sendMessage(); // Now sends message to the selected user
  });

  window.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && messageInput === document.activeElement) {
      await sendMessage(); // Now sends message to the selected user
    }
  });

  isSendMessageListenerAttached = true; // Mark as attached
};

// Auto-update chat if the chat length changes
const autoUpdateChat = () => {
  setInterval(async () => {
    if (!selectedUserId) return;

    const chat = await fetchUserChat(selectedUserId);
    const currentChatLength = chat.length;

    if (currentChatLength !== previousChatLength) {
      await renderChat(chat);
      previousChatLength = currentChatLength; // Update chat length for comparison
    }
  }, 500);
};

const handleUserSelection = () => {
  userContainer.addEventListener("click", async (e) => {
    const selectedUserElement = e.target.closest(".user");
    if (!selectedUserElement) return;

    document
      .querySelectorAll(".user")
      .forEach((user) => user.classList.remove("active-chat"));
    e.target.closest(".user").classList.add("active-chat");

    selectedUserId = selectedUserElement.dataset.userId; // Store the selected user's ID

    const chat = await fetchUserChat(selectedUserId);
    previousChatLength = chat.length; // Initialize chat length for auto-update
    await renderChat(chat);

    // Attach send message handlers only once
    attachSendMessageHandlers();
  });
};

const init = async () => {
  await renderUsers();
  handleUserSelection();
  autoUpdateChat();
};

init();

document.addEventListener("DOMContentLoaded", () => {
  if (messageContainer) {
    const observer = new MutationObserver(() => {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    observer.observe(messageContainer, { childList: true, subtree: true });
  } else {
    console.error("Message container not found!");
  }
});
