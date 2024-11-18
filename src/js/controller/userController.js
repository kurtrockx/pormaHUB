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

const testAccount = [
  "kurtkurt@gmail.com",
  "kurtkurt",
  "kurtkurt",
  "kurtkurt",
  "kurtkurt",
  "kurtkurt",
];

const registerUser = () => {
  // const validatedInput = validateRegistration(returnInputView());
  const validatedInput = validateRegistration(testAccount);
  if (!validatedInput) return;
  UserModel.pendingUserOTP(validatedInput);
};

const init = () => {
  UserView.signup(registerUser);
};
init();
