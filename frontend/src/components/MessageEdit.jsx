import { useState, useEffect } from "react";
import { Send, X, Image } from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";

const MessageEdit = ({ 
  message, 
  onCancel, 
  onUpdate, 
  sourceLang, 
  targetLang 
}) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Initialize with existing message data
    if (message) {
      // Gunakan originalText - ini adalah teks asli yang diinputkan user sebelum autocorrect/translation
      setText(message.correctedText || "");
      setImagePreview(message.image || null);
    }
  }, [message]);

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

  const handleUpdateMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      setIsLoading(true);
      await onUpdate({
        originalText: text.trim(), // Kirim teks yang diinput user sebagai originalText
        image: imagePreview,
        sourceLang,
        targetLang
      });
      
      // Cancel edit mode after successful update
      onCancel();
    } catch (error) {
      console.error("Failed to update message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 w-full bg-[#fff] border border-[#e9e9e9] ">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-zinc-700 ml-3">Edit pesan</span>
        <button 
          onClick={onCancel}
          className="text-black hover:text-gray-600 flex items-center justify-center rounded-full mr-3 "
        >
          <X size={25} />
        </button>
      </div>
      
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
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
              <X className="size-12" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleUpdateMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full rounded-lg bg-[#fff] focus:ring-0 text-black px-2 py-2 outline-none text-sm sm:text-base border-none shadow-none"
            placeholder="Edit your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-black hover:bg-gray-300
                    ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className= "text-black"size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 rounded-full  bg-[#fff] text-black hover:bg-gray-300"
          disabled={!text.trim() && !imagePreview || isLoading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageEdit;