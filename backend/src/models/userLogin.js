import User from "../models/User.js"; // pastikan path ini sesuai lokasi file User model kamu

export const getGoogleAccount = async (identifier) => {
  try {
    // bisa cari berdasarkan email atau ID Google
    const user = await User.findOne({
      $or: [{ email: identifier }, { _id: identifier }],
    });
    return user;
  } catch (error) {
    console.error("Error finding Google account:", error);
    return null;
  }
};

export const postGoogleAccount = async (email, username, fullName, profilePic, googleId) => {
  try {
    const newUser = new User({
      email,
      username,
      fullName,
      profilePic,
      googleId,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error creating Google account:", error);
    return null;
  }
};
