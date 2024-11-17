class UserModel {
  currentUser;
  users = [];
  Users = class {
    constructor(email, firstName, lastName, username, password) {
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.username = username;
      this.password = password;
      this.otp = Math.trunc(Math.random() * 900000) + 100000;
    }
  };

  emptyFields(dataArray, errors) {
    const error = dataArray.some((data) => data === "");
    if (error) {
      errors.push("Fill up empty fields");
      return true;
    }
  }
  validateEmail(email, errors) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) errors.push("Enter a valid email");
  }
  validateName(first, second, errors) {
    const realName = first + second;
    const numberInName = realName.match(/\d+/g);
    if (numberInName) errors.push("No numbers in the name fields allowed");
  }
  validateLength(username, pass, errors) {
    const data = username.length >= 8 && username.length <= 16;
    !data && errors.push("Username have to be between 8 and 16 characters");
    const data2 = pass.length >= 8 && pass.length <= 16;
    !data2 && errors.push("Password have to be between 8 and 16 characters");
  }
  validatePassword(pass1, pass2, errors) {
    if (pass1 !== pass2) {
      errors.push("Passwords have to match");
    }
  }
}

export default new UserModel();
