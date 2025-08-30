import User from "../models/user.model.js"; 

export const getAccountFb = async (identifier) => {
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { _id: identifier }],
    });
    return user;
  } catch (error) {
    console.error("Error finding Google account:", error);
    return null;
  }
};

export const postAccountFb = async (email, fullName, profilePic, password) => {
  try {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log("User with this email already exists:", email);
      return existingUser;
    }
    
    const newUser = new User({
      email,
      fullName,
      profilePic,
      password
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error creating Google account:", error);
    throw error; 
  }
};