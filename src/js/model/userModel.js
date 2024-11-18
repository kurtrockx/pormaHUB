class UserModel {
  currentUser;
  userPending;
  users = [];
  UserCreate = class {
    constructor(email, firstName, lastName, username, password) {
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.username = username;
      this.password = password;
      this.otp = Math.trunc(Math.random() * 900000) + 100000;
      this.location = {
        address: undefined,
        coords: undefined,
      };
    }
  };

  constructor() {
    this.pullUsersFromDB();
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
      console.log(this.users);
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
  validatePassword(pass1, pass2, errors) {
    if (pass1 !== pass2) {
      errors.push("Passwords have to match");
    }
  }
  pendingUserOTP(arr) {
    this.userPending = new this.UserCreate(...arr.slice(0, 5));
    console.log(this.userPending);
  }
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
}

export default new UserModel();
