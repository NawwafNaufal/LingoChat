import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const MessageInput = ({ sourceLang, targetLang }) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  const { t, i18n } = useTranslation();


   useEffect(() => {
          const savedLang = localStorage.getItem("lang");
          if (savedLang) {
            i18n.changeLanguage(savedLang);
          }
        }, [i18n]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }


    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // If no content or already loading, don't proceed
    if ((!text.trim() && !imagePreview) || isLoading) return;

    // Immediately clear input fields and set loading
    const messageText = text.trim();
    const messageImage = imagePreview;
    
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    setIsLoading(true);
    
    try {
      await sendMessage({
        text: messageText,
        image: messageImage,
        targetLang: targetLang,
        sourceLang: sourceLang
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 w-full bg-[#fff] border border-[#e9e9e9]  ">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 ">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-400"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-400
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full rounded-lg bg-[#fff] focus:ring-0 text-black px-2 py-2 outline-none text-sm sm:text-base border-none shadow-none"
            placeholder={t("Type a message...")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isLoading}
          />

          <button
            type="button"
            className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full  text-black  bg-[#bg-[#fff] hover:bg-gray-300]
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Image className= "text-black" size={20} />
          </button>
        </div>
        <button
          type="submit"
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-[#fff] text-black hover:bg-gray-300 ${isLoading ? 'opacity-50' : ''}`}
          disabled={(!text.trim() && !imagePreview) || isLoading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;