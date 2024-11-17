import UserModel from "../model/userModel";
import UserView from "../view/userView";

const validateRegistration = () => {
  const errors = [];

  const allInputValue = [
    UserView.inputEmail.value,
    UserView.inputFirstName.value,
    UserView.inputLastName.value,
    UserView.inputUsername.value,
    UserView.inputPassword.value,
    UserView.inputReenterPassword.value,
  ];

  const empty = UserModel.emptyFields(allInputValue, errors);
  if (empty) {
    UserView.errorDisplay(errors);
    console.log(empty);
    return;
  }

  UserModel.validateEmail(allInputValue[0], errors);
  UserModel.validateName(allInputValue[1], allInputValue[2], errors);
  UserModel.validateLength(allInputValue[3], allInputValue[4], errors);
  UserModel.validatePassword(allInputValue[5], allInputValue[6], errors);
  if (errors.length > 0) UserView.errorDisplay(errors);
};

const init = () => {
  UserView.signup(validateRegistration);
};
init();
