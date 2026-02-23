/**
 * 소분류별 글쓰기 예시 데이터
 *
 * 플레이스홀더:
 *   {{prefix}}      → [서울대][학부생]
 *   {{university}}   → 서울대
 *   {{department}}   → 경영학과 (없으면 "본인학과")
 *   {{memberType}}   → 학부생
 */

export interface CategoryExample {
  title: string;
  price: string;
  negotiable: boolean;
  body: string;
  tags: string[];
  location: string;
}

// ── 확장 타입 ──

export interface ToneVariant {
  title: string;
  body: string;
}

export type ToneType = 'clean' | 'friendly' | 'urgent' | 'humor';

export interface CategoryExampleSet {
  examples: CategoryExample[];
  tones?: Partial<Record<ToneType, ToneVariant>>;
  popularTags: string[];
  seasonalHints?: Record<string, { titleSuffix?: string; bodyHint?: string }>;
}

// ── 기존 단일 예시 (하위 호환) ──

export const categoryExamples: Record<number, CategoryExample> = {

  // ═══════════════════════════════════════
  // 📦 중고마켓 (majorId: 1)
  // ═══════════════════════════════════════

  // 전공서적·교양도서 (id: 11)
  11: {
    title: '{{prefix}} {{department}} 전공서적 팝니다',
    price: '15000',
    negotiable: true,
    body: `{{department}} 전공서적 판매합니다.

■ 과목: (과목명 입력)
■ 상태: 깨끗함 (밑줄/필기 없음)
■ 학기: 2025-2학기 사용

{{university}} 캠퍼스 내 직거래 희망합니다.`,
    tags: ['교재', '전공서적'],
    location: '{{university}} 중앙도서관 앞',
  },

  // 전자기기 (id: 12)
  12: {
    title: '{{prefix}} 아이패드 에어 5세대 팝니다',
    price: '450000',
    negotiable: true,
    body: `아이패드 에어 5세대 판매합니다.

■ 색상: 스페이스그레이
■ 용량: 64GB
■ 구매일: 2024년 3월
■ 상태: A급 (스크래치 없음)
■ 구성품: 본체, 충전기, 케이스

직거래 시 확인 가능합니다.`,
    tags: ['아이패드', '전자기기', '태블릿'],
    location: '{{university}} 정문 앞',
  },

  // 가구/생활용품 (id: 13)
  13: {
    title: '{{prefix}} 자취방 책상+의자 세트 팝니다',
    price: '50000',
    negotiable: true,
    body: `자취방 정리하면서 책상+의자 세트 판매합니다.

■ 브랜드: 이케아
■ 사용 기간: 약 1년
■ 상태: 양호 (사용감 있음)
■ 직접 수거 가능하신 분

{{university}} 근처 자취방에서 직접 가져가셔야 합니다.`,
    tags: ['가구', '책상', '자취'],
    location: '{{university}} 후문 자취촌',
  },

  // 의류/패션 (id: 14)
  14: {
    title: '{{prefix}} 나이키 에어포스1 팝니다 (270)',
    price: '60000',
    negotiable: true,
    body: `나이키 에어포스1 판매합니다.

■ 사이즈: 270mm
■ 색상: 화이트
■ 구매일: 2024년 5월
■ 착용 횟수: 약 10회
■ 상태: 양호 (밑창 깨끗)

{{university}} 캠퍼스 내 직거래 가능합니다.`,
    tags: ['나이키', '운동화', '신발'],
    location: '{{university}} 학생회관 앞',
  },

  // 티켓/쿠폰 (id: 15)
  15: {
    title: '{{prefix}} 스타벅스 기프티콘 1만원권 팝니다',
    price: '8500',
    negotiable: false,
    body: `스타벅스 기프티콘 1만원권 판매합니다.

■ 유효기간: 2026년 6월까지
■ 즉시 전송 가능 (카카오톡)

쪽지로 연락주시면 바로 보내드립니다.`,
    tags: ['기프티콘', '스타벅스', '쿠폰'],
    location: '',
  },

  // 무료나눔 (id: 16)
  16: {
    title: '{{prefix}} 전공서적 무료나눔합니다',
    price: '',
    negotiable: false,
    body: `더 이상 필요 없는 전공서적 나눔합니다.

■ 도서 목록:
  1. (도서명)
  2. (도서명)
■ 상태: 사용감 있으나 읽는 데 문제 없음

선착순이며, {{university}} 캠퍼스 내 수령 가능하신 분만 연락주세요.`,
    tags: ['무료나눔', '교재', '나눔'],
    location: '{{university}} 학생회관 앞',
  },

  // 기타 (id: 17)
  17: {
    title: '{{prefix}} (물품명) 팝니다',
    price: '10000',
    negotiable: true,
    body: `(물품명) 판매합니다.

■ 상품 설명: (설명 입력)
■ 상태: (상태 입력)
■ 구매 시기: (시기 입력)

{{university}} 캠퍼스 내 직거래 희망합니다.`,
    tags: ['중고', '판매'],
    location: '{{university}} 정문 앞',
  },

  // 구합니다 (id: 18)
  18: {
    title: '{{prefix}} {{department}} 교재 구합니다',
    price: '',
    negotiable: true,
    body: `{{department}} 전공 교재 구합니다.

■ 찾는 교재: (교재명 입력)
■ 에디션: (무관 / 최신판)
■ 상태: 필기 있어도 괜찮습니다

합리적인 가격에 구매하겠습니다. 쪽지 주세요!`,
    tags: ['구합니다', '교재'],
    location: '',
  },

  // ═══════════════════════════════════════
  // 🏠 주거 (majorId: 2)
  // ═══════════════════════════════════════

  // 원룸/자취방 (id: 21)
  21: {
    title: '{{prefix}} {{university}} 근처 원룸 양도',
    price: '350000',
    negotiable: true,
    body: `{{university}} 근처 원룸 양도합니다.

■ 위치: {{university}} 후문 도보 5분
■ 보증금: 500만원 / 월세: 35만원
■ 방 구조: 원룸 (화장실 포함)
■ 층수: 3층 (엘리베이터 없음)
■ 입주 가능일: (날짜 입력)
■ 옵션: 에어컨, 냉장고, 세탁기, 전자레인지

관심 있으시면 연락주세요. 방문 가능합니다.`,
    tags: ['원룸', '양도', '자취방'],
    location: '{{university}} 후문 도보 5분',
  },

  // 룸메이트 (id: 22)
  22: {
    title: '{{prefix}} {{university}} 근처 룸메이트 구합니다',
    price: '250000',
    negotiable: false,
    body: `{{university}} 근처에서 함께 지낼 룸메이트를 구합니다.

■ 위치: {{university}} 정문 도보 10분
■ 월세: 25만원 (보증금 별도)
■ 방 구조: 투룸 (각자 방 사용)
■ 입주 가능일: (날짜 입력)
■ 선호: 비흡연, 깔끔한 분

편하게 연락주세요!`,
    tags: ['룸메이트', '투룸'],
    location: '{{university}} 정문 근처',
  },

  // 하숙/고시원 (id: 23)
  23: {
    title: '{{prefix}} {{university}} 근처 하숙집 추천',
    price: '400000',
    negotiable: false,
    body: `{{university}} 근처 하숙집 정보 공유합니다.

■ 위치: {{university}} 정문 도보 7분
■ 월세: 40만원 (식사 포함)
■ 식사: 아침/저녁 제공
■ 시설: 개인 방, 공용 화장실
■ 분위기: 조용하고 깨끗

관심 있으시면 쪽지 주세요.`,
    tags: ['하숙', '고시원'],
    location: '{{university}} 정문 근처',
  },

  // 단기임대 (id: 24)
  24: {
    title: '{{prefix}} {{university}} 근처 방학 단기임대',
    price: '300000',
    negotiable: true,
    body: `방학 기간 단기임대 가능한 방입니다.

■ 위치: {{university}} 후문 도보 5분
■ 기간: 2개월 (방학 기간)
■ 월세: 30만원 (보증금 50만원)
■ 옵션: 풀옵션 (에어컨, 세탁기 등)

방학 동안 인턴/연구 하시는 분께 추천합니다.`,
    tags: ['단기임대', '방학', '자취방'],
    location: '{{university}} 후문',
  },

  // 양도 (id: 25)
  25: {
    title: '{{prefix}} {{university}} 근처 자취방 계약 양도',
    price: '0',
    negotiable: false,
    body: `자취방 계약 양도합니다. (권리금 없음)

■ 위치: {{university}} 정문 도보 8분
■ 남은 계약 기간: 6개월
■ 보증금: 300만원 / 월세: 30만원
■ 양도 가능일: (날짜 입력)

직접 방문 후 결정하시면 됩니다.`,
    tags: ['양도', '자취방', '계약'],
    location: '{{university}} 정문 근처',
  },

  // ═══════════════════════════════════════
  // 💼 일자리 (majorId: 3)
  // ═══════════════════════════════════════

  // 아르바이트 (id: 31)
  31: {
    title: '{{prefix}} {{university}} 근처 카페 알바 모집',
    price: '11000',
    negotiable: false,
    body: `{{university}} 근처 카페에서 아르바이트생을 모집합니다.

■ 근무지: {{university}} 정문 앞 OO카페
■ 시급: 11,000원
■ 근무 시간: 평일 오전 9시~오후 2시 (협의 가능)
■ 우대 조건: 바리스타 경험자, 장기 근무 가능자

관심 있으시면 쪽지 주세요!`,
    tags: ['아르바이트', '카페', '알바'],
    location: '{{university}} 정문 앞',
  },

  // 과외 (id: 32)
  32: {
    title: '{{prefix}} {{department}} {{memberType}} 과외합니다',
    price: '40000',
    negotiable: true,
    body: `{{university}} {{department}} {{memberType}} 과외합니다.

■ 과목: (과목명 입력)
■ 대상: 고등학생 / 대학생
■ 수업 방식: 대면 ({{university}} 근처) 또는 비대면
■ 시급: 4만원 (협의 가능)
■ 경력: (경력 입력)

편하게 문의주세요!`,
    tags: ['과외', '{{memberType}}'],
    location: '{{university}} 스터디룸',
  },

  // 레슨 (id: 53)
  53: {
    title: '{{prefix}} 피아노 레슨 해드립니다',
    price: '50000',
    negotiable: true,
    body: `피아노 레슨 해드립니다.

■ 대상: 초급~중급
■ 수업 방식: 대면 ({{university}} 근처)
■ 시간: 주 1회 1시간
■ 수강료: 월 20만원 (주 1회 기준)
■ 경력: (경력 입력)

편하게 문의주세요!`,
    tags: ['레슨', '피아노', '음악'],
    location: '{{university}} 근처',
  },

  // 인턴 (id: 33)
  33: {
    title: '{{prefix}} 스타트업 인턴 모집 ({{department}} 우대)',
    price: '',
    negotiable: false,
    body: `{{department}} 전공 관련 스타트업 인턴을 모집합니다.

■ 회사: (회사명)
■ 위치: (위치)
■ 기간: 3개월 (연장 가능)
■ 급여: 월 200만원
■ 근무: 주 3일 이상 (유연근무)
■ 우대: {{department}} 전공, 관련 경험자

지원 방법: 이력서를 쪽지로 보내주세요.`,
    tags: ['인턴', '스타트업'],
    location: '',
  },

  // 연구보조(RA/TA) (id: 34)
  34: {
    title: '{{prefix}} {{department}} 연구실 RA 모집',
    price: '',
    negotiable: false,
    body: `{{university}} {{department}} 연구실에서 RA를 모집합니다.

■ 연구 주제: (주제 입력)
■ 지도교수: (교수명)
■ 근무: 주 15시간 이상
■ 급여: 학교 기준 지급
■ 자격: {{department}} 전공 학부생/대학원생
■ 기간: 1학기 이상

관심 있는 분 이력서와 함께 쪽지 보내주세요.`,
    tags: ['RA', '연구보조', '연구실'],
    location: '{{university}} {{department}} 연구실',
  },

  // 프리랜서 (id: 35)
  35: {
    title: '{{prefix}} 웹개발 프리랜서 구합니다',
    price: '',
    negotiable: true,
    body: `웹개발 프리랜서를 구합니다.

■ 프로젝트: (프로젝트 설명)
■ 기술 스택: React, Node.js
■ 기간: 약 2주
■ 예산: 협의
■ 미팅: 비대면 (줌)

포트폴리오와 함께 쪽지 주세요.`,
    tags: ['프리랜서', '웹개발', '외주'],
    location: '',
  },

  // 구인 (id: 37)
  37: {
    title: '{{prefix}} {{university}} 학생 대상 구인',
    price: '',
    negotiable: false,
    body: `{{university}} 학생 대상으로 인력을 모집합니다.

■ 업무: (업무 내용)
■ 위치: {{university}} 근처
■ 시간: (근무 시간)
■ 급여: (급여 조건)
■ 자격: {{university}} 재학생

관심 있으신 분 쪽지 주세요.`,
    tags: ['구인', '모집'],
    location: '{{university}} 근처',
  },

  // 구직 (id: 36)
  36: {
    title: '{{prefix}} {{department}} {{memberType}} 구직합니다',
    price: '',
    negotiable: false,
    body: `{{university}} {{department}} {{memberType}} 구직합니다.

■ 가능 업무: (업무 유형)
■ 가능 시간: 주 OO시간
■ 경력/스킬: (경력 입력)
■ 희망 급여: 협의

편하게 연락주세요!`,
    tags: ['구직', '{{memberType}}'],
    location: '{{university}} 근처',
  },

  // ═══════════════════════════════════════
  // 👥 커뮤니티 (majorId: 4)
  // ═══════════════════════════════════════

  // 스터디/팀원 (id: 41)
  41: {
    title: '{{prefix}} {{department}} 스터디 팀원 모집',
    price: '',
    negotiable: false,
    body: `{{department}} 관련 스터디 팀원을 모집합니다.

■ 스터디 주제: (주제 입력)
■ 모집 인원: 4~5명
■ 모임 장소: {{university}} 중앙도서관 스터디룸
■ 모임 시간: 주 1회 (요일/시간 협의)
■ 기간: 한 학기

관심 있는 분 편하게 쪽지 주세요!`,
    tags: ['스터디', '팀원모집'],
    location: '{{university}} 중앙도서관',
  },

  // 동아리/모임 (id: 42)
  42: {
    title: '{{prefix}} {{university}} OO 동아리 신입부원 모집',
    price: '',
    negotiable: false,
    body: `{{university}} OO 동아리에서 신입부원을 모집합니다.

■ 동아리명: (동아리명)
■ 활동: (활동 내용)
■ 모집 인원: OO명
■ 모임: 주 1회 (요일 협의)
■ 회비: (회비 정보)

관심 있는 분 편하게 지원해주세요!`,
    tags: ['동아리', '모집', '신입부원'],
    location: '{{university}} 학생회관',
  },

  // 카풀/동행 (id: 43)
  43: {
    title: '{{prefix}} {{university}} → 강남 카풀 모집',
    price: '5000',
    negotiable: false,
    body: `{{university}}에서 강남 방면 카풀 모집합니다.

■ 출발: {{university}} 정문
■ 도착: 강남역
■ 출발 시간: (시간 입력)
■ 모집 인원: 2명
■ 비용: 1인 5,000원

편하게 연락주세요!`,
    tags: ['카풀', '동행'],
    location: '{{university}} 정문',
  },

  // 분실물 (id: 44)
  44: {
    title: '{{prefix}} {{university}} 에서 지갑 분실했습니다',
    price: '',
    negotiable: false,
    body: `{{university}}에서 지갑을 분실했습니다.

■ 분실 장소: (장소 입력)
■ 분실 시간: (시간 입력)
■ 특징: (지갑 색상, 브랜드 등)
■ 내용물: 학생증, 카드 등

발견하신 분 연락주시면 사례하겠습니다.`,
    tags: ['분실물', '지갑'],
    location: '{{university}}',
  },

  // 학술/세미나 (id: 45)
  45: {
    title: '{{prefix}} {{department}} 특별 세미나 안내',
    price: '',
    negotiable: false,
    body: `{{department}} 관련 특별 세미나를 안내합니다.

■ 주제: (세미나 주제)
■ 연사: (연사 이름 및 소속)
■ 일시: (날짜 및 시간)
■ 장소: {{university}} (건물명 및 호실)
■ 대상: {{university}} 재학생 및 관심 있는 분

참석 희망하시는 분은 쪽지 주세요.`,
    tags: ['세미나', '학술', '강연'],
    location: '{{university}}',
  },

  // 자유게시판 (id: 46)
  46: {
    title: '{{prefix}} (제목을 입력하세요)',
    price: '',
    negotiable: false,
    body: `(자유롭게 내용을 작성해주세요)

{{university}} 커뮤니티에서 다양한 이야기를 나눠보세요.`,
    tags: ['자유게시판'],
    location: '',
  },

  // 봉사활동 (id: 47)
  47: {
    title: '{{prefix}} {{university}} 봉사활동 참여자 모집',
    price: '',
    negotiable: false,
    body: `{{university}} 봉사활동 참여자를 모집합니다.

■ 활동명: (활동명 입력)
■ 일시: (날짜 및 시간)
■ 장소: (장소 입력)
■ 모집 인원: OO명
■ 봉사시간 인정: O시간

많은 참여 부탁드립니다!`,
    tags: ['봉사활동', '봉사', '참여'],
    location: '',
  },

  // ═══════════════════════════════════════
  // 🛠️ 서비스 (majorId: 5)
  // ═══════════════════════════════════════

  // 이사/운송 (id: 51)
  51: {
    title: '{{prefix}} 자취방 이사 도움 구합니다',
    price: '50000',
    negotiable: true,
    body: `자취방 이사를 도와줄 분을 구합니다.

■ 이사일: (날짜 입력)
■ 출발: {{university}} 후문 자취촌
■ 도착: (도착지 입력)
■ 짐 양: 원룸 기본 짐 (큰 가구 없음)
■ 차량: 있으면 좋지만 없어도 OK
■ 사례비: 5만원 (협의 가능)

연락주세요!`,
    tags: ['이사', '운송', '도움'],
    location: '{{university}} 후문',
  },

  // 수리/설치 (id: 52)
  52: {
    title: '{{prefix}} 자취방 에어컨 설치 도움 구합니다',
    price: '30000',
    negotiable: true,
    body: `자취방 에어컨 설치를 도와줄 분을 구합니다.

■ 위치: {{university}} 근처 자취방
■ 작업 내용: 창문형 에어컨 설치
■ 희망 일자: (날짜 입력)
■ 사례비: 3만원 (협의 가능)

경험 있으신 분 연락주세요!`,
    tags: ['수리', '설치', '에어컨'],
    location: '{{university}} 근처',
  },

  // 대행 (id: 54)
  54: {
    title: '{{prefix}} 줄서기 대행 구합니다',
    price: '20000',
    negotiable: true,
    body: `줄서기 대행을 구합니다.

■ 장소: (장소 입력)
■ 날짜: (날짜 입력)
■ 시간: (시간 입력)
■ 예상 대기 시간: 약 OO분
■ 사례비: 2만원

관심 있으신 분 쪽지 주세요.`,
    tags: ['대행', '줄서기'],
    location: '',
  },

  // 기타 서비스 (id: 55)
  55: {
    title: '{{prefix}} (서비스명) 해드립니다',
    price: '',
    negotiable: true,
    body: `(서비스 설명을 입력해주세요)

■ 서비스 내용: (내용 입력)
■ 가격: (가격 입력)
■ 위치: {{university}} 근처

관심 있으시면 쪽지 주세요.`,
    tags: ['서비스'],
    location: '{{university}} 근처',
  },

  // IT/컴퓨터 (id: 56)
  56: {
    title: '{{prefix}} 노트북 포맷/윈도우 설치 해드립니다',
    price: '20000',
    negotiable: false,
    body: `노트북 포맷 및 윈도우 설치 해드립니다.

■ 서비스: 포맷 + 윈도우 설치 + 기본 프로그램 설치
■ 가격: 2만원
■ 소요 시간: 약 1~2시간
■ 장소: {{university}} 캠퍼스 내 카페

예약 후 방문해주시면 됩니다.`,
    tags: ['IT', '컴퓨터', '포맷'],
    location: '{{university}} 카페',
  },

  // 뷰티/미용 (id: 57)
  57: {
    title: '{{prefix}} 헤어 커트 해드립니다 (미용학과)',
    price: '5000',
    negotiable: false,
    body: `미용 관련 전공/경험이 있어 헤어 커트 해드립니다.

■ 가격: 5,000원 (재료비만)
■ 장소: {{university}} 근처 (개인 작업실)
■ 가능 시간: 주말 오후
■ 참고: 포트폴리오 사진 있습니다

쪽지로 문의해주세요!`,
    tags: ['미용', '헤어컷', '뷰티'],
    location: '{{university}} 근처',
  },

  // 건강/운동 (id: 58)
  58: {
    title: '{{prefix}} PT/운동 파트너 구합니다',
    price: '30000',
    negotiable: true,
    body: `운동 파트너 또는 PT를 구합니다.

■ 운동 종류: (종류 입력)
■ 장소: {{university}} 체육관 / 근처 헬스장
■ 시간: 주 3회 (시간 협의)
■ 가격: (PT 시 가격 / 파트너 시 무료)

관심 있으시면 연락주세요!`,
    tags: ['운동', 'PT', '파트너'],
    location: '{{university}} 체육관',
  },

  // 반려동물 (id: 59)
  59: {
    title: '{{prefix}} 강아지 산책 도우미 구합니다',
    price: '15000',
    negotiable: true,
    body: `강아지 산책 도우미를 구합니다.

■ 반려동물: 소형견 (말티즈)
■ 산책 시간: 평일 오후 (30분~1시간)
■ 장소: {{university}} 근처
■ 사례비: 1회 15,000원

동물을 좋아하시는 분 연락주세요!`,
    tags: ['반려동물', '산책', '도우미'],
    location: '{{university}} 근처',
  },

  // ═══════════════════════════════════════
  // 🏪 캠퍼스라이프 (majorId: 6)
  // ═══════════════════════════════════════

  // 맛집/카페 (id: 61)
  61: {
    title: '{{prefix}} {{university}} 근처 숨은 맛집 추천',
    price: '',
    negotiable: false,
    body: `{{university}} 근처 숨은 맛집을 추천합니다!

■ 가게명: (가게명 입력)
■ 위치: {{university}} 후문 도보 3분
■ 추천 메뉴: (메뉴명)
■ 가격대: 1인 8,000~12,000원
■ 분위기: (분위기 설명)

개인적으로 자주 가는 곳이에요. 추천!`,
    tags: ['맛집', '카페', '추천'],
    location: '{{university}} 후문 근처',
  },

  // 할인/이벤트 (id: 62)
  62: {
    title: '{{prefix}} {{university}} 학생 할인 정보 공유',
    price: '',
    negotiable: false,
    body: `{{university}} 학생 할인 정보 공유합니다.

■ 가게/서비스: (이름 입력)
■ 할인 내용: 학생증 제시 시 OO% 할인
■ 기간: (기간 입력)
■ 위치: {{university}} 근처

학생증 꼭 챙겨가세요!`,
    tags: ['할인', '이벤트', '학생할인'],
    location: '{{university}} 근처',
  },

  // 신규오픈 (id: 63)
  63: {
    title: '{{prefix}} {{university}} 앞 새로운 가게 오픈!',
    price: '',
    negotiable: false,
    body: `{{university}} 근처에 새로운 가게가 오픈했습니다!

■ 가게명: (가게명 입력)
■ 업종: (업종 입력)
■ 위치: {{university}} 정문 근처
■ 오픈 이벤트: (이벤트 정보)

가보신 분 후기도 남겨주세요!`,
    tags: ['신규오픈', '맛집', '가게'],
    location: '{{university}} 정문 근처',
  },

  // 상인 구인 (id: 64)
  64: {
    title: '{{prefix}} {{university}} 앞 매장 아르바이트 모집',
    price: '11000',
    negotiable: false,
    body: `{{university}} 앞 매장에서 아르바이트생을 모집합니다.

■ 매장: (매장명)
■ 위치: {{university}} 정문 앞
■ 시급: 11,000원
■ 근무 시간: (시간 입력)
■ 우대: {{university}} 재학생

관심 있으시면 매장으로 방문하시거나 쪽지 주세요.`,
    tags: ['구인', '아르바이트', '매장'],
    location: '{{university}} 정문 앞',
  },

  // ═══════════════════════════════════════
  // 📣 긱·의뢰 (majorId: 7)
  // ═══════════════════════════════════════

  // 심부름/대행 (id: 71)
  71: {
    title: '{{prefix}} 서류 제출 대행 구합니다',
    price: '10000',
    negotiable: true,
    body: `서류 제출 대행을 구합니다.

■ 장소: {{university}} 행정실
■ 서류: (서류명)
■ 희망 일자: (날짜 입력)
■ 사례비: 1만원

{{university}} 재학생이시면 편하게 연락주세요.`,
    tags: ['심부름', '대행', '서류'],
    location: '{{university}} 행정실',
  },

  // 번역/통역 (id: 72)
  72: {
    title: '{{prefix}} 논문 영문교정 의뢰 (5000단어)',
    price: '100000',
    negotiable: true,
    body: `학술 논문 영문교정을 의뢰합니다.

■ 분야: {{department}}
■ 분량: 약 5,000단어
■ 마감일: (날짜 입력)
■ 요청사항: 문법 교정 + 학술적 표현 개선
■ 예산: 10만원 (협의 가능)

관련 경험 있는 분 쪽지 주세요.`,
    tags: ['영문교정', '논문', '번역'],
    location: '',
  },

  // 디자인/창작 (id: 73)
  73: {
    title: '{{prefix}} 팀프로젝트 PPT 디자인 의뢰',
    price: '30000',
    negotiable: true,
    body: `팀프로젝트 발표 PPT 디자인을 의뢰합니다.

■ 슬라이드 수: 약 15~20장
■ 주제: {{department}} 관련 발표
■ 마감일: (날짜 입력)
■ 요청사항: 깔끔하고 전문적인 디자인
■ 참고 자료: 내용 초안 제공 예정

포트폴리오와 함께 쪽지 주세요!`,
    tags: ['PPT', '디자인', '발표'],
    location: '',
  },

  // 촬영/편집 (id: 74)
  74: {
    title: '{{prefix}} 증명사진 촬영 의뢰',
    price: '10000',
    negotiable: false,
    body: `증명사진 촬영을 의뢰합니다.

■ 용도: 이력서/졸업앨범
■ 수량: 데이터 파일 + 인화 4매
■ 희망 일자: (날짜 입력)
■ 장소: {{university}} 캠퍼스 내

사진 관련 전공/경험 있는 분 연락주세요.`,
    tags: ['촬영', '증명사진', '사진'],
    location: '{{university}} 캠퍼스',
  },

  // 설문/참여 (id: 75)
  75: {
    title: '{{prefix}} 설문조사 참여자 모집 (소정의 사례)',
    price: '5000',
    negotiable: false,
    body: `{{department}} 졸업논문/과제 관련 설문조사 참여자를 모집합니다.

■ 주제: (연구 주제)
■ 소요 시간: 약 10분
■ 사례: 커피 기프티콘 (5,000원)
■ 대상: {{university}} 재학생
■ 참여 방법: 아래 링크 클릭
  → (설문 링크)

많은 참여 부탁드립니다!`,
    tags: ['설문조사', '사례', '참여'],
    location: '',
  },

  // 기타 의뢰 (id: 76)
  76: {
    title: '{{prefix}} (의뢰 내용) 해주실 분 구합니다',
    price: '',
    negotiable: true,
    body: `(의뢰 내용을 입력해주세요)

■ 의뢰 내용: (상세 설명)
■ 마감일: (날짜 입력)
■ 예산: (예산 입력 또는 협의)

관심 있는 분 쪽지 주세요.`,
    tags: ['의뢰'],
    location: '',
  },
};

