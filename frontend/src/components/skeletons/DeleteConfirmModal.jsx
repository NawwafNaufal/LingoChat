import "react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-sm mx-4 overflow-hidden shadow-xl">
        <div className="p-6">
          <h3 className="text-xl font-medium text-white mb-2">Delete message?</h3>
          <p className="text-zinc-400 text-sm">
            This has no effect on your recipients chats.
          </p>
        </div>
        
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-medium transition-colors rounded-md"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;