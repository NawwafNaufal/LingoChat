import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageEdit from "./MessageEdit";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import MessageContextMenu from "./skeletons/ContextMenu";
import DeleteConfirmModal from "./skeletons/DeleteConfirmModal"; // Import komponen modal baru

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    updateMessage,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Indonesia");
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    messageId: null,
    messageText: "",
  });

  // Edit message state
  const [editingMessage, setEditingMessage] = useState(null);
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    messageId: null
  });

  const handleLanguageChange = (source, target) => {
    setSourceLang(source);
    setTargetLang(target);
    console.log("Source:", source, "Target:", target);
    // Bisa lanjutkan logic lain, seperti translate otomatis, dsb.
  };

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle right click on message bubble only
  const handleContextMenu = (e, message) => {
    e.preventDefault();
    
    // Only show context menu for the user's own messages
    if (message.senderId !== authUser._id) return;
    
    setContextMenu({
      visible: true,
      position: { x: e.pageX, y: e.pageY },
      messageId: message._id,
      messageText: message.text || "",
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    if (contextMenu.visible) {
      setContextMenu({
        visible: false,
        position: { x: 0, y: 0 },
        messageId: null,
        messageText: "",
      });
    }
  };

  // Handle edit message
  const handleEditMessage = () => {
    // Find the message to edit
    const messageToEdit = messages.find(msg => msg._id === contextMenu.messageId);
    if (messageToEdit) {
      setEditingMessage(messageToEdit);
    }
    closeContextMenu();
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  // Handle update message
  const handleUpdateMessage = async (updatedData) => {
    try {
      // Kirim hanya data yang diperlukan, backend akan menangani autocorrect dan translate
      await updateMessage(editingMessage._id, {
        originalText: updatedData.originalText,
        image: updatedData.image,
        sourceLang: updatedData.sourceLang || sourceLang,
        targetLang: updatedData.targetLang || targetLang
      });
      
      setEditingMessage(null); // Keluar dari mode edit setelah update
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  // Handle copy message
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(contextMenu.messageText)
      .then(() => {
        console.log("Message copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy message: ", err);
      });
    closeContextMenu();
  };
  
  // Show delete confirmation modal
  const handleDeleteMessage = () => {
    setDeleteModal({
      isOpen: true,
      messageId: contextMenu.messageId
    });
    closeContextMenu();
  };
  
  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      messageId: null
    });
  };
  
  // Confirm delete message
  const confirmDeleteMessage = () => {
    if (deleteModal.messageId) {
      deleteMessage(deleteModal.messageId);
      console.log("Deleting message:", deleteModal.messageId);
    }
    closeDeleteModal();
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader onLangChange={handleLanguageChange} />
        <MessageSkeleton />
        <MessageInput sourceLang={sourceLang} targetLang={targetLang} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader onLangChange={handleLanguageChange} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1c1c1c]" onClick={closeContextMenu}>
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
              {message.senderId === authUser._id && (
                <button 
                  className="ml-2 text-xs text-zinc-500 hover:text-zinc-300"
                  onClick={() => {
                    setEditingMessage(message);
                    closeContextMenu();
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            <div 
              className="chat-bubble flex flex-col"
              onContextMenu={(e) => handleContextMenu(e, message)}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}

              {message.originalText && (
                <p className="text-xs italic">
                  {message.correctedText}{' '}<small>({message.sourceLang})</small>
                </p>
              )}
              {/* Teks asli */}
              {message.text && (
                <p className="text-sm text-white mb-1">{message.text}{' '}<small>({message.targetLang})</small></p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <MessageContextMenu
          position={contextMenu.position}
          onClose={closeContextMenu}
          onEdit={handleEditMessage}
          onCopy={handleCopyMessage}
          onDelete={handleDeleteMessage}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteMessage}
      />

      {/* Show either edit form or normal input */}
      {editingMessage ? (
        <MessageEdit 
          message={editingMessage}
          onCancel={handleCancelEdit}
          onUpdate={handleUpdateMessage}
          sourceLang={sourceLang}
          targetLang={targetLang}
        />
      ) : (
        <MessageInput sourceLang={sourceLang} targetLang={targetLang} />
      )}
    </div>
  );
};

export default ChatContainer;