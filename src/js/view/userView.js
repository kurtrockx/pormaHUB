class UserView {
  mainContentContainer;
  notifList;
  blurBackground;
  formContainer;
  registrationForm;
  inputEmail;
  inputFirstName;
  inputLastName;
  inputUsername;
  inputContact;
  inputPassword;
  inputReenterPassword;
  signupButton;
  otpButton;
  addressButton;
  inputAddress;
  loginButton;
  loginInputEmail;
  loginInputPassword;
  goBackButton;

  constructor() {
    this.mainContentContainer = document.querySelector("main");
    this.notifList = document.querySelector(".notification-list");
    this.blurBackground = document.querySelector(".blur-background");
    this.formContainer = document.querySelector(".form-container");
    this.registrationForm =
      this.formContainer?.querySelector(".registration-form");
    this.inputEmail = document.querySelector(".input-email");
    this.inputFirstName = document.querySelector(".input-first-name");
    this.inputLastName = document.querySelector(".input-last-name");
    this.inputUsername = document.querySelector(".input-username");
    this.inputContact = document.querySelector(".input-contact");
    this.inputPassword = document.querySelector(".input-password");
    this.inputReenterPassword = document.querySelector(
      ".input-reenter-password"
    );
    this.signupButton = document.querySelector(".signup-btn");
    this.loginButton = document.querySelector(".login-btn");
    this.loginInputEmail = document.querySelector(".login-input-email");
    this.loginInputPassword = document.querySelector(".login-input-password");
    this.goBackButton = document.querySelector(".exit-form-button");

    this.goBack();
  }

  signup(signupFunction) {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      signupFunction
    });
    this.signupButton?.addEventListener("click", signupFunction);
  }

  async notifDisplay(notif, type = "red") {
    const delay = () => new Promise((resolve) => setTimeout(resolve, 1500));
    const delayFaster = () =>
      new Promise((resolve) => setTimeout(resolve, 150));

    notif.forEach((notif) => {
      this.blurBackground.classList.remove("gone");
      const html = `${
        type === "red"
          ? `<div class='error'>${notif}</div>`
          : `<div class='notif'>${notif}</div>`
      }`;
      this.notifList.insertAdjacentHTML("beforeend", html);
    });

    await delay();

    this.blurBackground.classList.add("gone");

    await delayFaster();
    this.notifList.innerHTML = "";
  }

  changeToOtpPage() {
    this.registrationForm.remove();
    this.formContainer.insertAdjacentHTML("beforeend", this.otpHTML());
    this.otpButton = document.querySelector(".otp-btn");
  }

  otpHTML() {
    return `
        <div class="otp-form input-form">
          <div class="input-field-container">
            <h1 class="otp-header">Enter the OTP sent to your Email</h1>
            <input
              type="text"
              class="input-field input-otp"
              placeholder="XXXXXX"
            />
            <button class="user-btn otp-btn">SUBMIT</button>
          </div>
        </div>
           `;
  }
  otpCheck(otpFunction) {
    this.otpButton?.addEventListener("click", otpFunction);
  }

  mapHTML() {
    return `
        <div id="map"></div>
        <div class="address-input">
          <input type="text" class="input-address" placeholder="Enter your current address...">
          <button class="user-btn address-btn">▶</button>
        </div>
    `;
  }
  changeToMapPage() {
    this.formContainer.remove();
    this.mainContentContainer.insertAdjacentHTML("beforeend", this.mapHTML());
    this.inputAddress = document.querySelector(".input-address");
    this.addressButton = document.querySelector(".address-btn");
  }

  submitAddress(addressFunction) {
    this.addressButton?.addEventListener("click", addressFunction);
  }

  loginUser(loginFunction) {
    this.loginButton?.addEventListener("click", loginFunction);
  }

  goBack() {
    this.goBackButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}
export default new UserView();
