import { useState, useEffect } from "react";
import { Pencil, Camera, Mail, User, X, Sailboat } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";

const ProfilePopup = ({ isOpen, onClose }) => {
  const { authUser, isUpdatingProfile, updateProfile, updateUsername, updateDescription } = useAuthStore();

  const {t, i18n } = useTranslation();

  const [selectedImg, setSelectedImg] = useState(null);
  const [editNameMode, setEditNameMode] = useState(false);
  const [fullNameInput, setFullNameInput] = useState("");
  const [editDescriptionMode, setEditDescriptionMode] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");

  
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

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
      <div className="bg-[#fff] rounded-lg px-6 py-8 w-full max-w-sm text-black max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#fff] transition"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-black" />
        </button>

        <h1 className="text-center text-lg font-semibold mb-4">
          {t("Your profile information")}
        </h1>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-[#e9e9e9]"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-[#e9e9e9] p-2 rounded-full cursor-pointer hover:scale-105 transition"
            >
              <Camera className="w-5 h-5 text-black" />
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
          <p className="text-sm text-gray-600">
            {t("Click the camera icon to update your photo")}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <div className="flex items-center ml-3 mb-1">
              <label className="text-sm text-gray-600">{t("Username")}</label>
            </div>
            <div className="relative">
              {editNameMode ? (
                <>
                  <div className="flex items-center w-full">
                    <User className="absolute left-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full bg-[#fff] text-black rounded-lg py-3 pl-10 pr-10 outline-none"
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSubmitName()}
                      autoFocus
                    />
                    <button
                      className="absolute right-3 text-black hover:text-green-400"
                      onClick={handleSubmitName}
                    >
                      ✓
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="bg-[#fff] rounded-lg flex justify-between items-center cursor-pointer"
                  onClick={() => setEditNameMode(true)}
                >
                  <div className="flex items-center flex-1 py-2">
                    <User className="ml-3 w-5 h-5 text-black" />
                    <span className="ml-2">{authUser.fullName || "Not set"}</span>
                  </div>
                  <Pencil className="mr-3 w-5 h-5 text-black" />
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center ml-3 mb-1">
              <label className="text-sm text-gray-600">{t("About")}</label>
            </div>
            <div className="relative">
              {editDescriptionMode ? (
                <>
                  <div className="flex items-center w-full">
                    <Sailboat className="absolute left-3 w-5 h-5 text-gray-600" />
                    <input
                      type="text"
                      className="w-full bg-[#fff] text-white rounded-lg py-3 pl-10 pr-10 outline-none"
                      value={descriptionInput}
                      onChange={(e) => setDescriptionInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSubmitDescription()}
                      autoFocus
                    />
                    <button
                      className="absolute right-3 text-white hover:text-green-400"
                      onClick={handleSubmitDescription}
                    >
                      ✓
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="bg-[#fff] rounded-lg flex justify-between items-center cursor-pointer"
                  onClick={() => setEditDescriptionMode(true)}
                >
                  <div className="flex items-center flex-1 py-2">
                    <Sailboat className="ml-3 w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-black">{authUser.description || "Not set"}</span>
                  </div>
                  <Pencil className="mr-3 w-5 h-5 text-black" />
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center ml-3 mb-1">
              <label className="text-sm text-gray-600">Email Address</label>
            </div>
            <div className="flex items-center bg-[#fff] rounded-lg">
              <Mail className="ml-3 w-5 h-5 text-gray-400" />
              <span className="ml-2 py-2 text-black">{authUser.email || "Not set"}</span>
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-6 bg-[#fff] rounded-xl p-4">
            <h2 className="text-base font-semibold mb-3">{t("Account Information")}</h2>
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