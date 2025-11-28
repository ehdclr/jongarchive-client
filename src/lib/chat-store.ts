export interface ChatMessage {
  id: string;
  roomId: number;
  userId: number;
  userCode: string;
  nickname: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
}

export interface ChatRoom {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  isActive: boolean;
}
