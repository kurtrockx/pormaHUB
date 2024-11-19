import emailjs from "emailjs-com";
import UserModel from "../model/userModel";
import UserView from "../view/userView";
import { setUserLocation, spawnMap } from "../map";
import userView from "../view/userView";

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
  UserModel.existingUser(inputArr, errors);
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

const getLocation = async () => {
  try {
    const coords = await setUserLocation();
    if (!coords) throw new Error("Could not access map");

    UserView.submitAddress(() => {
      const address = UserView.inputAddress.value;
      if (address === "") {
        UserView.errorDisplay(["Please enter your current address"]);
        return;
      }
      const userPending = UserModel.userPending;
      userPending.location.address = address;
      userPending.location.coords = coords;
      UserModel.pushUserToDB(userPending);
    });
  } catch (err) {
    console.error(err);
  }
};

const checkOTP = async () => {
  const inputOtp = document.querySelector(".input-otp").value;
  if (UserModel.userPending.otp === +inputOtp) {
    UserView.changeToMapPage();
    getLocation();
    return;
  }
  UserView.errorDisplay(["OTP incorrect. Please try again."]);
  return;
};

const registerUser = () => {
  const validatedInput = validateRegistration(returnInputView());

  if (!validatedInput) return;

  UserModel.pendingUserOTP(validatedInput);

  sendEmail(UserModel.userPending);

  UserView.changeToOtpPage();
  UserView.otpCheck(checkOTP);
};

const loginUserController = () => {
  const errors = [];
  const loginInputEmail = UserView.loginInputEmail.value;
  const loginInputPassword = UserView.loginInputPassword.value;

  const userCred = [loginInputEmail, loginInputPassword];

  const empty = UserModel.emptyFields(userCred, errors);
  if (empty) {
    UserView.errorDisplay(errors);
    return;
  }

  const noUserMatch = UserModel.checkLoginCredentials(userCred, errors);
  if (noUserMatch) {
    UserView.errorDisplay(errors);
    return;
  }

  UserModel.loginUser(loginInputEmail);
  window.location.href = "index.html";
};

const init = () => {
  UserModel.pullUsersFromDB();
  UserView.signup(registerUser);
  UserView.loginUser(loginUserController);
};
init();
