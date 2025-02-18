class UserModel {
  currentUser;
  adminCredentials = {
    username: "admin123",
    password: "admin123password",
  };
  userPending;
  users = [];
  UserCreate = class {
    constructor(email, firstName, lastName, username, password, contactNumber) {
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.username = username;
      this.contactNumber = contactNumber;
      this.password = password;
      this.otp = Math.trunc(Math.random() * 900000) + 100000;
      this.location = {
        address: undefined,
        coords: undefined,
      };
      this.cart = [];
      this.purchaseHistory = [];
      this.chat = [
        {
          sender: "admin",
          message:
            "Welcome to Porma Hub!<br><br>We're thrilled to have you with us. Our team is here to provide you with the best possible service and support. Whether you have questions, need assistance, or just want to learn more about how we can help, feel free to reach out to us anytime.<br><br>How can we assist you today?",
        },
      ];
    }
  };

  constructor() {
    this.getCurrentUserLocal();
  }

  async pullUsersFromDB() {
    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/userPull.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("No response");
      const data = await res.json();
      this.users.push(...data);
    } catch (err) {
      console.log(err.message);
    }
  }

  existingUser(dataArray, errors) {
    const emailMatch = this.users.find((user) => user.email === dataArray[0]);
    if (emailMatch) errors.push("Email already in use");

    const usernameMatch = this.users.find(
      (user) => user.username === dataArray[3]
    );
    if (usernameMatch) errors.push("Username already taken");
  }

  //Validations
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

    const specialCharsInName = realName.match(/[^a-zA-Z0-9 ]/);
    if (specialCharsInName)
      errors.push("No special characters in the name fields allowed");
  }
  validateLength(username, pass, errors) {
    const data = username.length >= 8 && username.length <= 16;
    !data && errors.push("Username have to be between 8 and 16 characters");
    const data2 = pass.length >= 8 && pass.length <= 16;
    !data2 && errors.push("Password have to be between 8 and 16 characters");
  }
  validateContactNumber(contactNumber, errors) {
    const contactPattern = /^(09\d{9}|639\d{9})$/;

    if (!/^\d+$/.test(contactNumber)) {
      errors.push("The contact number should contain only numeric digits.");
    } else if (!contactPattern.test(contactNumber)) {
      errors.push("Enter a valid contact number.");
    }
  }

  validatePassword(pass1, pass2, errors) {
    if (pass1 !== pass2) {
      errors.push("Passwords have to match");
    }
  }
  validateOTP(inputOtp, errors) {
    if (this.userPending.otp !== +inputOtp)
      errors.push("OTP incorrect. Please try again.");
  }

  //Assigning pendingUserOTP to the user before inputting OTP
  pendingUserOTP(arr) {
    this.userPending = new this.UserCreate(...arr.slice(0, 5), arr[6]);
    console.log(this.userPending);
  }
  //Pushing user to db
  async pushUserToDB(user) {
    try {
      const res = await fetch(
        "http://localhost/pormaHUB/src/php/userPush.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "add",
            user: user,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to add product");

      const data = await res.json();
      console.log("Product added:", data);
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  checkLoginCredentials(userCred, errors) {
    const user = this.users.find(
      (user) => user.email === userCred[0] && user.password === userCred[1]
    );

    if (!user) {
      errors.push("Wrong credentials. Try again.");
      return true;
    }
  }
  loginUser(validatedLogin) {
    const userFound = this.users.find((user) => user.email === validatedLogin);
    this.currentUser = userFound;
    this.setCurrentUserLocal();
    return;
  }
  loginAdmin(admin) {
    this.currentUser = admin;
    this.setCurrentUserLocal();
  }
  setCurrentUserLocal() {
    localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
  }
  getCurrentUserLocal() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    this.currentUser = currentUser;
  }

  logoutUser() {
    localStorage.removeItem("currentUser");
  }
}

export default new UserModel();
