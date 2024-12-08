import UserModel from "../../src/js/model/userModel";
import xIcon from "../../src/assets/svg/x.svg";
import chatIcon from "../../src/assets/svg/chat.svg";
import phLogo2 from "../../src/assets/images/phLogo2.png";

const insertChat = () => {
  const html = `
  <div div class="open-chat"><img src="${chatIcon}" class="open-chat-icon"></div>
    <div class="chat-container gone">
      <div class="chat-head">
        <div class="pormaLogo"><img src="${phLogo2}"></div>
        <div class="pormaName">CHAT SUPPORT</div>
        <div class="exit-chat invert"><img src="${xIcon}" /></div>
      </div>
      <div class="chat-message-container"></div>
      <div class="chat-send-container">
        <input type="text" class="message-input" placeholder="Aa" />
        <div class="send-message-button">SEND</div>
      </div>
    </div>
`;
  document.body.insertAdjacentHTML("beforeend", html);

  const chatContainer = document.querySelector(".chat-container");
  const chatMessage = document.querySelector(".chat-message-container");
  const sendMessageButton = document.querySelector(".send-message-button");
  const messageInput = document.querySelector(".message-input");
  const openChat = document.querySelector(".open-chat");
  const exitChat = document.querySelector(".exit-chat");

  openChat.addEventListener("click", () => {
    chatContainer.classList.remove("gone");
  });
  exitChat.addEventListener("click", () => {
    chatContainer.classList.add("gone");
  });

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
      if (!res.ok) throw new Error("Could not fetch user chat messages");
      const currentUser = await res.json();
      localStorage.setItem(
        "chatLength",
        JSON.stringify(currentUser.chat.length)
      );
      return currentUser.chat;
    } catch (err) {
      console.error("Error fetching chat messages:", err);
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
        console.log("Message sent successfully");
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

  const sendMessage = async () => {
    const userMessage = messageInput.value;
    if (userMessage === "") return;
    sendMessageToDB({ sender: "user", message: userMessage });
    messageInput.value = "";
    await chatMessages();
  };

  const sendMessageButtonClick = () => {
    sendMessageButton.addEventListener("click", async () => {
      await sendMessage();
    });
  };
  const checkInputFocus = () => {
    window.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && messageInput === document.activeElement)
        await sendMessage();
    });
  };

  let previousChatLength = JSON.parse(localStorage.getItem("chatLength")) || 0;

  const autoUpdateChat = () => {
    setInterval(async () => {
      await chatMessages();
      const currentChatLength = JSON.parse(localStorage.getItem("chatLength"));

      if (currentChatLength !== previousChatLength) {
        renderChart();
        previousChatLength = currentChatLength;
      }
    }, 500);
  };

  const init = async () => {
    await renderChart();
    checkInputFocus();
    sendMessageButtonClick();
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
};

if (UserModel.currentUser) insertChat();
