const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`flex items-start gap-3 ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="animate-pulse bg-gray-200 size-10 rounded-full" />
          </div>

          {/* Message Block */}
          <div className="space-y-1">
            <div className="animate-pulse bg-gray-200 h-4 w-16 rounded" />
            <div className="animate-pulse bg-gray-200 h-16 w-[200px] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
