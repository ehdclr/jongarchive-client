import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// 동물 이모지 배열 (개, 돼지, 말, 소)
const ANIMAL_EMOJIS = ["🐶", "🐷", "🐴", "🐮"] as const;

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  userCode?: string;
  className?: string;
  fallbackClassName?: string;
}

/**
 * userCode를 기반으로 일관된 동물 이모지를 반환
 */
function getAnimalEmoji(userCode?: string): string {
  if (!userCode) {
    return ANIMAL_EMOJIS[Math.floor(Math.random() * ANIMAL_EMOJIS.length)];
  }
  // userCode의 문자들의 charCode 합을 이용해 인덱스 결정
  const hash = userCode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ANIMAL_EMOJIS[hash % ANIMAL_EMOJIS.length];
}

function UserAvatar({ src, name, userCode, className, fallbackClassName }: UserAvatarProps) {
  const animalEmoji = getAnimalEmoji(userCode);

  return (
    <Avatar className={cn("h-9 w-9", className)}>
      {src && <AvatarImage src={src} alt={name ?? "User"} />}
      <AvatarFallback className={cn("text-lg", fallbackClassName)}>
        {animalEmoji}
      </AvatarFallback>
    </Avatar>
  );
}

export { UserAvatar, getAnimalEmoji };
