import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

//! Chat Dummy data
const messages = [
  {
    id: 1,
    avatar: "1",
    content: "Hello, how are you?",
    timestamp: "2025-01-01 12:00:00",
    nickname: "John Doe",
  },
  {
    id: 2,
    avatar: "2",
    content: "I'm fine, thank you!",
    timestamp: "2025-01-01 12:01:00",
    nickname: "Jane Doe",
  },
  {
    id: 3,
    avatar: "3",
    content: "What's your name?",
    timestamp: "2025-01-01 12:02:00",
    nickname: "John Doe",
  },
  {
    id: 4,
    avatar: "4",
    content: "My name is John Doe",
    timestamp: "2025-01-01 12:03:00",
    nickname: "Jane Doe",
    isOwn: true,
  },
];

//TODO: 나중에 react virtualized로 변경
function ChatWindow() {
  return (
    <div className="flex-1 bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-bold text-foreground">채팅방 제목</h2>
        <p className="text-xs text-muted-foreground mt-1">채팅방 설명</p>
      </div>


      {/* Messages */}
      <ScrollArea className="flex-1 p-6 py-4">
        <div className="space-y-1">
          {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border px-6 py-4 space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="메시지를 입력해주세요..."
            className="bg-input border-border"
          />
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            전송
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ChatWindow };