class UserView {
  errorList;
  errorBackground;
  inputEmail;
  inputFirstName;
  inputLastName;
  inputUsername;
  inputPassword;
  inputReenterPassword;
  signupButton;

  constructor() {
    this.errorList = document.querySelector(".error-list");
    this.errorBackground = document.querySelector(".error-background");
    this.inputEmail = document.querySelector(".input-email");
    this.inputFirstName = document.querySelector(".input-first-name");
    this.inputLastName = document.querySelector(".input-last-name");
    this.inputUsername = document.querySelector(".input-username");
    this.inputPassword = document.querySelector(".input-password");
    this.inputReenterPassword = document.querySelector(
      ".input-reenter-password"
    );
    this.signupButton = document.querySelector(".signup-btn");
  }

  signup(signupFunction) {
    this.signupButton.addEventListener("click", signupFunction);
  }

  async errorDisplay(errors) {
    const delay = () => new Promise((resolve) => setTimeout(resolve, 2000));
    const delayFaster = () =>
      new Promise((resolve) => setTimeout(resolve, 150));

    errors.forEach((err) => {
      this.errorBackground.classList.remove("gone");
      const html = `<div class="error">${err}</div>`;
      this.errorList.insertAdjacentHTML("beforeend", html);
    });

    await delay();

    this.errorBackground.classList.add("gone");
    
    await delayFaster();
    this.errorList.innerHTML = "";
  }
}
export default new UserView();
