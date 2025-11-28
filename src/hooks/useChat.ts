import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '@/lib/axios';
import type { ChatMessage } from '@/lib/chat-store';

interface UseChatOptions {
  roomId: number;
  onMessage?: (message: ChatMessage) => void;
  onUserJoined?: (data: { userId: number; nickname: string; activeUsers: number }) => void;
  onUserLeft?: (data: { userId: number; nickname: string; activeUsers: number }) => void;
}

interface UseChatReturn {
  socket: Socket | null;
  isConnected: boolean;
  activeUsers: number;
  sendMessage: (content: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
}

export function useChat({ roomId, onMessage, onUserJoined, onUserLeft }: UseChatOptions): UseChatReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      console.error('No access token found');
      setIsLoading(false);
      return;
    }

    // WebSocket URL 구성
    // 개발 환경: localhost:8000 (backend)
    // 프로덕션: 현재 origin 사용
    const isDev = import.meta.env.DEV;
    const wsUrl = isDev
      ? 'http://localhost:8000'
      : window.location.origin;

    // Socket.IO 클라이언트 생성
    const socket = io(`${wsUrl}/chat`, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current = socket;

    // 연결 이벤트
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);

      // 방 입장
      socket.emit('joinRoom', { roomId }, (response: { success: boolean; roomId: number; activeUsers: number }) => {
        if (response.success) {
          console.log('Joined room:', response.roomId);
          setActiveUsers(response.activeUsers);

          // 메시지 히스토리 가져오기
          socket.emit('getMessages', { roomId, limit: 100 }, (messagesResponse: { success: boolean; messages: ChatMessage[] }) => {
            if (messagesResponse.success) {
              setMessages(messagesResponse.messages);
            }
            setIsLoading(false);
          });
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      setIsLoading(false);
    });

    // 메시지 수신
    socket.on('message', (message: ChatMessage) => {
      console.log('Message received:', message);
      setMessages((prev) => [...prev, message]);
      onMessage?.(message);
    });

    // 사용자 입장
    socket.on('userJoined', (data: { userId: number; nickname: string; activeUsers: number }) => {
      console.log('User joined:', data);
      setActiveUsers(data.activeUsers);
      onUserJoined?.(data);
    });

    // 사용자 퇴장
    socket.on('userLeft', (data: { userId: number; nickname: string; activeUsers: number }) => {
      console.log('User left:', data);
      setActiveUsers(data.activeUsers);
      onUserLeft?.(data);
    });

    // 클린업
    return () => {
      if (socket.connected) {
        socket.emit('leaveRoom', { roomId });
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, onMessage, onUserJoined, onUserLeft]);

  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !isConnected) {
      console.error('Socket not connected');
      return;
    }

    socketRef.current.emit('message', { roomId, content });
  }, [roomId, isConnected]);

  return {
    socket: socketRef.current,
    isConnected,
    activeUsers,
    sendMessage,
    messages,
    isLoading,
  };
}
