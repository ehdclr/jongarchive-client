export interface ChatMessage {
  id: number;
  avatar: string;
  content: string;
  timestamp: string;
  nickname: string;
  isOwn?: boolean;
}

export interface ChatRoom {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  isActive: boolean;
}
