import { useChatStore } from "../store/useChatStore";
import AllChat from "../components/AllChat";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const AllChats = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-[#111111] overflow-hidden">
      <div className="flex h-full w-full">
        <div className="h-full">
          <AllChat />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default AllChats;