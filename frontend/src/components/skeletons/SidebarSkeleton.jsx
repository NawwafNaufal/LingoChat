
const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-24 lg:w-96 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <span className="font-medium hidden text-4xl lg:block">Chats</span>
        </div>
        
        {/* Search Input Skeleton */}
        <div className="mt-4">
          <div className="relative">
            <div className="skeleton w-full h-10 rounded-md"></div>
          </div>
        </div>
        
        {/* Toggle Show Online Only Skeleton */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <div className="skeleton h-4 w-4 rounded"></div>
          <div className="skeleton h-4 w-32 rounded"></div>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;