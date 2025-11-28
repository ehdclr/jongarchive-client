import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Virtuoso } from "react-virtuoso";
import { ChatMessage } from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "@/lib/chat-store";

//! Chat Dummy data - 100개의 메시지 (최근 7일간)
const generateDummyMessages = (): ChatMessageType[] => {
  const messages: ChatMessageType[] = [];
  const users = [
    { nickname: "김철수", avatar: "1" },
    { nickname: "이영희", avatar: "2" },
    { nickname: "박지민", avatar: "3" },
    { nickname: "최수진", avatar: "4" },
    { nickname: "나", avatar: "0" }, // 본인
  ];

  const messageContents = [
    "안녕하세요!",
    "반가워요 😊",
    "오늘 날씨가 좋네요",
    "점심 뭐 드셨어요?",
    "저는 김치찌개 먹었어요",
    "오늘 회의 몇 시에 있나요?",
    "3시에 있습니다",
    "알겠습니다, 감사합니다",
    "혹시 이 문서 확인하셨나요?",
    "네, 확인했습니다",
    "좋은 하루 보내세요!",
    "수고하세요~",
    "내일 뵙겠습니다",
    "좋은 주말 되세요!",
    "감사합니다 ^^",
    "ㅎㅎㅎ",
    "ㄱㄱ",
    "넵!",
    "알겠습니다",
    "좋아요!",
  ];

  const now = new Date();

  for (let i = 0; i < 100; i++) {
    // 최근 7일 내 랜덤 시간
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const secondsAgo = Math.floor(Math.random() * 60);

    const messageDate = new Date(now);
    messageDate.setDate(messageDate.getDate() - daysAgo);
    messageDate.setHours(messageDate.getHours() - hoursAgo);
    messageDate.setMinutes(messageDate.getMinutes() - minutesAgo);
    messageDate.setSeconds(messageDate.getSeconds() - secondsAgo);

    const userIndex = Math.floor(Math.random() * users.length);
    const user = users[userIndex];
    const contentIndex = Math.floor(Math.random() * messageContents.length);

    messages.push({
      id: i + 1,
      avatar: user.avatar,
      nickname: user.nickname,
      content: messageContents[contentIndex],
      timestamp: messageDate.toISOString().slice(0, 19).replace('T', ' '),
      isOwn: user.nickname === "나",
    });
  }

  // 시간순으로 정렬 (오래된 것부터)
  return messages.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

const messages = generateDummyMessages();

function ChatWindow() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex-1 bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-bold text-foreground">채팅방 제목</h2>
        <p className="text-xs text-muted-foreground mt-1">채팅방 설명</p>
      </div>

      {/* Messages - Virtualized */}
      <div className="flex-1 overflow-hidden">
        <Virtuoso
          data={messages}
          initialTopMostItemIndex={messages.length - 1} // 최신 메시지(맨 아래)로 스크롤
          itemContent={(index, message) => (
            <div className="px-6 py-1">
              <ChatMessage key={message.id} message={message} />
            </div>
          )}
          followOutput="smooth" // 새 메시지가 추가되면 자동으로 스크롤
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
                // TODO: 웹소켓으로 메시지 전송
                console.log("메시지 전송:", inputValue);
                setInputValue("");
              }
            }}
          />
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              // TODO: 웹소켓으로 메시지 전송
              console.log("메시지 전송:", inputValue);
              setInputValue("");
            }}
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ChatWindow };