import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import {  useEffect } from 'react';

const NoChatSelected = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (savedLang) {
          i18n.changeLanguage(savedLang);
        }
      }, [i18n]);

  return (
    <div className="w-full flex flex-1 flex-col bg-white items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-2">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-[#4FC3F7] " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold text-black">{t("Welcome to N-G")}</h2>
        <p className="text-base-content/60 text-black">
          {t("Select a conversation from the sidebar to start chatting")}
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
