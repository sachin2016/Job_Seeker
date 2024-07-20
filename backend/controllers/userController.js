import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) { // agr req.body se inme se koi ek v nhi mila to call next(){errorMiddleware}
    return next(new ErrorHandler("Please fill full form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!")); // new errorhandler take two parameter but here we give only message
  }

  const user = await User.create({ // create user ...User is a Mongoose model
    name,
    email,
    phone,
    password,
    role,
  });
  /*The code const user = await User.create({ name, email, phone, password, role });:

Uses Mongoose to create a new user document in the User collection.
Waits for the creation process to complete.
Assigns the newly created user document to the user variable.
Ensures the data adheres to the User schema and saves it to the MongoDB database.*/

   sendToken(user, 201, res, "User Registered!");
  // res.status(200).json({
  //   success:true,
  //   message: "User registered",
  //   user,
  // })
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }
  const user = await User.findOne({ email }).select("+password");//.select("+password") is a Mongoose method used to include fields that are not selected by default.
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password); //comparePassword fun define in userSchema
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});