import  "react";

const MessageLoadingIndicator = () => {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
        </div>
      </div>
      <div className="chat-bubble bg-[#1AA3D8] flex justify-center items-center p-3 min-h-10 min-w-12">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageLoadingIndicator;