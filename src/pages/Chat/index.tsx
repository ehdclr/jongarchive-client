import { ChatWindow } from "@/components/chat";

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* 채팅 룸 리스트 사이드바에 추가*/} 
      {/* 채팅 창 영역 */}
      <ChatWindow />
    </div>
  );
}