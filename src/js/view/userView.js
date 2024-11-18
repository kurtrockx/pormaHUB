class UserView {
  mainContentContainer;
  errorList;
  errorBackground;
  formContainer;
  registrationForm;
  inputEmail;
  inputFirstName;
  inputLastName;
  inputUsername;
  inputPassword;
  inputReenterPassword;
  signupButton;
  otpButton;
  addressButton;
  inputAddress;

  constructor() {
    this.mainContentContainer = document.querySelector("main");
    this.errorList = document.querySelector(".error-list");
    this.errorBackground = document.querySelector(".error-background");
    this.formContainer = document.querySelector(".form-container");
    this.registrationForm =
      this.formContainer?.querySelector(".registration-form");
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
    this.signupButton?.addEventListener("click", signupFunction);
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
    this.addressButton.addEventListener("click", addressFunction);
  }
}
export default new UserView();
