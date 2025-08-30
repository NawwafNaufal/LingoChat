import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, 
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
      enum: ['local', 'google', 'facebook', 'github'], 
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, 
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, 
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
