import UserModel from "./UserSchema.js";

// CREATE
export const createNewUser = (userObj) => UserModel(userObj).save();

// LOOKUPS
export const getUserByEmail = (email) => UserModel.findOne({ email });
export const getUserByID = (id) => UserModel.findById(id).select("-password");

// UPDATE
export const updateUser = (filter = {}, obj = {}) =>
  UserModel.findOneAndUpdate(filter, obj, { new: true });
