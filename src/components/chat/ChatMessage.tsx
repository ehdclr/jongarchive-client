"use client"

import type { ChatMessage } from "@/lib/chat-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: ChatMessage
}

const animalEmojis = ["🐺", "🐷", "🐻", "🐯", "🦁"]

export function ChatMessage({ message }: ChatMessageProps) {
  const avatarEmoji = animalEmojis[Number.parseInt(message.avatar) % animalEmojis.length]

  if (message.isOwn) {
    return (
      <div className="flex justify-end mb-3 gap-2">
        <div className="max-w-xs">
          <div className="text-xs text-muted-foreground text-right mb-1">{message.timestamp}</div>
          <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-2 text-sm">{message.content}</div>
        </div>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-lg">{avatarEmoji}</AvatarFallback>
        </Avatar>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mb-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-lg">{avatarEmoji}</AvatarFallback>
      </Avatar>
      <div className="max-w-xs">
        <div className="text-xs font-semibold text-foreground mb-1">{message.nickname}</div>
        <div className="bg-muted text-foreground rounded-2xl px-4 py-2 text-sm">{message.content}</div>
        <div className="text-xs text-muted-foreground mt-1">{message.timestamp}</div>
      </div>
    </div>
  )
}