// ══════════════════════════════════════════════════════════════
// 확장 예시 세트 (다중 예시 + 톤 + 인기태그 + 시즌)
// categoryExampleSets[minorId] 로 접근
// ══════════════════════════════════════════════════════════════

export const categoryExampleSets: Record<number, CategoryExampleSet> = {

  // ═══ 📦 중고마켓 (majorId: 1) ═══

  11: {
    examples: [
      categoryExamples[11],
      { title: '{{prefix}} 경제학원론 7판 반값 판매', price: '12000', negotiable: true,
        body: '경제학원론 (맨큐) 7판 판매합니다.\n\n■ 과목: 경제학원론\n■ 저자: N. Gregory Mankiw\n■ 상태: 형광펜 밑줄 약간, 읽는 데 지장 없음\n■ 원가: 35,000원\n\n{{university}} 캠퍼스 내 직거래 가능합니다.',
        tags: ['경제학', '교재', '맨큐'], location: '{{university}} 사회대 앞' },
      { title: '{{prefix}} 컴공 전공서적 2권 세트 팝니다', price: '20000', negotiable: true,
        body: '컴공 전공서적 2권 세트 판매합니다.\n\n■ 도서1: 컴퓨터구조론 (5판)\n■ 도서2: 운영체제 (10판)\n■ 상태: 모두 깨끗, 필기 없음\n\n세트로만 판매합니다. {{university}} 직거래.',
        tags: ['컴공', '교재', '세트'], location: '{{university}} 공대 로비' },
    ],
    tones: {
      friendly: { title: '{{department}} 전공책 팝니당~ 상태 좋아요! 📚', body: '전공서적 판매해요~!\n\n📖 과목: (과목명)\n✨ 상태: 거의 새 거예요!\n📅 사용: 한 학기만 살짝\n\n캠퍼스에서 편하게 거래해요~ 😊' },
      urgent: { title: '[급매] {{department}} 전공서적 오늘만 이 가격!', body: '🔥 급하게 처분합니다!\n\n■ 과목: (과목명)\n■ 상태: 깨끗함\n■ 원가 대비 70% 할인\n\n⏰ 오늘 거래 가능하신 분 우선!' },
      humor: { title: '이 교재와 나의 인연은 여기까지... {{department}} 전공책', body: '한 학기 동안 동고동락한 전공서적,\n새 주인을 찾습니다... (눈물)\n\n📖 과목: (과목명)\n💔 이별 사유: 학기 종료\n✨ 상태: 제가 아꼈습니다 (정말로)\n\n좋은 분에게 보내고 싶어요 🥹' },
    },
    popularTags: ['교재', '전공서적', '반값', '깨끗', '직거래', '새책급', '밑줄없음', '세트'],
    seasonalHints: { '2-3': { titleSuffix: '(새학기 교재)', bodyHint: '새학기 시작 전 미리 구매하세요!' }, '6-7': { titleSuffix: '(학기말 정리)', bodyHint: '학기 끝나고 정리합니다.' } },
  },

  12: {
    examples: [
      categoryExamples[12],
      { title: '{{prefix}} 맥북 에어 M2 팝니다', price: '850000', negotiable: true,
        body: '맥북 에어 M2 판매합니다.\n\n■ 색상: 미드나이트\n■ 사양: M2 / 8GB / 256GB\n■ 구매일: 2024년 9월\n■ 상태: S급 (스크래치 전혀 없음)\n■ 구성품: 본체, 충전기, 박스\n\n직거래 시 확인 가능합니다.',
        tags: ['맥북', '노트북', 'M2'], location: '{{university}} 카페' },
      { title: '{{prefix}} 에어팟 프로 2세대 팝니다', price: '180000', negotiable: false,
        body: '에어팟 프로 2세대 (USB-C) 판매합니다.\n\n■ 구매일: 2025년 1월\n■ 상태: A급\n■ 배터리: 양호\n■ 구성품: 전부 포함\n\n캠퍼스 내 직거래 가능합니다.',
        tags: ['에어팟', '애플', '이어폰'], location: '{{university}} 학생회관' },
    ],
    tones: {
      friendly: { title: '아이패드 에어 팝니다~ 거의 새 거!! ✨', body: '아이패드 에어 판매해요~\n\n📱 색상: 스페이스그레이\n💾 용량: 64GB\n✨ 상태: 진짜 깨끗해요!!\n\n편하게 연락주세요~ 😄' },
      urgent: { title: '[급매] 아이패드 에어 5세대 네고가능!!', body: '🔥 급처합니다! 가격 협의 가능!\n\n■ 스페이스그레이 / 64GB\n■ 상태: A급\n■ 오늘 내일 중 거래 원합니다\n\n⚡ 먼저 연락주시는 분께 드립니다!' },
      humor: { title: '아이패드야... 잘 지내... (에어 5세대 판매)', body: '넌 나한테 과분했어...\n정가 70만원짜리 친구를 보내드립니다.\n\n📱 모델: 에어 5세대\n😭 이별 사유: 프로가 생겼습니다\n✨ 상태: 1년간 잘 모셨습니다\n\n새 주인에게 잘 부탁해 🥲' },
    },
    popularTags: ['아이패드', '맥북', '노트북', '태블릿', '애플', '삼성', '중고', '전자기기'],
  },

  13: {
    examples: [
      categoryExamples[13],
      { title: '{{prefix}} 이케아 책장 팝니다 (칼락스)', price: '30000', negotiable: true,
        body: '이케아 칼락스 책장 판매합니다.\n\n■ 크기: 4칸 (77x147cm)\n■ 색상: 화이트\n■ 상태: 양호\n■ 직접 수거 필수\n\n{{university}} 근처 자취방입니다.',
        tags: ['이케아', '책장', '가구'], location: '{{university}} 후문 자취촌' },
      { title: '{{prefix}} 자취 살림 일괄 판매 (냄비세트+식기)', price: '25000', negotiable: true,
        body: '자취방 정리하면서 주방용품 일괄 판매합니다.\n\n■ 냄비 세트 (3종)\n■ 프라이팬 (28cm)\n■ 식기 세트 (4인용)\n■ 상태: 사용감 있지만 깨끗\n\n개별 판매 불가, {{university}} 근처 직접 수거.',
        tags: ['자취', '주방용품', '살림'], location: '{{university}} 후문' },
    ],
    tones: {
      friendly: { title: '자취방 책상+의자 세트 가져가세요~ 🏠', body: '자취방 정리 중이에요~!\n\n🪑 책상+의자 세트\n📅 1년 사용\n✨ 깨끗하게 썼어요!\n\n직접 오셔서 가져가시면 됩니다 😊' },
      urgent: { title: '[급처] 자취방 가구 이번 주까지!', body: '🔥 이사 때문에 급처합니다!\n\n■ 이케아 책상+의자\n■ 이번 주 내 가져가실 분\n■ 가격 많이 내렸습니다!\n\n⏰ 빠른 연락 부탁드립니다!' },
      humor: { title: '이 가구들의 새로운 집을 찾습니다 (자취방 정리)', body: '주인이 이사를 간다고 합니다...\n이 착한 가구들을 거둬주실 분 없나요?\n\n🪑 책상: 조용하고 순한 아이입니다\n💺 의자: 등받이가 편안합니다\n📅 함께한 시간: 약 1년\n\n입양(구매) 문의 환영합니다 🏠' },
    },
    popularTags: ['가구', '자취', '이케아', '책상', '의자', '침대', '살림', '정리'],
    seasonalHints: { '6-7': { titleSuffix: '(방학 정리)', bodyHint: '방학 전 정리 중입니다.' }, '2-3': { titleSuffix: '(새학기 자취 준비)', bodyHint: '새학기 자취 시작하시는 분께 추천!' } },
  },

  14: {
    examples: [
      categoryExamples[14],
      { title: '{{prefix}} 유니클로 히트텍 새상품 팝니다', price: '15000', negotiable: false,
        body: '유니클로 히트텍 판매합니다.\n\n■ 사이즈: M\n■ 색상: 블랙\n■ 상태: 미개봉 새상품\n■ 수량: 2벌\n\n{{university}} 캠퍼스 내 직거래.',
        tags: ['유니클로', '히트텍', '의류'], location: '{{university}} 정문 앞' },
      { title: '{{prefix}} 노스페이스 패딩 팝니다 (L)', price: '120000', negotiable: true,
        body: '노스페이스 눕시 패딩 판매합니다.\n\n■ 사이즈: L\n■ 색상: 블랙\n■ 구매일: 2024년 11월\n■ 착용 횟수: 약 5회\n■ 상태: S급\n\n직거래 시 확인 가능합니다.',
        tags: ['패딩', '노스페이스', '겨울옷'], location: '{{university}} 학생회관' },
    ],
    tones: {
      friendly: { title: '나이키 에어포스1 팝니다~ 상태 좋아요! 👟', body: '에어포스1 팔아요~!\n\n👟 사이즈: 270mm\n🎨 색상: 화이트\n✨ 상태: 깨끗해요!\n\n편하게 연락주세요~ 😊' },
      urgent: { title: '[급매] 나이키 에어포스1 오늘까지 특가!', body: '🔥 정리합니다!\n\n■ 270mm / 화이트\n■ 상태: A급\n■ 원가 대비 50% 할인!\n\n⏰ 빠른 거래 원합니다!' },
      humor: { title: '발이 커져서 이별합니다... 에어포스1 (270)', body: '슬프지만 제 발이 더 이상 270이 아닙니다...\n\n👟 나이키 에어포스1\n📏 270mm (변하지 않는 신발 사이즈)\n😢 상태: 주인보다 깨끗함\n\n새 발 주인을 기다립니다 👣' },
    },
    popularTags: ['나이키', '운동화', '의류', '패딩', '새상품', '브랜드', '정품', '사이즈'],
  },

  15: {
    examples: [
      categoryExamples[15],
      { title: '{{prefix}} CGV 영화 예매권 2장 팝니다', price: '16000', negotiable: false,
        body: 'CGV 영화 예매권 2장 판매합니다.\n\n■ 유효기간: 2026년 12월까지\n■ 일반/IMAX/4DX 모두 사용 가능\n■ 즉시 전송 가능\n\n쪽지로 연락주세요.',
        tags: ['영화', 'CGV', '예매권'], location: '' },
      { title: '{{prefix}} 배스킨라빈스 기프티콘 팝니다', price: '4000', negotiable: false,
        body: '배스킨라빈스 싱글킹 기프티콘 판매합니다.\n\n■ 유효기간: 2026년 8월까지\n■ 카카오톡 즉시 전송\n\n정가 5,200원 → 4,000원에 판매합니다.',
        tags: ['기프티콘', '배스킨라빈스', '아이스크림'], location: '' },
    ],
    tones: {
      friendly: { title: '스타벅스 기프티콘 싸게 팝니다~ ☕', body: '스타벅스 기프티콘 저렴하게 팔아요~!\n\n☕ 금액: 1만원권\n📅 유효기간: 넉넉해요!\n📱 카톡으로 바로 보내드려요~\n\n편하게 쪽지 주세요 😊' },
      urgent: { title: '[급매] 스타벅스 기프티콘 1만원권 초특가!', body: '🔥 급하게 판매합니다!\n\n■ 1만원권 → 8,000원\n■ 유효기간 충분\n■ 즉시 전송 가능\n\n먼저 연락주시는 분께!' },
      humor: { title: '카페인 중독에서 벗어났습니다 (스벅 기프티콘 판매)', body: '드디어... 커피를 끊었습니다.\n남은 기프티콘의 행선지를 찾습니다.\n\n☕ 스타벅스 1만원권\n💪 탈카페인 결심: 확고함\n📅 유효기간: 아직 한참 남음\n\n카페인이 필요한 분에게 양도합니다 🫡' },
    },
    popularTags: ['기프티콘', '스타벅스', '쿠폰', '영화', '할인', '상품권', '선물', 'CGV'],
  },

  16: {
    examples: [
      categoryExamples[16],
      { title: '{{prefix}} 자취 살림용품 무료나눔', price: '', negotiable: false,
        body: '자취방 정리하면서 살림용품 나눔합니다.\n\n■ 수건 세트\n■ 행거\n■ 조명 스탠드\n■ 상태: 사용감 있으나 깨끗\n\n선착순, {{university}} 근처 직접 수거.',
        tags: ['무료나눔', '살림', '자취'], location: '{{university}} 후문' },
      { title: '{{prefix}} 프린터 무료나눔 (잉크 포함)', price: '', negotiable: false,
        body: '잉크젯 프린터 나눔합니다.\n\n■ 모델: HP DeskJet\n■ 잉크: 새 카트리지 1세트 포함\n■ 상태: 정상 작동\n\n{{university}} 캠퍼스 내 수령 가능하신 분.',
        tags: ['무료나눔', '프린터', 'HP'], location: '{{university}} 학생회관' },
    ],
    tones: {
      friendly: { title: '전공서적 무료로 드려요~ 가져가세요! 📚', body: '필요 없어진 전공서적 나눔해요~!\n\n📚 도서 목록:\n  1. (도서명)\n  2. (도서명)\n✨ 상태: 읽는 데 문제 없어요!\n\n선착순이에요~ 빠른 연락 주세요 😊' },
      humor: { title: '이 책들이 책장에서 탈출하고 싶어합니다 (무료나눔)', body: '더 이상 읽히지 않는 책들의 탈출 프로젝트.\n\n📚 탈출 희망자:\n  1. (도서명) - "나 좀 데려가줘..."\n  2. (도서명) - "여기 먼지만 쌓여..."\n\n🆓 무료입니다. 구출해주세요.\n선착순 입양(수거) 가능합니다 🏃' },
    },
    popularTags: ['무료나눔', '나눔', '무료', '자취', '교재', '가전', '살림', '선착순'],
  },

  17: {
    examples: [
      categoryExamples[17],
      { title: '{{prefix}} 닌텐도 스위치 게임 팝니다', price: '35000', negotiable: true,
        body: '닌텐도 스위치 게임 칩 판매합니다.\n\n■ 게임: 젤다의 전설 왕국의 눈물\n■ 상태: 정품, 깨끗\n\n{{university}} 직거래 가능합니다.',
        tags: ['닌텐도', '스위치', '게임'], location: '{{university}} 정문 앞' },
      { title: '{{prefix}} 캠핑 의자 팝니다 (헬리녹스)', price: '80000', negotiable: true,
        body: '헬리녹스 체어원 판매합니다.\n\n■ 색상: 블랙\n■ 사용 횟수: 3회\n■ 상태: 거의 새것\n■ 구성: 본체 + 수납백\n\n{{university}} 캠퍼스 직거래.',
        tags: ['캠핑', '의자', '헬리녹스'], location: '{{university}} 학생회관' },
    ],
    tones: {
      friendly: { title: '(물품명) 팝니다~ 상태 좋아요! 😊', body: '(물품명) 팔아요~!\n\n✨ 상태: 좋아요!\n📅 구매: (시기)\n💰 가격: 네고 가능해요\n\n편하게 연락주세요~ 😄' },
      urgent: { title: '[급매] (물품명) 특가 판매!!', body: '🔥 급하게 처분합니다!\n\n■ 상품: (물품명)\n■ 상태: (상태)\n■ 가격 대폭 할인!\n\n⏰ 빠른 거래 원합니다!' },
    },
    popularTags: ['중고', '판매', '깨끗', '직거래', '네고', '정품', '새상품급', '택배가능'],
  },

  18: {
    examples: [
      categoryExamples[18],
      { title: '{{prefix}} 아이패드 or 태블릿 구합니다', price: '', negotiable: true,
        body: '필기용 태블릿 구합니다.\n\n■ 찾는 기기: 아이패드 에어 4세대 이상 또는 갤럭시탭 S8 이상\n■ 상태: B급 이상\n■ 예산: 30~50만원\n\n합리적인 가격에 구매하겠습니다.',
        tags: ['구합니다', '아이패드', '태블릿'], location: '' },
      { title: '{{prefix}} 자전거 구합니다 (통학용)', price: '', negotiable: true,
        body: '통학용 자전거 구합니다.\n\n■ 종류: 하이브리드 또는 미니벨로\n■ 상태: 정상 주행 가능하면 OK\n■ 예산: 10~15만원\n\n{{university}} 근처에서 직거래 원합니다.',
        tags: ['구합니다', '자전거', '통학'], location: '{{university}} 정문 앞' },
    ],
    tones: {
      friendly: { title: '{{department}} 교재 구해요~ 📖', body: '{{department}} 전공 교재 구해요~!\n\n📖 찾는 교재: (교재명)\n✅ 에디션: 상관없어요\n📝 필기 있어도 괜찮아요!\n\n합리적인 가격에 구매할게요~ 😊' },
      urgent: { title: '[급구] {{department}} 교재 급하게 구합니다!', body: '🔥 수업 시작인데 교재가 없습니다!\n\n■ 과목: (과목명)\n■ 교재: (교재명)\n■ 상태 무관\n\n⏰ 빠르게 구하고 싶습니다. 연락주세요!' },
    },
    popularTags: ['구합니다', '삽니다', '교재', '전자기기', '가전', '가구', '급구', '매입'],
  },

  // ═══ 🏠 주거 (majorId: 2) ═══

  21: {
    examples: [
      categoryExamples[21],
      { title: '{{prefix}} {{university}} 후문 투룸 양도 (풀옵션)', price: '400000', negotiable: true,
        body: '{{university}} 후문 투룸 양도합니다.\n\n■ 위치: {{university}} 후문 도보 3분\n■ 보증금: 1,000만원 / 월세: 40만원\n■ 구조: 투룸 (방2 + 화장실)\n■ 층수: 4층 (엘리베이터 있음)\n■ 옵션: 에어컨, 냉장고, 세탁기, 인덕션\n■ 입주: (날짜)\n\n방문 가능합니다.',
        tags: ['투룸', '양도', '풀옵션'], location: '{{university}} 후문 도보 3분' },
      { title: '{{prefix}} 신축 원룸 양도 ({{university}} 도보 5분)', price: '380000', negotiable: false,
        body: '2025년 신축 원룸 양도합니다.\n\n■ 위치: {{university}} 정문 도보 5분\n■ 보증금: 500만원 / 월세: 38만원\n■ 구조: 원룸 (분리형)\n■ 특징: 신축, 깨끗, 주차 가능\n\n사진 필요하시면 쪽지 주세요.',
        tags: ['신축', '원룸', '양도'], location: '{{university}} 정문 도보 5분' },
    ],
    tones: {
      friendly: { title: '{{university}} 근처 원룸 양도해요~ 깨끗해요! 🏠', body: '{{university}} 근처 원룸 양도합니다~\n\n🏠 후문 도보 5분\n💰 보증금 500 / 월세 35\n✨ 깨끗하고 조용해요!\n🛏️ 풀옵션 다 있어요\n\n편하게 연락주세요~ 😊' },
      urgent: { title: '[급양도] {{university}} 원룸 보증금 협의 가능!', body: '🔥 이사 일정 때문에 급양도합니다!\n\n■ {{university}} 후문 도보 5분\n■ 보증금/월세 협의 가능\n■ 즉시 입주 가능\n\n⏰ 빨리 연락주시면 조건 맞춰드립니다!' },
    },
    popularTags: ['원룸', '양도', '자취방', '풀옵션', '직거래', '월세', '보증금', '신축'],
    seasonalHints: { '6-7': { titleSuffix: '(방학 양도)', bodyHint: '방학 기간 양도합니다.' }, '2-3': { titleSuffix: '(새학기 입주 가능)', bodyHint: '새학기 시작 전 입주 가능합니다.' } },
  },

  22: {
    examples: [
      categoryExamples[22],
      { title: '{{prefix}} {{university}} 근처 여성 룸메이트 구합니다', price: '200000', negotiable: false,
        body: '{{university}} 근처 투룸에서 함께 지낼 여성 룸메이트를 구합니다.\n\n■ 위치: {{university}} 후문 도보 7분\n■ 월세: 20만원 (보증금 100만원)\n■ 방: 각자 개인 방 사용\n■ 입주: (날짜)\n■ 선호: 비흡연, 조용한 분\n\n관심 있으시면 쪽지 주세요!',
        tags: ['룸메이트', '여성', '투룸'], location: '{{university}} 후문 근처' },
      { title: '{{prefix}} {{university}} 셰어하우스 입주자 모집', price: '300000', negotiable: false,
        body: '{{university}} 근처 셰어하우스 입주자를 모집합니다.\n\n■ 위치: {{university}} 정문 도보 8분\n■ 월세: 30만원 (공과금 별도)\n■ 구조: 3인 셰어 (개인 방 O)\n■ 공용: 거실, 주방, 화장실 2개\n\n깔끔하게 생활하실 분 환영합니다.',
        tags: ['셰어하우스', '입주', '공유주거'], location: '{{university}} 정문 근처' },
    ],
    tones: {
      friendly: { title: '같이 살아요~ {{university}} 근처 룸메이트 구합니다 🏡', body: '{{university}} 근처에서 함께 지낼 룸메이트를 찾아요~\n\n🏡 투룸에서 각자 방 사용\n💰 월세 25만원\n🚶 정문 도보 10분\n😊 편한 분이면 좋겠어요!\n\n부담 없이 연락주세요~' },
      humor: { title: '룸메이트 캐스팅 중... ({{university}} 근처)', body: '함께 살 인재를 찾습니다.\n\n📋 자격 요건:\n  ✅ 비흡연자\n  ✅ 깔끔한 생활습관 보유자\n  ✅ 코골이 없는 분 (우대)\n  ❌ 알람 5번 이상 미루는 분 (거절)\n\n🏠 위치: {{university}} 정문 도보 10분\n💰 월세: 25만원\n\n면접(방문) 환영합니다 😄' },
    },
    popularTags: ['룸메이트', '셰어하우스', '투룸', '여성', '남성', '비흡연', '입주', '동거인'],
  },

  23: {
    examples: [
      categoryExamples[23],
      { title: '{{prefix}} {{university}} 근처 고시원 추천 (월 30만원)', price: '300000', negotiable: false,
        body: '{{university}} 근처 고시원 정보 공유합니다.\n\n■ 위치: {{university}} 후문 도보 3분\n■ 월세: 30만원 (공과금 포함)\n■ 시설: 개인 방, 공용 주방/화장실/샤워실\n■ 특징: 24시 출입, 냉난방 완비\n\n관심 있으시면 쪽지 주세요.',
        tags: ['고시원', '월세'], location: '{{university}} 후문 근처' },
    ],
    popularTags: ['하숙', '고시원', '월세', '식사포함', '단기', '조용한', '깨끗한', '대학근처'],
  },

  24: {
    examples: [
      categoryExamples[24],
      { title: '{{prefix}} {{university}} 근처 여름방학 2개월 단기임대', price: '280000', negotiable: true,
        body: '여름방학 기간 단기임대 합니다.\n\n■ 위치: {{university}} 정문 도보 7분\n■ 기간: 6~8월 (2개월)\n■ 월세: 28만원\n■ 옵션: 에어컨, 냉장고, 세탁기\n\n인턴/연구 하시는 분께 적합합니다.',
        tags: ['단기임대', '여름방학', '2개월'], location: '{{university}} 정문 근처' },
    ],
    popularTags: ['단기임대', '방학', '인턴', '연구', '월세', '풀옵션', '즉시입주', '자취방'],
    seasonalHints: { '6-7': { titleSuffix: '(여름방학)', bodyHint: '여름방학 기간 임대합니다.' }, '12-1': { titleSuffix: '(겨울방학)', bodyHint: '겨울방학 기간 임대합니다.' } },
  },

  25: {
    examples: [
      categoryExamples[25],
      { title: '{{prefix}} {{university}} 오피스텔 양도 (남은 계약 1년)', price: '0', negotiable: false,
        body: '오피스텔 계약 양도합니다.\n\n■ 위치: {{university}} 정문 도보 10분\n■ 남은 계약: 1년\n■ 보증금: 500만원 / 월세: 45만원\n■ 층수: 8층 / 엘리베이터\n■ 권리금: 없음\n\n직접 방문 후 결정하시면 됩니다.',
        tags: ['양도', '오피스텔', '계약'], location: '{{university}} 정문 근처' },
    ],
    popularTags: ['양도', '계약', '권리금없음', '오피스텔', '원룸', '즉시입주', '보증금', '협의가능'],
  },

  // ═══ 💼 일자리 (majorId: 3) ═══

  31: {
    examples: [
      categoryExamples[31],
      { title: '{{prefix}} {{university}} 편의점 주말 알바 모집', price: '12000', negotiable: false,
        body: '{{university}} 앞 편의점에서 주말 알바를 모집합니다.\n\n■ 근무지: {{university}} 정문 CU\n■ 시급: 12,000원\n■ 근무: 주말 오전 7시~오후 3시\n■ 우대: 편의점 경험자\n\n관심 있으시면 쪽지 주세요.',
        tags: ['알바', '편의점', '주말'], location: '{{university}} 정문 앞' },
      { title: '{{prefix}} 과외 학원 조교 모집 (주 3일)', price: '13000', negotiable: false,
        body: '{{university}} 근처 과외 학원에서 조교를 모집합니다.\n\n■ 업무: 수학 질문 답변, 출석 관리\n■ 시급: 13,000원\n■ 근무: 주 3일 (월수금 16~20시)\n■ 자격: {{university}} 재학생\n\n이력서와 함께 쪽지 주세요.',
        tags: ['학원', '조교', '아르바이트'], location: '{{university}} 근처' },
    ],
    popularTags: ['아르바이트', '알바', '카페', '편의점', '주말', '단기', '시급', '학생'],
    seasonalHints: { '6-7': { bodyHint: '방학 기간 알바 모집합니다.' }, '12-1': { bodyHint: '겨울방학 단기 알바 모집합니다.' } },
  },

  32: {
    examples: [
      categoryExamples[32],
      { title: '{{prefix}} 수학 과외 (고등/수능 전문)', price: '50000', negotiable: true,
        body: '{{university}} {{department}} {{memberType}}, 수학 과외합니다.\n\n■ 대상: 고등학생 (수능 수학)\n■ 수업 방식: 대면 ({{university}} 근처)\n■ 시급: 5만원\n■ 경력: 과외 경험 2년\n■ 성적: 수능 수학 1등급\n\n편하게 문의주세요.',
        tags: ['과외', '수학', '수능'], location: '{{university}} 스터디카페' },
    ],
    popularTags: ['과외', '수학', '영어', '수능', '내신', '대면', '비대면', '시급'],
  },

  53: {
    examples: [
      categoryExamples[53],
      { title: '{{prefix}} 기타 레슨 해드립니다 (초급~중급)', price: '40000', negotiable: true,
        body: '통기타/일렉기타 레슨 해드립니다.\n\n■ 대상: 초급~중급\n■ 수업: 주 1회 1시간\n■ 장소: {{university}} 근처 스튜디오\n■ 수강료: 월 16만원\n■ 경력: 밴드 활동 5년\n\n무료 체험 레슨 1회 가능합니다.',
        tags: ['기타', '레슨', '음악'], location: '{{university}} 근처' },
    ],
    popularTags: ['레슨', '피아노', '기타', '음악', '초급', '성인', '취미', '주1회'],
  },

  33: {
    examples: [
      categoryExamples[33],
      { title: '{{prefix}} AI 스타트업 개발 인턴 모집', price: '', negotiable: false,
        body: 'AI 기반 스타트업에서 개발 인턴을 모집합니다.\n\n■ 회사: (회사명)\n■ 위치: 강남역 도보 5분\n■ 기간: 3개월 (정규직 전환 가능)\n■ 급여: 월 250만원\n■ 기술: Python, PyTorch 경험자 우대\n\n이력서 + GitHub 링크와 함께 지원해주세요.',
        tags: ['인턴', 'AI', '개발'], location: '' },
    ],
    popularTags: ['인턴', '스타트업', '개발', 'AI', '마케팅', '디자인', '정규직전환', '유연근무'],
  },

  34: {
    examples: [
      categoryExamples[34],
      { title: '{{prefix}} {{department}} 교수님 연구실 TA 모집', price: '', negotiable: false,
        body: '{{university}} {{department}} 연구실에서 TA를 모집합니다.\n\n■ 과목: (과목명)\n■ 업무: 과제 채점, 실습 보조\n■ 근무: 주 10시간\n■ 급여: 학교 기준\n■ 자격: 해당 과목 A 이상 수강한 학생\n\n관심 있으시면 쪽지 주세요.',
        tags: ['TA', '조교', '연구실'], location: '{{university}} {{department}}' },
    ],
    popularTags: ['RA', 'TA', '연구보조', '조교', '연구실', '대학원', '학부연구생', '급여'],
  },

  35: {
    examples: [
      categoryExamples[35],
      { title: '{{prefix}} 앱 디자인 프리랜서 구합니다', price: '', negotiable: true,
        body: '모바일 앱 UI/UX 디자인 프리랜서를 구합니다.\n\n■ 프로젝트: 대학생 커뮤니티 앱\n■ 분량: 약 15개 화면\n■ 기간: 3주\n■ 예산: 100~150만원\n■ 협업 방식: Figma\n\n포트폴리오와 함께 쪽지 주세요.',
        tags: ['프리랜서', '디자인', '앱'], location: '' },
    ],
    popularTags: ['프리랜서', '외주', '웹개발', '디자인', '영상', '번역', '포트폴리오', '리모트'],
  },

  37: {
    examples: [
      categoryExamples[37],
      { title: '{{prefix}} {{university}} 축제 부스 스태프 모집', price: '12000', negotiable: false,
        body: '{{university}} 축제 기간 부스 스태프를 모집합니다.\n\n■ 기간: (날짜) 2일간\n■ 시간: 10:00~18:00\n■ 시급: 12,000원\n■ 업무: 부스 운영, 안내\n■ 자격: {{university}} 재학생\n\n관심 있으시면 쪽지 주세요.',
        tags: ['축제', '스태프', '단기알바'], location: '{{university}} 축제 부스' },
    ],
    popularTags: ['구인', '모집', '스태프', '단기', '이벤트', '축제', '주말', '학생'],
    seasonalHints: { '5,9': { bodyHint: '축제 시즌 스태프를 모집합니다.' } },
  },

  36: {
    examples: [
      categoryExamples[36],
      { title: '{{prefix}} 디자인 전공 {{memberType}} 구직합니다 (포폴 있음)', price: '', negotiable: false,
        body: '디자인 전공 {{memberType}} 구직합니다.\n\n■ 가능 업무: 그래픽 디자인, UI/UX, 영상편집\n■ 가능 시간: 주 20시간 이상\n■ 툴: Figma, Photoshop, Premiere Pro\n■ 포트폴리오: (링크)\n\n편하게 연락주세요.',
        tags: ['구직', '디자인', '포트폴리오'], location: '' },
    ],
    popularTags: ['구직', '이력서', '포트폴리오', '경험', '재택', '파트타임', '풀타임', '협의'],
  },

  // ═══ 👥 커뮤니티 (majorId: 4) ═══

  41: {
    examples: [
      categoryExamples[41],
      { title: '{{prefix}} TOEIC 900+ 스터디 모집 (주 2회)', price: '', negotiable: false,
        body: 'TOEIC 900점 이상 목표 스터디 팀원을 모집합니다.\n\n■ 목표: 900+ 달성\n■ 모임: 주 2회 (화/목 19시)\n■ 장소: {{university}} 도서관 스터디룸\n■ 인원: 4명 (현재 2명)\n■ 기간: 2개월\n\n현재 점수 800 이상인 분 환영합니다!',
        tags: ['TOEIC', '스터디', '영어'], location: '{{university}} 도서관' },
      { title: '{{prefix}} 코딩테스트 준비 스터디 모집', price: '', negotiable: false,
        body: '코딩테스트 준비 스터디를 모집합니다.\n\n■ 내용: 백준/프로그래머스 문제 풀이\n■ 언어: Python / C++\n■ 모임: 주 1회 (토요일 오후)\n■ 인원: 3~4명\n■ 레벨: 실버~골드\n\n함께 성장할 분 쪽지 주세요!',
        tags: ['코딩테스트', '스터디', '알고리즘'], location: '{{university}} 스터디카페' },
    ],
    popularTags: ['스터디', '팀원모집', 'TOEIC', '코딩', '자격증', '시험', '함께', '모집중'],
    seasonalHints: { '2-3': { bodyHint: '새학기 스터디를 시작합니다!' }, '4,10': { bodyHint: '시험 대비 스터디입니다.' } },
  },

  42: {
    examples: [
      categoryExamples[42],
      { title: '{{prefix}} {{university}} 밴드 동아리 멤버 모집 (드럼/베이스)', price: '', negotiable: false,
        body: '{{university}} 밴드 동아리에서 멤버를 모집합니다.\n\n■ 동아리명: (이름)\n■ 모집 파트: 드럼, 베이스\n■ 활동: 주 1회 합주 + 학기말 공연\n■ 회비: 월 1만원\n■ 실력: 초급도 환영!\n\n음악 좋아하시는 분 편하게 지원해주세요.',
        tags: ['밴드', '동아리', '음악'], location: '{{university}} 동아리방' },
    ],
    popularTags: ['동아리', '모집', '밴드', '운동', '봉사', '학술', '여행', '신입부원'],
    seasonalHints: { '2-3': { titleSuffix: '(신학기 모집)', bodyHint: '새학기 신입부원을 모집합니다!' } },
  },

  43: {
    examples: [
      categoryExamples[43],
      { title: '{{prefix}} {{university}} → 서울역 카풀 (금요일 18시)', price: '4000', negotiable: false,
        body: '{{university}}에서 서울역 방면 카풀합니다.\n\n■ 출발: {{university}} 후문 주차장\n■ 도착: 서울역\n■ 시간: 금요일 18:00\n■ 인원: 3명\n■ 비용: 1인 4,000원\n\n편하게 쪽지 주세요.',
        tags: ['카풀', '서울역', '금요일'], location: '{{university}} 후문 주차장' },
    ],
    popularTags: ['카풀', '동행', '택시쉐어', '출퇴근', '주말', '공항', '여행', '비용분담'],
  },

  44: {
    examples: [
      categoryExamples[44],
      { title: '{{prefix}} {{university}} 도서관에서 에어팟 분실', price: '', negotiable: false,
        body: '{{university}} 도서관에서 에어팟을 분실했습니다.\n\n■ 분실 장소: 도서관 3층 열람실\n■ 분실 시간: (날짜) 오후 4시경\n■ 특징: 에어팟 프로 2, 화이트 케이스에 스티커 부착\n\n발견하신 분 꼭 연락 부탁드립니다. 사례합니다!',
        tags: ['분실물', '에어팟', '도서관'], location: '{{university}} 도서관' },
    ],
    popularTags: ['분실물', '습득물', '지갑', '에어팟', '학생증', '도서관', '사례', '급찾'],
  },

  45: {
    examples: [
      categoryExamples[45],
      { title: '{{prefix}} AI/머신러닝 세미나 안내 (무료)', price: '', negotiable: false,
        body: 'AI/머신러닝 관련 특별 세미나를 안내합니다.\n\n■ 주제: 대규모 언어 모델의 최신 동향\n■ 연사: (교수명) ({{university}} {{department}})\n■ 일시: (날짜) 16:00~18:00\n■ 장소: {{university}} (건물명) 대강당\n■ 대상: 누구나 참석 가능\n\n참석 무료, 사전 등록 불필요합니다.',
        tags: ['세미나', 'AI', '머신러닝'], location: '{{university}}' },
    ],
    popularTags: ['세미나', '학술', '강연', '무료', '특강', 'AI', '초청', '대학원'],
  },

  46: {
    examples: [
      categoryExamples[46],
      { title: '{{prefix}} {{university}} 학식 솔직 리뷰', price: '', negotiable: false,
        body: '오늘 {{university}} 학식 리뷰입니다.\n\n🍽️ 메뉴: (메뉴명)\n💰 가격: (가격)\n⭐ 평점: ★★★☆☆\n📝 한줄평: (평가)\n\n여러분의 리뷰도 남겨주세요!',
        tags: ['학식', '리뷰', '맛집'], location: '{{university}} 학생식당' },
    ],
    popularTags: ['자유게시판', '일상', '질문', '리뷰', '꿀팁', '정보', '토론', '잡담'],
  },

  47: {
    examples: [
      categoryExamples[47],
      { title: '{{prefix}} 유기견 보호소 봉사활동 같이 가실 분', price: '', negotiable: false,
        body: '유기견 보호소 봉사활동 함께 가실 분을 모집합니다.\n\n■ 일시: (날짜) 오전 10시~오후 1시\n■ 장소: (보호소명)\n■ 활동: 산책, 목욕, 놀아주기\n■ 봉사시간: 3시간 인정\n■ 집합: {{university}} 정문 9:30\n\n동물을 좋아하시는 분 환영!',
        tags: ['봉사활동', '유기견', '동물'], location: '{{university}} 정문' },
    ],
    popularTags: ['봉사활동', '봉사시간', '참여', '모집', '환경', '교육', '무료', '주말'],
  },

  // ═══ 🛠️ 서비스 (majorId: 5) ═══

  51: {
    examples: [
      categoryExamples[51],
      { title: '{{prefix}} 소형 이사 도와드립니다 (1톤 트럭)', price: '80000', negotiable: true,
        body: '소형 이사/운송 도와드립니다.\n\n■ 차량: 1톤 트럭\n■ 서비스: 짐 싣기 + 운송 + 내리기\n■ 지역: {{university}} 근처 ~ 수도권 전역\n■ 가격: 8만원~ (거리/짐에 따라 협의)\n\n이사 날짜와 짐 양 알려주시면 견적 드립니다.',
        tags: ['이사', '운송', '트럭'], location: '{{university}} 근처' },
    ],
    popularTags: ['이사', '운송', '도움', '트럭', '자취', '소형이사', '원룸', '당일'],
    seasonalHints: { '2-3': { bodyHint: '새학기 이사 도와드립니다!' }, '6-7': { bodyHint: '방학 이사 예약 받습니다.' } },
  },

  52: {
    examples: [
      categoryExamples[52],
      { title: '{{prefix}} 조립가구 설치 도와드립니다', price: '20000', negotiable: true,
        body: '이케아 등 조립가구 설치 도와드립니다.\n\n■ 가능 품목: 책상, 책장, 침대 프레임 등\n■ 소요: 1~2시간\n■ 비용: 2만원 (품목당)\n■ 도구: 개인 공구 보유\n\n{{university}} 근처 방문해서 조립해드립니다.',
        tags: ['조립', '설치', '가구'], location: '{{university}} 근처' },
    ],
    popularTags: ['수리', '설치', '조립', '에어컨', '가구', '이케아', '전기', '도움'],
  },

  54: {
    examples: [
      categoryExamples[54],
      { title: '{{prefix}} 배달 대행 해드립니다 ({{university}} 근처)', price: '5000', negotiable: true,
        body: '{{university}} 근처 배달/수거 대행합니다.\n\n■ 범위: {{university}} 반경 2km\n■ 비용: 건당 5,000원~\n■ 가능 시간: 평일 10시~20시\n\n필요하시면 쪽지 주세요.',
        tags: ['대행', '배달', '수거'], location: '{{university}} 근처' },
    ],
    popularTags: ['대행', '줄서기', '배달', '수거', '심부름', '당일', '즉시', '캠퍼스'],
  },

  55: {
    examples: [
      categoryExamples[55],
      { title: '{{prefix}} 이력서/자소서 첨삭 해드립니다', price: '10000', negotiable: true,
        body: '이력서/자기소개서 첨삭 서비스입니다.\n\n■ 경력: 대기업 합격 경험 + 첨삭 50건 이상\n■ 비용: 이력서 1만원 / 자소서 2만원\n■ 소요: 1~2일\n■ 방식: 파일 전달 → 첨삭 후 회신\n\n샘플 확인 가능합니다. 쪽지 주세요.',
        tags: ['이력서', '자소서', '첨삭'], location: '' },
    ],
    popularTags: ['서비스', '대행', '이력서', '자소서', '번역', '편집', '도움', '전문가'],
  },

  56: {
    examples: [
      categoryExamples[56],
      { title: '{{prefix}} 맥북 수리/점검 해드립니다', price: '30000', negotiable: true,
        body: '맥북 소프트웨어 수리/점검 해드립니다.\n\n■ 가능: macOS 재설치, 데이터 백업, 속도 최적화\n■ 비용: 3만원~\n■ 소요: 1~3시간\n■ 장소: {{university}} 카페\n\n컴공 전공, 수리 경험 다수.',
        tags: ['맥북', '수리', '점검'], location: '{{university}} 카페' },
    ],
    popularTags: ['IT', '컴퓨터', '수리', '포맷', '맥북', '윈도우', '프린터', '네트워크'],
  },

  57: {
    examples: [
      categoryExamples[57],
      { title: '{{prefix}} 네일아트 해드립니다 (학생 할인)', price: '15000', negotiable: false,
        body: '네일아트 해드립니다.\n\n■ 메뉴: 젤네일 기본 15,000원 / 아트 추가 +5,000원\n■ 장소: {{university}} 근처 개인 작업실\n■ 소요: 약 1시간~1시간 30분\n■ 예약: 쪽지로 날짜/시간 문의\n\n포트폴리오 사진 있습니다.',
        tags: ['네일', '뷰티', '학생할인'], location: '{{university}} 근처' },
    ],
    popularTags: ['뷰티', '미용', '헤어', '네일', '메이크업', '학생할인', '저렴', '포트폴리오'],
  },

  58: {
    examples: [
      categoryExamples[58],
      { title: '{{prefix}} 러닝 크루 멤버 모집 (주 2회)', price: '', negotiable: false,
        body: '{{university}} 러닝 크루 멤버를 모집합니다.\n\n■ 코스: {{university}} 캠퍼스 주변 5km\n■ 시간: 주 2회 (화/목 7AM)\n■ 페이스: 6~7분/km (초보 환영)\n■ 참가비: 무료\n\n함께 달릴 분 쪽지 주세요!',
        tags: ['러닝', '운동', '크루'], location: '{{university}} 정문' },
    ],
    popularTags: ['운동', 'PT', '헬스', '러닝', '파트너', '요가', '필라테스', '크루'],
  },

  59: {
    examples: [
      categoryExamples[59],
      { title: '{{prefix}} 고양이 돌봄 시터 구합니다 (방학 기간)', price: '20000', negotiable: true,
        body: '방학 기간 고양이 돌봄 시터를 구합니다.\n\n■ 반려동물: 고양이 1마리 (코숏)\n■ 기간: (날짜)~(날짜) 약 2주\n■ 업무: 하루 1회 방문, 밥/물/화장실 관리\n■ 비용: 1회 2만원\n\n고양이를 좋아하시는 분 연락주세요.',
        tags: ['펫시터', '고양이', '돌봄'], location: '{{university}} 근처' },
    ],
    popularTags: ['반려동물', '산책', '펫시터', '강아지', '고양이', '돌봄', '방학', '도우미'],
  },

  // ═══ 🏪 캠퍼스라이프 (majorId: 6) ═══

  61: {
    examples: [
      categoryExamples[61],
      { title: '{{prefix}} {{university}} 정문 새로 생긴 마라탕 후기', price: '', negotiable: false,
        body: '{{university}} 정문에 새로 생긴 마라탕집 다녀왔습니다.\n\n■ 가게명: (이름)\n■ 위치: {{university}} 정문 도보 2분\n■ 추천: 마라탕 + 꿔바로우 세트\n■ 가격: 1인 9,000원~\n■ 분위기: 깔끔하고 넓음\n\n맵기 조절 가능하고 양도 푸짐해요!',
        tags: ['맛집', '마라탕', '후기'], location: '{{university}} 정문 근처' },
    ],
    popularTags: ['맛집', '카페', '후기', '추천', '학생할인', '가성비', '신메뉴', '숨은맛집'],
  },

  62: {
    examples: [
      categoryExamples[62],
      { title: '{{prefix}} {{university}} 앞 카페 학생 할인 50% (이번 주만!)', price: '', negotiable: false,
        body: '{{university}} 앞 카페에서 학생 할인 이벤트 중입니다!\n\n■ 가게: (카페명)\n■ 할인: 전 메뉴 50% (학생증 필수)\n■ 기간: 이번 주 월~금\n■ 위치: {{university}} 후문 도보 1분\n\n학생증 꼭 챙겨가세요!',
        tags: ['할인', '카페', '학생할인'], location: '{{university}} 후문 근처' },
    ],
    popularTags: ['할인', '이벤트', '학생할인', '쿠폰', '무료', '1+1', '오픈이벤트', '기간한정'],
  },

  63: {
    examples: [
      categoryExamples[63],
      { title: '{{prefix}} {{university}} 후문 새 카페 오픈 (드립커피 전문)', price: '', negotiable: false,
        body: '{{university}} 후문에 드립커피 전문 카페가 오픈했습니다.\n\n■ 가게명: (이름)\n■ 특징: 싱글오리진 드립커피 전문\n■ 가격: 아메리카노 3,500원\n■ 오픈 이벤트: 첫 주 전 메뉴 30% 할인\n\n공부하기 좋은 분위기에요.',
        tags: ['신규오픈', '카페', '드립커피'], location: '{{university}} 후문 근처' },
    ],
    popularTags: ['신규오픈', '카페', '맛집', '오픈이벤트', '할인', '후기', '가게', '인테리어'],
  },

  64: {
    examples: [
      categoryExamples[64],
      { title: '{{prefix}} {{university}} 앞 치킨집 배달 알바 모집', price: '12000', negotiable: false,
        body: '{{university}} 앞 치킨집에서 배달 알바를 모집합니다.\n\n■ 시급: 12,000원 + 건당 배달비\n■ 근무: 주 3일 이상 (시간 협의)\n■ 자격: 오토바이 면허 보유자\n■ 우대: {{university}} 재학생\n\n매장 방문 또는 쪽지 주세요.',
        tags: ['배달', '알바', '치킨'], location: '{{university}} 정문 앞' },
    ],
    popularTags: ['구인', '아르바이트', '매장', '서빙', '배달', '주방', '학생우대', '시급'],
  },

  // ═══ 📣 긱·의뢰 (majorId: 7) ═══

  71: {
    examples: [
      categoryExamples[71],
      { title: '{{prefix}} {{university}} 택배 수거 대행 구합니다', price: '5000', negotiable: false,
        body: '수업 때문에 택배 수거를 못 합니다.\n\n■ 장소: {{university}} 무인택배함\n■ 수거 후: (건물명) 연구실까지 전달\n■ 일시: (날짜) 오후\n■ 사례비: 5,000원\n\n가벼운 소포 1개입니다.',
        tags: ['택배', '심부름', '대행'], location: '{{university}} 무인택배함' },
    ],
    popularTags: ['심부름', '대행', '택배', '서류', '구매대행', '수거', '캠퍼스', '당일'],
  },

  72: {
    examples: [
      categoryExamples[72],
      { title: '{{prefix}} 영어→한국어 번역 의뢰 (학술 자료)', price: '50000', negotiable: true,
        body: '영어 학술 자료 한국어 번역을 의뢰합니다.\n\n■ 분야: {{department}} 관련\n■ 분량: A4 10페이지 (약 3,000단어)\n■ 마감: (날짜)\n■ 예산: 5만원 (협의 가능)\n\n관련 전공자 또는 번역 경험자 우대.',
        tags: ['번역', '영한', '학술'], location: '' },
    ],
    popularTags: ['번역', '통역', '영문교정', '논문', '영어', '일본어', '중국어', '학술'],
  },

  73: {
    examples: [
      categoryExamples[73],
      { title: '{{prefix}} 로고 디자인 의뢰 (동아리/팀)', price: '50000', negotiable: true,
        body: '동아리/팀 로고 디자인을 의뢰합니다.\n\n■ 용도: 동아리 로고 + 굿즈 제작용\n■ 스타일: 미니멀, 모던\n■ 마감: (날짜)\n■ 예산: 5만원\n■ 수정: 2회까지 포함\n\n참고 이미지와 함께 쪽지 주세요.',
        tags: ['로고', '디자인', '일러스트'], location: '' },
    ],
    popularTags: ['디자인', 'PPT', '로고', '포스터', '일러스트', '영상', 'Figma', '포토샵'],
  },

  74: {
    examples: [
      categoryExamples[74],
      { title: '{{prefix}} 유튜브 영상 편집 의뢰 (10분 분량)', price: '50000', negotiable: true,
        body: '유튜브 영상 편집을 의뢰합니다.\n\n■ 분량: 원본 30분 → 편집본 10분\n■ 스타일: 자막 + 효과음 + 간단한 모션그래픽\n■ 마감: (날짜)\n■ 예산: 5만원 (협의 가능)\n\n포트폴리오와 함께 쪽지 주세요.',
        tags: ['영상편집', '유튜브', '촬영'], location: '' },
    ],
    popularTags: ['촬영', '편집', '유튜브', '증명사진', '브이로그', '인물', '영상', '사진'],
  },

  75: {
    examples: [
      categoryExamples[75],
      { title: '{{prefix}} UX 리서치 인터뷰 참여자 모집 (사례 2만원)', price: '20000', negotiable: false,
        body: '앱 서비스 UX 리서치 인터뷰 참여자를 모집합니다.\n\n■ 주제: 대학생 중고거래 경험\n■ 소요: 약 30분 (대면 or 비대면)\n■ 사례: 2만원 (커피 기프티콘)\n■ 대상: {{university}} 재학생 중 중고거래 경험자\n\n참여 신청은 쪽지로!',
        tags: ['UX리서치', '인터뷰', '사례금'], location: '' },
    ],
    popularTags: ['설문조사', '참여', '사례금', '기프티콘', '인터뷰', 'UX', '연구', '모집'],
  },

  76: {
    examples: [
      categoryExamples[76],
      { title: '{{prefix}} 이삿짐 정리 도와주실 분 구합니다', price: '30000', negotiable: true,
        body: '이삿짐 정리를 도와주실 분을 구합니다.\n\n■ 장소: {{university}} 근처 자취방\n■ 일시: (날짜) 오후\n■ 소요: 약 2~3시간\n■ 사례비: 3만원\n■ 내용: 짐 정리, 청소 보조\n\n편하게 연락주세요.',
        tags: ['이삿짐', '정리', '도움'], location: '{{university}} 근처' },
    ],
    popularTags: ['의뢰', '도움', '대행', '급구', '당일', '단기', '사례비', '캠퍼스'],
  },
};
