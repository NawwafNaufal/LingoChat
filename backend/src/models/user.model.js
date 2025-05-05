import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Menjaga email tetap unik
    },
    fullName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: function() {
        return !this.provider || this.provider === 'local';
      },
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'facebook', 'github'], // Menambahkan GitHub sebagai provider
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Agar Google ID hanya unik jika ada
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Agar GitHub ID hanya unik jika ada
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
