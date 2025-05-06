import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useTranslation } from "react-i18next";

const PopUpPorfile = ({ userId, onClose }) => {
  const { getUserProfile, userProfile, isLoadingProfile, clearUserProfile } = useChatStore();
  const [error, setError] = useState(null);

  const { t, i18n } = useTranslation();
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        if (!data) setError("Gagal memuat profil pengguna");
      } catch {
        setError("Terjadi kesalahan saat memuat profil");
      }
    };

    if (userId) {
      loadUserProfile();
    }

    return () => clearUserProfile();
  }, [userId, getUserProfile, clearUserProfile]);

  if (!userId) return null;

  const handleContainerClick = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleContainerClick}
    >
      <div className="bg-[#fff] rounded-lg w-full max-w-xs p-6 relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-black"
        >
          <X size={20} />
        </button>

        {isLoadingProfile ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 py-6 text-center">{error}</div>
        ) : userProfile ? (
          <div className="flex flex-col items-center text-black">
            {/* Avatar */}
            <div className="avatar mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden text-black">
                <img
                  src={userProfile.profilePic || "/avatar.png"}
                  alt={userProfile.fullName}
                  className="w-full h-full object-cover text-black"
                />
              </div>
            </div>

            {/* Nama dan Deskripsi */}
            <h2 className="text-lg font-bold mb-1">{userProfile.fullName}</h2>
            <p className="text-black text-center text-sm mb-2">
              {userProfile.description || "No description"}
            </p>

            {/* Info Email & Status */}
            <div className="w-full border-t border-gray-700 pt-3 mt-3 space-y-3">
              <div>
                <label className="text-gray-600 text-sm">Email</label>
                <p className="text-black text-sm">{userProfile.email}</p>
              </div>
              <div>
              <label className="text-gray-600 text-sm">Status Akun</label>
  <p className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm mt-1 text-center w-fit">
    Aktif
  </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 py-6 text-center">Pengguna tidak ditemukan</div>
        )}
      </div>
    </div>
  );
};

export default PopUpPorfile;
