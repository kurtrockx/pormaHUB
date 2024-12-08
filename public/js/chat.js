document.addEventListener("DOMContentLoaded", () => {
  const chatMessage = document.querySelector(".chat-message-container");

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
