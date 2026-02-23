import type { Post, PostListItem } from '@/lib/types';
import { categories } from './categories';
import { universities } from './universities';
import { getUserSummary } from './users';

export const mockPosts: Post[] = [
  // ===== 서울대 마켓 =====
  { id: 'p1', title: '맥북 프로 M2 14인치 팝니다', body: '2024년 구매, 배터리 사이클 50회, 기스 없이 깨끗합니다. 충전기, 케이스 포함. 관악 정문 근처 거래 희망합니다.', authorId: 'u1', universityId: 1, categoryMajorId: 1, categoryMinorId: 12, price: 1450000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: '서울대 정문 GS25 앞', viewCount: 142, likeCount: 12, bumpedAt: '2026-02-20T09:00:00Z', createdAt: '2026-02-20T08:30:00Z', updatedAt: '2026-02-20T08:30:00Z' },
  { id: 'p2', title: '경영학원론 교재 팝니다 (박정호 저)', body: '한 학기 사용, 밑줄 약간 있습니다. 정가 35,000원 → 15,000원에 팝니다.', authorId: 'u1', universityId: 1, categoryMajorId: 1, categoryMinorId: 11, price: 15000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '경영대 앞 벤치', viewCount: 38, likeCount: 3, bumpedAt: '2026-02-20T08:00:00Z', createdAt: '2026-02-19T14:00:00Z', updatedAt: '2026-02-19T14:00:00Z' },
  { id: 'p3', title: '자취 책상 + 의자 세트 무료나눔', body: '졸업하면서 정리합니다. 이케아 책상(120cm)과 의자 세트. 직접 가져가실 분! 관악구 봉천동.', authorId: 'u5', universityId: 1, categoryMajorId: 1, categoryMinorId: 16, price: 0, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '봉천동 자취방', viewCount: 256, likeCount: 34, bumpedAt: '2026-02-20T07:30:00Z', createdAt: '2026-02-18T10:00:00Z', updatedAt: '2026-02-18T10:00:00Z' },
  { id: 'p4', title: '아이패드 에어 5세대 + 애플펜슬', body: '필기용으로 사용했습니다. 64GB 와이파이 모델. 액정 필름 부착 상태. 박스 있음.', authorId: 'u2', universityId: 1, categoryMajorId: 1, categoryMinorId: 12, price: 480000, priceNegotiable: true, isPremium: false, status: 'reserved', locationDetail: '공대 카페', viewCount: 89, likeCount: 7, bumpedAt: '2026-02-19T16:00:00Z', createdAt: '2026-02-19T12:00:00Z', updatedAt: '2026-02-19T12:00:00Z' },
  { id: 'p5', title: '통계학 입문 교재 (박스 미개봉)', body: '잘못 주문해서 미개봉 상태입니다. 정가 28,000원.', authorId: 'u2', universityId: 1, categoryMajorId: 1, categoryMinorId: 11, price: 20000, priceNegotiable: false, isPremium: false, status: 'completed', locationDetail: null, viewCount: 22, likeCount: 1, bumpedAt: '2026-02-19T10:00:00Z', createdAt: '2026-02-19T10:00:00Z', updatedAt: '2026-02-19T10:00:00Z' },

  // ===== 서울대 주거 =====
  { id: 'p6', title: '관악 원룸 양도 (보증금 300/월 35)', body: '3월부터 입주 가능. 풀옵션(에어컨, 세탁기, 냉장고). 서울대입구역 도보 7분. 2층 남향.', authorId: 'u5', universityId: 1, categoryMajorId: 2, categoryMinorId: 21, price: 350000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '관악구 봉천동', viewCount: 312, likeCount: 28, bumpedAt: '2026-02-20T10:00:00Z', createdAt: '2026-02-17T09:00:00Z', updatedAt: '2026-02-17T09:00:00Z' },
  { id: 'p7', title: '룸메이트 구합니다 (여성, 관악)', body: '투룸 중 작은방 사용. 월 25만원 (관리비 포함). 3월~8월. 깔끔하고 조용한 분 원합니다.', authorId: 'u1', universityId: 1, categoryMajorId: 2, categoryMinorId: 22, price: 250000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '관악구 신림동', viewCount: 98, likeCount: 5, bumpedAt: '2026-02-19T20:00:00Z', createdAt: '2026-02-18T15:00:00Z', updatedAt: '2026-02-18T15:00:00Z' },

  // ===== 서울대 일자리 =====
  { id: 'p8', title: '수학 과외 학생 구합니다 (고2)', body: '수학 상위권 학생. 주 2회, 회당 2시간. 시급 40,000원. 관악구 또는 서초구.', authorId: 'u2', universityId: 1, categoryMajorId: 3, categoryMinorId: 32, price: 40000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: null, viewCount: 67, likeCount: 4, bumpedAt: '2026-02-20T06:00:00Z', createdAt: '2026-02-19T09:00:00Z', updatedAt: '2026-02-19T09:00:00Z' },
  { id: 'p9', title: '[급구] 편의점 알바 (야간)', body: 'GS25 서울대입구점. 22시~07시, 시급 12,000원. 주 3~4회 가능한 분.', authorId: 'u5', universityId: 1, categoryMajorId: 3, categoryMinorId: 31, price: 12000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '서울대입구역 2번 출구', viewCount: 45, likeCount: 2, bumpedAt: '2026-02-20T11:00:00Z', createdAt: '2026-02-20T07:00:00Z', updatedAt: '2026-02-20T07:00:00Z' },
  { id: 'p10', title: 'AI 연구실 학부연구생(RA) 모집', body: 'NLP 연구실에서 학부연구생을 모집합니다. Python, PyTorch 경험자 우대. 월 50만원.', authorId: 'u4', universityId: 1, categoryMajorId: 3, categoryMinorId: 34, price: 500000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '공대 302동 연구실', viewCount: 203, likeCount: 19, bumpedAt: '2026-02-19T14:00:00Z', createdAt: '2026-02-16T11:00:00Z', updatedAt: '2026-02-16T11:00:00Z' },

  // ===== 서울대 커뮤니티 =====
  { id: 'p11', title: 'TOEIC 스터디 모집 (목표 900+)', body: '주 2회 도서관 스터디. 3월~5월 시험 대비. 현재 3명, 2명 더 모집합니다.', authorId: 'u1', universityId: 1, categoryMajorId: 4, categoryMinorId: 41, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '중앙도서관 스터디룸', viewCount: 56, likeCount: 8, bumpedAt: '2026-02-19T18:00:00Z', createdAt: '2026-02-19T18:00:00Z', updatedAt: '2026-02-19T18:00:00Z' },
  { id: 'p12', title: '에어팟 프로 분실 (중앙도서관)', body: '2/18 오후 3시경 중앙도서관 3층에서 에어팟 프로(화이트) 분실했습니다. 찾으시면 연락 부탁드립니다.', authorId: 'u2', universityId: 1, categoryMajorId: 4, categoryMinorId: 44, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '중앙도서관 3층', viewCount: 120, likeCount: 0, bumpedAt: '2026-02-19T15:30:00Z', createdAt: '2026-02-18T16:00:00Z', updatedAt: '2026-02-18T16:00:00Z' },

  // ===== 연세대 마켓 =====
  { id: 'p13', title: '닌텐도 스위치 OLED + 게임 3개', body: '젤다, 마리오카트, 동물의숲 포함. 1년 사용, 깨끗합니다. 신촌역 근처 거래.', authorId: 'u6', universityId: 2, categoryMajorId: 1, categoryMinorId: 12, price: 280000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: '신촌역 2번 출구', viewCount: 75, likeCount: 9, bumpedAt: '2026-02-20T08:30:00Z', createdAt: '2026-02-19T20:00:00Z', updatedAt: '2026-02-19T20:00:00Z' },
  { id: 'p14', title: '미시경제학 원론 교재 (Mankiw)', body: 'Principles of Economics 9th Edition. 영문판. 상태 양호.', authorId: 'u6', universityId: 2, categoryMajorId: 1, categoryMinorId: 11, price: 18000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '연세대 학생회관', viewCount: 31, likeCount: 2, bumpedAt: '2026-02-19T12:00:00Z', createdAt: '2026-02-19T12:00:00Z', updatedAt: '2026-02-19T12:00:00Z' },
  { id: 'p15', title: '겨울 패딩 (노스페이스 눕시)', body: 'Black, L사이즈. 작년 겨울 구매. 세탁 완료. 정가 32만원.', authorId: 'u6', universityId: 2, categoryMajorId: 1, categoryMinorId: 14, price: 150000, priceNegotiable: true, isPremium: false, status: 'reserved', locationDetail: null, viewCount: 43, likeCount: 5, bumpedAt: '2026-02-18T14:00:00Z', createdAt: '2026-02-17T11:00:00Z', updatedAt: '2026-02-17T11:00:00Z' },

  // ===== 연세대 주거 =====
  { id: 'p16', title: '신촌 원룸 양도 (보증금 500/월 45)', body: '신촌역 도보 5분. 3층 남향. 풀옵션. 4월부터 입주 가능.', authorId: 'u6', universityId: 2, categoryMajorId: 2, categoryMinorId: 21, price: 450000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: '신촌동', viewCount: 189, likeCount: 15, bumpedAt: '2026-02-20T09:30:00Z', createdAt: '2026-02-18T08:00:00Z', updatedAt: '2026-02-18T08:00:00Z' },

  // ===== 연세대 캠퍼스 비즈니스 =====
  { id: 'p17', title: '[학생할인 20%] 정호네 분식 전메뉴', body: '학생증 제시 시 전 메뉴 20% 할인! 떡볶이, 순대, 튀김, 라면. 2월 한정 이벤트.', authorId: 'u3', universityId: 2, categoryMajorId: 6, categoryMinorId: 62, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '연세대 정문 앞 50m', viewCount: 423, likeCount: 67, bumpedAt: '2026-02-20T07:00:00Z', createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z' },
  { id: 'p18', title: '[신규오픈] 루프탑 카페 "신촌하늘"', body: '연세대 후문 근처 루프탑 카페 오픈! 오픈 기념 아메리카노 2,000원. 인스타 @sinchon_sky', authorId: 'u8', universityId: 2, categoryMajorId: 6, categoryMinorId: 63, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '연세대 후문 도보 3분', viewCount: 567, likeCount: 89, bumpedAt: '2026-02-20T10:30:00Z', createdAt: '2026-02-14T09:00:00Z', updatedAt: '2026-02-14T09:00:00Z' },

  // ===== 고려대 마켓 =====
  { id: 'p19', title: '삼성 갤럭시 버즈3 프로 (미개봉)', body: '이벤트 당첨 상품. 미개봉 새상품. 정가 299,000원.', authorId: 'u7', universityId: 3, categoryMajorId: 1, categoryMinorId: 12, price: 200000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: '안암역 1번 출구', viewCount: 134, likeCount: 18, bumpedAt: '2026-02-20T08:00:00Z', createdAt: '2026-02-19T18:00:00Z', updatedAt: '2026-02-19T18:00:00Z' },
  { id: 'p20', title: '영어영문학개론 교재 + 노트', body: '수업 노트와 교재 함께 드립니다. A+ 받은 수업자료. 정가 25,000원.', authorId: 'u7', universityId: 3, categoryMajorId: 1, categoryMinorId: 11, price: 12000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '고려대 중앙광장', viewCount: 28, likeCount: 4, bumpedAt: '2026-02-19T09:00:00Z', createdAt: '2026-02-19T09:00:00Z', updatedAt: '2026-02-19T09:00:00Z' },
  { id: 'p21', title: 'CGV 영화 관람권 2매 (3월 만료)', body: '사용하지 못해서 팝니다. 정가 14,000원/매.', authorId: 'u7', universityId: 3, categoryMajorId: 1, categoryMinorId: 15, price: 20000, priceNegotiable: false, isPremium: false, status: 'completed', locationDetail: null, viewCount: 55, likeCount: 6, bumpedAt: '2026-02-19T16:00:00Z', createdAt: '2026-02-18T14:00:00Z', updatedAt: '2026-02-18T14:00:00Z' },

  // ===== 고려대 일자리 =====
  { id: 'p22', title: '영어 과외 구합니다 (초등 5학년)', body: '주 1회, 2시간. 시급 35,000원. 성북구 안암동. 원어민 수준 발음 필수.', authorId: 'u7', universityId: 3, categoryMajorId: 3, categoryMinorId: 32, price: 35000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '안암동', viewCount: 38, likeCount: 3, bumpedAt: '2026-02-20T05:00:00Z', createdAt: '2026-02-19T11:00:00Z', updatedAt: '2026-02-19T11:00:00Z' },
  { id: 'p23', title: '사회학과 TA 모집 (2026 1학기)', body: '사회학개론 수업 TA를 모집합니다. 석사과정 이상. 학기당 200만원.', authorId: 'u4', universityId: 3, categoryMajorId: 3, categoryMinorId: 34, price: 2000000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '고려대 사회관 305호', viewCount: 87, likeCount: 11, bumpedAt: '2026-02-18T10:00:00Z', createdAt: '2026-02-15T14:00:00Z', updatedAt: '2026-02-15T14:00:00Z' },

  // ===== 고려대 커뮤니티 =====
  { id: 'p24', title: '안암 → 강남 카풀 (월~금 오전)', body: '매일 오전 8시 출발. 기름값 나눠요. 1~2명 모집.', authorId: 'u7', universityId: 3, categoryMajorId: 4, categoryMinorId: 43, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '안암역 3번 출구', viewCount: 34, likeCount: 2, bumpedAt: '2026-02-20T04:00:00Z', createdAt: '2026-02-19T22:00:00Z', updatedAt: '2026-02-19T22:00:00Z' },

  // ===== 서비스 게시글 =====
  { id: 'p25', title: '이사 도와드립니다 (관악/신림)', body: '1톤 트럭 보유. 원룸 이사 5만원부터. 가구 옮기기 가능. 전화 주세요.', authorId: 'u5', universityId: 1, categoryMajorId: 5, categoryMinorId: 51, price: 50000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: '관악구 전체', viewCount: 78, likeCount: 6, bumpedAt: '2026-02-19T08:00:00Z', createdAt: '2026-02-17T10:00:00Z', updatedAt: '2026-02-17T10:00:00Z' },
  { id: 'p26', title: '기타 레슨 (초급~중급)', body: '홍대 실용음악과 출신. 어쿠스틱/일렉 모두 가능. 주 1회, 회당 3만원. 연세대 근처.', authorId: 'u6', universityId: 2, categoryMajorId: 5, categoryMinorId: 53, price: 30000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '신촌 연습실', viewCount: 42, likeCount: 3, bumpedAt: '2026-02-18T20:00:00Z', createdAt: '2026-02-16T15:00:00Z', updatedAt: '2026-02-16T15:00:00Z' },

  // ===== 추가 게시글 (다양성) =====
  { id: 'p27', title: '해커톤 팀원 모집 (프론트엔드)', body: '3월 초 교내 해커톤 참가 예정. React/Next.js 가능한 프론트 개발자 1명 구합니다.', authorId: 'u2', universityId: 1, categoryMajorId: 4, categoryMinorId: 41, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: null, viewCount: 92, likeCount: 14, bumpedAt: '2026-02-20T06:30:00Z', createdAt: '2026-02-19T13:00:00Z', updatedAt: '2026-02-19T13:00:00Z' },
  { id: 'p28', title: '방학 단기 임대 (2개월)', body: '교환학생 귀국으로 2~3월 단기 임대합니다. 안암동 풀옵션 원룸.', authorId: 'u7', universityId: 3, categoryMajorId: 2, categoryMinorId: 24, price: 400000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: '안암동', viewCount: 67, likeCount: 7, bumpedAt: '2026-02-19T11:00:00Z', createdAt: '2026-02-17T16:00:00Z', updatedAt: '2026-02-17T16:00:00Z' },
  { id: 'p29', title: '카페 알바 구합니다 (신촌)', body: '주말 포함 주 3회. 시급 11,000원 + 음료 무료. 바리스타 경험자 우대.', authorId: 'u8', universityId: 2, categoryMajorId: 3, categoryMinorId: 31, price: 11000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '신촌 카페거리', viewCount: 156, likeCount: 21, bumpedAt: '2026-02-20T07:30:00Z', createdAt: '2026-02-18T09:00:00Z', updatedAt: '2026-02-18T09:00:00Z' },
  { id: 'p30', title: '웹 개발 외주 받습니다', body: 'React, Next.js 전문. 포트폴리오 사이트부터 간단한 웹앱까지. 학생 할인 적용.', authorId: 'u2', universityId: 1, categoryMajorId: 5, categoryMinorId: 55, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: null, viewCount: 63, likeCount: 5, bumpedAt: '2026-02-18T13:00:00Z', createdAt: '2026-02-16T20:00:00Z', updatedAt: '2026-02-16T20:00:00Z' },

  // ===== KAIST 마켓 =====
  { id: 'p31', title: 'LG 그램 17인치 팝니다 (i7, 16GB)', body: '2025년 구매, 경량 노트북. 배터리 상태 우수. 충전기 포함. 어은동 직거래.', authorId: 'u9', universityId: 4, categoryMajorId: 1, categoryMinorId: 12, price: 980000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: 'KAIST 북문 CU 앞', viewCount: 67, likeCount: 8, bumpedAt: '2026-02-20T09:30:00Z', createdAt: '2026-02-19T15:00:00Z', updatedAt: '2026-02-19T15:00:00Z' },
  { id: 'p32', title: '알고리즘 교재 CLRS (Introduction to Algorithms)', body: '3판 영문판. 상태 양호, 연필 밑줄 약간. 정가 50,000원 → 20,000원.', authorId: 'u10', universityId: 4, categoryMajorId: 1, categoryMinorId: 11, price: 20000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: 'KAIST 도서관 앞', viewCount: 45, likeCount: 5, bumpedAt: '2026-02-19T18:00:00Z', createdAt: '2026-02-19T11:00:00Z', updatedAt: '2026-02-19T11:00:00Z' },
  { id: 'p33', title: '자취 냉장고 무료나눔 (삼성 160L)', body: '졸업 정리합니다. 직접 가져가실 분만. 어은동 위치. 상태 양호.', authorId: 'u9', universityId: 4, categoryMajorId: 1, categoryMinorId: 16, price: 0, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '어은동 자취방', viewCount: 189, likeCount: 22, bumpedAt: '2026-02-20T08:00:00Z', createdAt: '2026-02-18T09:00:00Z', updatedAt: '2026-02-18T09:00:00Z' },

  // ===== KAIST 주거 =====
  { id: 'p34', title: '어은동 원룸 양도 (보증금 200/월 30)', body: 'KAIST 북문 도보 3분. 풀옵션. 3월 입주 가능. 조용한 동네.', authorId: 'u10', universityId: 4, categoryMajorId: 2, categoryMinorId: 21, price: 300000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: '어은동', viewCount: 145, likeCount: 13, bumpedAt: '2026-02-20T10:00:00Z', createdAt: '2026-02-17T14:00:00Z', updatedAt: '2026-02-17T14:00:00Z' },

  // ===== KAIST 일자리 =====
  { id: 'p35', title: 'ML 연구실 인턴 모집 (학부생 환영)', body: 'KAIST AI 연구실에서 학부 인턴 모집. Python, PyTorch 기본 가능자. 월 60만원. 주 20시간.', authorId: 'u9', universityId: 4, categoryMajorId: 3, categoryMinorId: 34, price: 600000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: 'KAIST E3-1동 연구실', viewCount: 234, likeCount: 31, bumpedAt: '2026-02-20T07:00:00Z', createdAt: '2026-02-16T10:00:00Z', updatedAt: '2026-02-16T10:00:00Z' },
  { id: 'p36', title: '코딩 과외 (Python/C++ 기초)', body: '전산학부 재학생입니다. 프로그래밍 입문자 대상. 주 1~2회, 시급 35,000원.', authorId: 'u9', universityId: 4, categoryMajorId: 3, categoryMinorId: 32, price: 35000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: '유성구 카페', viewCount: 52, likeCount: 4, bumpedAt: '2026-02-19T14:00:00Z', createdAt: '2026-02-18T16:00:00Z', updatedAt: '2026-02-18T16:00:00Z' },

  // ===== KAIST 커뮤니티 =====
  { id: 'p37', title: 'ICPC 스터디 모집 (알고리즘 대회)', body: 'ACM-ICPC 대비 알고리즘 스터디. 주 2회 모여서 문제풀이. Codeforces 1600+ 수준.', authorId: 'u9', universityId: 4, categoryMajorId: 4, categoryMinorId: 41, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: 'KAIST 팩토리', viewCount: 78, likeCount: 12, bumpedAt: '2026-02-20T06:00:00Z', createdAt: '2026-02-19T10:00:00Z', updatedAt: '2026-02-19T10:00:00Z' },

  // ===== KAIST 캠퍼스라이프 =====
  { id: 'p38', title: '[학생할인] 대전 맛집왕 추천 맛집 10% 할인', body: '대전 유성구 맛집 10곳 제휴! 학생증 제시 시 10% 할인. 성심당, 궁중해장국 등.', authorId: 'u11', universityId: 4, categoryMajorId: 6, categoryMinorId: 62, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: '대전 유성구 일대', viewCount: 345, likeCount: 56, bumpedAt: '2026-02-20T11:00:00Z', createdAt: '2026-02-14T08:00:00Z', updatedAt: '2026-02-14T08:00:00Z' },

  // ===== 긱·의뢰 =====
  { id: 'p39', title: '졸업논문 영문교정 의뢰 (5000단어)', body: '경영학과 졸업논문 영문교정 부탁드립니다. 학술논문 형식. 2/28까지 완료 희망. 단가 협의.', authorId: 'u1', universityId: 1, categoryMajorId: 7, categoryMinorId: 72, price: 80000, priceNegotiable: true, isPremium: false, status: 'active', locationDetail: null, viewCount: 34, likeCount: 2, bumpedAt: '2026-02-21T09:00:00Z', createdAt: '2026-02-21T09:00:00Z', updatedAt: '2026-02-21T09:00:00Z' },
  { id: 'p40', title: '[급구] 팀프로젝트 발표 PPT 디자인', body: '3/3 발표용 PPT 20장 디자인 의뢰합니다. 깔끔한 비즈니스 스타일. 내용은 제공합니다.', authorId: 'u6', universityId: 2, categoryMajorId: 7, categoryMinorId: 73, price: 50000, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: null, viewCount: 21, likeCount: 1, bumpedAt: '2026-02-21T07:00:00Z', createdAt: '2026-02-21T07:00:00Z', updatedAt: '2026-02-21T07:00:00Z' },
  { id: 'p41', title: '설문조사 참여자 모집 (소정의 사례)', body: 'UX 연구 관련 설문 (약 10분 소요). 참여 시 커피 쿠폰 증정. 대학생 누구나 참여 가능.', authorId: 'u9', universityId: 4, categoryMajorId: 7, categoryMinorId: 75, price: null, priceNegotiable: false, isPremium: false, status: 'active', locationDetail: 'KAIST 캠퍼스 내', viewCount: 67, likeCount: 8, bumpedAt: '2026-02-20T15:00:00Z', createdAt: '2026-02-20T15:00:00Z', updatedAt: '2026-02-20T15:00:00Z' },
];

const postImages: Record<string, string[]> = {
  p1: ['https://picsum.photos/seed/macbook1/600/400', 'https://picsum.photos/seed/macbook2/600/400'],
  p3: ['https://picsum.photos/seed/desk1/600/400'],
  p4: ['https://picsum.photos/seed/ipad1/600/400', 'https://picsum.photos/seed/ipad2/600/400'],
  p6: ['https://picsum.photos/seed/room1/600/400', 'https://picsum.photos/seed/room2/600/400', 'https://picsum.photos/seed/room3/600/400'],
  p13: ['https://picsum.photos/seed/switch1/600/400'],
  p15: ['https://picsum.photos/seed/padding1/600/400'],
  p16: ['https://picsum.photos/seed/sinchon1/600/400', 'https://picsum.photos/seed/sinchon2/600/400'],
  p17: ['https://picsum.photos/seed/food1/600/400'],
  p18: ['https://picsum.photos/seed/cafe1/600/400', 'https://picsum.photos/seed/cafe2/600/400'],
  p19: ['https://picsum.photos/seed/buds1/600/400'],
  p25: ['https://picsum.photos/seed/truck1/600/400'],
  p28: ['https://picsum.photos/seed/shortroom1/600/400'],
  p31: ['https://picsum.photos/seed/lggram1/600/400', 'https://picsum.photos/seed/lggram2/600/400'],
  p33: ['https://picsum.photos/seed/fridge1/600/400'],
  p34: ['https://picsum.photos/seed/eoeun1/600/400', 'https://picsum.photos/seed/eoeun2/600/400'],
  p38: ['https://picsum.photos/seed/djfood1/600/400'],
};

const postTags: Record<string, string[]> = {
  p1: ['맥북', '노트북', 'M2', '애플'],
  p2: ['경영학', '교재', '중고책'],
  p4: ['아이패드', '태블릿', '애플'],
  p6: ['원룸', '관악', '풀옵션'],
  p8: ['수학', '과외', '고등학교'],
  p10: ['AI', 'NLP', '연구실', 'RA'],
  p13: ['닌텐도', '스위치', '게임'],
  p17: ['학생할인', '분식', '맛집'],
  p27: ['해커톤', 'React', '프론트엔드'],
  p31: ['LG그램', '노트북', '경량'],
  p32: ['알고리즘', 'CLRS', '교재', '전산'],
  p35: ['ML', 'AI', '인턴', '연구실'],
  p37: ['ICPC', '알고리즘', '스터디', '대회'],
  p38: ['대전맛집', '학생할인', '성심당'],
};

export function getPostImages(postId: string): string[] {
  if (postImages[postId]) return postImages[postId];
  // localStorage에서 로컬 게시글 이미지 조회
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('campulist_post_images');
    const allImages: Record<string, string[]> = saved ? JSON.parse(saved) : {};
    return allImages[postId] || [];
  } catch { return []; }
}

export function getPostTags(postId: string): string[] {
  if (postTags[postId]) return postTags[postId];
  // localStorage에서 로컬 게시글 태그 조회
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('campulist_post_tags');
    const allTags: Record<string, string[]> = saved ? JSON.parse(saved) : {};
    return allTags[postId] || [];
  } catch { return []; }
}

export function toPostListItem(post: Post): PostListItem {
  const user = getUserSummary(post.authorId);
  const uni = universities.find(u => u.id === post.universityId);
  const cat = categories.find(c => c.id === post.categoryMinorId);
  const images = getPostImages(post.id);

  return {
    id: post.id,
    title: post.title,
    price: post.price,
    priceNegotiable: post.priceNegotiable,
    status: post.status,
    thumbnail: images[0] || null,
    bodySnippet: post.body.length > 50 ? post.body.slice(0, 50) + '…' : post.body,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    createdAt: post.createdAt,
    bumpedAt: post.bumpedAt,
    author: user,
    university: uni ? { id: uni.id, name: uni.name, slug: uni.slug } : { id: 0, name: '알 수 없음', slug: 'unknown' },
    categoryMinor: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : { id: 0, name: '기타', slug: 'etc' },
  };
}
