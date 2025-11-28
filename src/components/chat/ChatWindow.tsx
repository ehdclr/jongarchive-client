import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Virtuoso } from "react-virtuoso";
import { ChatMessage } from "./ChatMessage";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";

function ChatWindow() {
  const [inputValue, setInputValue] = useState("");
  const { user } = useAuthStore();

  // TODO: 실제 roomId를 props로 받거나 URL 파라미터에서 가져오기
  const roomId = 1;

  const { messages, sendMessage, isConnected, activeUsers, isLoading } = useChat({
    roomId,
    onMessage: (message) => {
      console.log('New message:', message);
    },
    onUserJoined: (data) => {
      toast.info(`${data.nickname}님이 입장했습니다`);
    },
    onUserLeft: (data) => {
      toast.info(`${data.nickname}님이 퇴장했습니다`);
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      return;
    }

    if (!isConnected) {
      toast.error('채팅 서버에 연결되지 않았습니다');
      return;
    }

    sendMessage(inputValue.trim());
    setInputValue("");
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center">
        <p className="text-muted-foreground">채팅방에 연결 중...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">채팅방 제목</h2>
            <p className="text-xs text-muted-foreground mt-1">채팅방 설명</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <p className="text-sm text-muted-foreground">
              {activeUsers}명 접속중
            </p>
          </div>
        </div>
      </div>

      {/* Messages - Virtualized */}
      <div className="flex-1 overflow-hidden">
        <Virtuoso
          data={messages}
          initialTopMostItemIndex={messages.length > 0 ? messages.length - 1 : 0}
          itemContent={(index, message) => {
            const isOwn = user?.userCode === message.userCode;
            return (
              <div className="px-6 py-1">
                <ChatMessage
                  key={message.id}
                  message={{ ...message, isOwn }}
                />
              </div>
            );
          }}
          followOutput="smooth"
        />
      </div>

      {/* Input Area */}
      <div className="border-t border-border px-6 py-4 space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="메시지를 입력해주세요..."
            className="bg-input border-border"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={!isConnected}
          />
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSendMessage}
            disabled={!isConnected || !inputValue.trim()}
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ChatWindow };