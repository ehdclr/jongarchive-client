import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// 동물 이모지 배열 (개, 돼지, 말, 소)
const ANIMAL_EMOJIS = ["🐶", "🐷", "🐴", "🐮"] as const;
const ADMIN_EMOJI = "👑";

type UserRole = "admin" | "moderator" | "user";

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  userId?: number;
  userCode?: string;
  role?: UserRole;
  className?: string;
  fallbackClassName?: string;
}

/**
 * userId 또는 userCode를 기반으로 일관된 동물 이모지를 반환
 * admin은 항상 왕관 이모지
 */
function getAnimalEmoji(userId?: number, userCode?: string, role?: UserRole): string {
  if (role === "admin") {
    return ADMIN_EMOJI;
  }
  // userId가 있으면 userId로 결정 (항상 존재하고 불변)
  if (userId) {
    return ANIMAL_EMOJIS[userId % ANIMAL_EMOJIS.length];
  }
  // userCode가 있으면 userCode로 결정
  if (userCode) {
    const hash = userCode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ANIMAL_EMOJIS[hash % ANIMAL_EMOJIS.length];
  }
  // 둘 다 없으면 기본값
  return ANIMAL_EMOJIS[0];
}

function UserAvatar({ src, name, userId, userCode, role, className, fallbackClassName }: UserAvatarProps) {
  const emoji = getAnimalEmoji(userId, userCode, role);
  // 빈 문자열도 falsy로 처리하여 이미지가 없으면 동물 이모지 표시
  const hasImage = !!src && src.length > 0;

  return (
    <Avatar className={cn("h-9 w-9", className)}>
      {hasImage && <AvatarImage src={src} alt={name ?? "User"} />}
      <AvatarFallback className={cn("text-lg", fallbackClassName)}>
        {emoji}
      </AvatarFallback>
    </Avatar>
  );
}

export { UserAvatar, getAnimalEmoji };
