import emailjs from "emailjs-com";
import UserModel from "../model/userModel";
import UserView from "../view/userView";

const returnInputView = () => {
  return [
    UserView.inputEmail.value,
    UserView.inputFirstName.value,
    UserView.inputLastName.value,
    UserView.inputUsername.value,
    UserView.inputPassword.value,
    UserView.inputReenterPassword.value,
  ];
};

const validateRegistration = (inputArr) => {
  const errors = [];

  const empty = UserModel.emptyFields(inputArr, errors);
  if (empty) {
    UserView.errorDisplay(errors);
    return;
  }

  UserModel.validateEmail(inputArr[0], errors);
  UserModel.validateName(inputArr[1], inputArr[2], errors);
  UserModel.validateLength(inputArr[3], inputArr[4], errors);
  UserModel.validatePassword(inputArr[4], inputArr[5], errors);
  if (errors.length > 0) {
    UserView.errorDisplay(errors);
    return;
  }

  return inputArr;
};

const sendEmail = (pendingUserOTP) => {
  console.log(pendingUserOTP.email);
  emailjs.init("2xtwOkfoDakl7aPIR");

  const templateParams = {
    to_email: pendingUserOTP.email,
    message: pendingUserOTP.otp,
  };

  emailjs
    .send("verificationCode", "template_kzy9hmq", templateParams)
    .then((res) => {
      console.log("Sent MFer!!!", res.status, res.text);
    })
    .catch((err) => {
      console.log(err.message, "So sad");
    });
};

const checkOTP = () => {
  const inputOtp = document.querySelector(".input-otp").value;
  if (UserModel.userPending.otp === +inputOtp) {
    return;
  }
  UserView.errorDisplay(["OTP incorrect. Please try again."]);
};

const registerUser = () => {
  // const validatedInput = validateRegistration(returnInputView());

  const testAccount = [
    "kurtdebelen431@gmail.com",
    "kurtkurt",
    "kurtkurt",
    "kurtkurt",
    "kurtkurt",
    "kurtkurt",
  ];

  const validatedInput = validateRegistration(testAccount);
  if (!validatedInput) return;

  UserModel.pendingUserOTP(validatedInput);

  // sendEmail(UserModel.userPending);

  UserView.changeToOtpPage();
  UserView.otpCheck(checkOTP);
};

const init = () => {
  UserView.signup(registerUser);
};
init();
