import { useState, useEffect } from "react";
import { Pencil, Camera, Mail, User, X,Sailboat } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePopup = ({ isOpen, onClose }) => {
  const { authUser, isUpdatingProfile, updateProfile, updateUsername, updateDescription } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [editNameMode, setEditNameMode] = useState(false);
  const [fullNameInput, setFullNameInput] = useState("");
  const [editDescriptionMode, setEditDescriptionMode] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");

  useEffect(() => {
    if (authUser) {
      setFullNameInput(authUser.fullName || "");
      setDescriptionInput(authUser.description || "");
    }
  }, [authUser]);

  useEffect(() => {
    if (isOpen && authUser) {
      setSelectedImg(null);
      setEditNameMode(false);
      setEditDescriptionMode(false);
      setFullNameInput(authUser.fullName || "");
      setDescriptionInput(authUser.description || "");
    }
  }, [isOpen, authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    };
  };

  const handleSubmitName = async () => {
    try {
      await updateUsername({ fullName: fullNameInput });
      setEditNameMode(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleSubmitDescription = async () => {
    try {
      await updateDescription({ description: descriptionInput });
      setEditDescriptionMode(false);
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !authUser) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1c1c1c] rounded-lg px-6 py-8 w-full max-w-sm text-white max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#1c1c1c] transition"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h1 className="text-center text-lg font-semibold mb-4">
          Your profile information
        </h1>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-white"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-[#1c1c1c] p-2 rounded-full cursor-pointer hover:scale-105 transition"
            >
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-gray-400">
            Click the camera icon to update your photo
          </p>
        </div>

        <div className="mt-6 space-y-4">

          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-sm">
              <User className="w-4 h-4" Username/>
             Username
            </label>
            <div className="relative">
              {editNameMode ? (
                <>
                  <input
                    type="text"
                    className="w-full bg-[#1c1c1c] text-white rounded-lg py-2 px-4 pr-10 outline-none"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmitName()}
                    autoFocus
                  />
                  <button
                    className="absolute top-2.5 right-3 text-white hover:text-green-400"
                    onClick={handleSubmitName}
                  >
                    ✓
                  </button>
                </>
              ) : (
                <div
                  className="bg-[#1c1c1c] py-2 px-4 rounded-lg flex justify-between items-center cursor-pointer"
                  onClick={() => setEditNameMode(true)}
                >
                  <span>{authUser.fullName || "Not set"}</span>
                  <Pencil className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-sm">
            <Sailboat className="w-4 h-4" sailboat/>
              About
            </label>
            <div className="relative">
              {editDescriptionMode ? (
                <>
                  <input
                    type="text"
                    className="w-full bg-[#1c1c1c] text-white rounded-lg py-2 px-4 pr-10 outline-none"
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmitDescription()}
                    autoFocus
                  />
                  <button
                    className="absolute top-2.5 right-3 text-white hover:text-green-400"
                    onClick={handleSubmitDescription}
                  >
                    ✓
                  </button>
                </>
              ) : (
                <div
                  className="bg-[#1c1c1c] py-2 px-4 rounded-lg flex justify-between items-center cursor-pointer"
                  onClick={() => setEditDescriptionMode(true)}
                >
                  <span>{authUser.description || "Not set"}</span>
                  <Pencil className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-sm">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <div className="bg-[#1c1c1c] py-2 px-4 rounded-lg">
              {authUser.email || "Not set"}
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-6 bg-[#1c1c1c] rounded-xl p-4">
            <h2 className="text-base font-semibold mb-3">Account Information</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
