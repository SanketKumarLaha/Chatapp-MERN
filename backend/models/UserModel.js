import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.statics.signup = async function (args) {
  const { username, email, password, profilePic } = args;

  if (!username || !email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Please enter a strong password");
  }

  const userExists = await this.findOne({ email });

  if (userExists) {
    throw Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = await this.create({
    username,
    email,
    password: hash,
    profilePic,
  });

  return newUser;
};

UserSchema.statics.login = async function (args) {
  const { email, password } = args;

  if (!email || !password) {
    throw Error("Both fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid email");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("User doesn't exist");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw Error("Wrong password");
  }

  return user;
};

export default mongoose.model("User", UserSchema);
