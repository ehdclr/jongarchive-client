import { create } from "zustand";

export interface Topic {
  id: string;
  title: string;
  category: string;
  description: string;
  participants: number;
  comments: number;
  isHot?: boolean;
  thumbnail?: string;
}

interface CommunityStore {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  topics: Topic[];
}

const categories = ["전체", "인문학", "스타트업", "IT 프로그래밍", "서비스·전략 기획", "마케팅", "디자인·일러스트", "자기계발"];

const mockTopics: Topic[] = [
  {
    id: "1",
    title: "2025년 프로그래밍 로드맵 정하기",
    category: "IT 프로그래밍",
    description: "신입 개발자들이 함께 고민하는 공간",
    participants: 234,
    comments: 89,
    isHot: true,
  },
  {
    id: "2",
    title: "헬창들의 자기계발 비법",
    category: "자기계발",
    description: "운동과 공부를 병행하는 방법",
    participants: 456,
    comments: 234,
    isHot: true,
  },
  {
    id: "3",
    title: "스타트업 초기 자금 모으기",
    category: "스타트업",
    description: "엔젤 투자자 찾는 팁과 경험담",
    participants: 189,
    comments: 67,
    isHot: true,
  },
  {
    id: "4",
    title: "UI/UX 디자인 패턴 분석",
    category: "디자인·일러스트",
    description: "유명한 서비스들의 디자인 시스템",
    participants: 345,
    comments: 112,
  },
  {
    id: "5",
    title: "콘텐츠 마케팅 전략",
    category: "마케팅",
    description: "SNS에서 성공하는 비법",
    participants: 267,
    comments: 95,
  },
  {
    id: "6",
    title: "철학과 기술의 만남",
    category: "인문학",
    description: "AI 시대의 인문학적 사고",
    participants: 178,
    comments: 54,
  },
  {
    id: "7",
    title: "제품 전략 세우기",
    category: "서비스·전략 기획",
    description: "B2B 서비스의 성장 전략",
    participants: 212,
    comments: 78,
  },
  {
    id: "8",
    title: "올해의 토이 프로젝트",
    category: "IT 프로그래밍",
    description: "개인 포트폴리오를 위한 프로젝트 제안",
    participants: 298,
    comments: 145,
  },
];

export const useCommunityStore = create<CommunityStore>((set) => ({
  selectedCategory: "전체",
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  topics: mockTopics,
}));

export { categories };
