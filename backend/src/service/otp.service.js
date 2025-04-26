import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const otpCodeUser = async (email, otp_code, expires_at) => {
  const now = new Date();
  try {
    return await Otp.create({
      email,
      otp_code,
      created_at: now,
      expires_at,
    });
  } catch (error) {
    console.error("Error saat Membuat Otp:", error.message);
    throw new Error("Gagal Membuat kode OTP");
  }
};

export const getOtp = async (otp_code) => {
  try {
    return await Otp.findOne({
      otp_code,
      expires_at: { $gt: new Date() },
    });
  } catch (error) {
    console.error("Error saat Mengambil Otp:", error.message);
    throw new Error("Gagal Membuat Validasi");
  }
};

export const patchPassword = async (email, newPassword) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return { email: user.email, message: "Password berhasil diubah" };
  } catch (error) {
    console.error("Gagal update password:", error.message);
    throw new Error("Gagal update password");
  }
};