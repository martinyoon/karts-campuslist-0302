import type { University } from '@/lib/types';

export const universities: University[] = [
  {
    id: 4, name: 'KAIST', slug: 'kaist', nameEn: 'Korea Advanced Institute of Science and Technology',
    domain: 'kaist.ac.kr', region: '대전 유성', logoUrl: null, isActive: true,
    campuses: [
      { name: '대전 본원', region: '대전 유성' },
      { name: '서울캠퍼스', region: '서울 동대문' },
    ],
  },
  {
    id: 5, name: '한예종', slug: 'karts', nameEn: 'Korea National University of Arts', nameKo: '한국예술종합학교',
    domain: 'karts.ac.kr', region: '서울 석관', logoUrl: null, isActive: true,
    campuses: [
      { name: '석관동 캠퍼스', region: '서울 석관' },
      { name: '서초동 캠퍼스', region: '서울 서초' },
      { name: '대학로 캠퍼스', region: '서울 대학로' },
    ],
  },
  {
    id: 1, name: '서울대학교', slug: 'snu', nameEn: 'Seoul National University',
    domain: 'snu.ac.kr', region: '서울 관악', logoUrl: null, isActive: true,
    campuses: [
      { name: '관악캠퍼스', region: '서울 관악' },
      { name: '연건캠퍼스', region: '서울 연건' },
      { name: '시흥캠퍼스', region: '경기 시흥' },
    ],
  },
  {
    id: 2, name: '연세대학교', slug: 'yonsei', nameEn: 'Yonsei University',
    domain: 'yonsei.ac.kr', region: '서울 신촌', logoUrl: null, isActive: true,
    campuses: [
      { name: '신촌캠퍼스', region: '서울 신촌' },
      { name: '국제캠퍼스', region: '인천 송도' },
      { name: '미래캠퍼스', region: '강원 원주' },
    ],
  },
  {
    id: 3, name: '고려대학교', slug: 'korea', nameEn: 'Korea University',
    domain: 'korea.ac.kr', region: '서울 안암', logoUrl: null, isActive: true,
    campuses: [
      { name: '안암캠퍼스', region: '서울 안암' },
      { name: '세종캠퍼스', region: '세종 조치원' },
    ],
  },
];
