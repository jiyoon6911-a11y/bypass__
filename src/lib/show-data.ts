
export interface Show {
  id: number;
  type: string;
  title: string;
  venue: string;
  distance: string;
  badges: string[];
  image: string;
  imgClass: string;
}

export const BASE_SHOWS: Show[] = [
  { 
    id: 1, 
    type: '뮤지컬', 
    title: '오페라의 유령', 
    venue: '샤롯데씨어터', 
    distance: '1.2km', 
    badges: ['휠체어', '자막'], 
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=400',
    imgClass: 'bg-zinc-800' 
  },
  { 
    id: 2, 
    type: '연극', 
    title: '리어왕', 
    venue: '국립극장 해오름', 
    distance: '3.4km', 
    badges: ['음성해설'], 
    image: 'https://images.unsplash.com/photo-1503095396549-807a89010046?auto=format&fit=crop&q=80&w=400',
    imgClass: 'bg-zinc-800' 
  },
  { 
    id: 3, 
    type: '콘서트', 
    title: '현대카드 슈퍼콘서트', 
    venue: '잠실주경기장', 
    distance: '4.1km', 
    badges: ['휠체어'], 
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=400',
    imgClass: 'bg-zinc-900' 
  },
  { 
    id: 4, 
    type: '연극', 
    title: '403 BYPASS (VR 시범운영)', 
    venue: '한림대학교 10관', 
    distance: '500m', 
    badges: ['휠체어', 'VR시야'], 
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=400',
    imgClass: 'bg-zinc-900' 
  }
];

export const SHOW_TITLES: Record<string, string[]> = {
  '뮤지컬': ['지킬 앤 하이드', '레미제라블', '시카고', '킹키부츠', '데스노트', '드라큘라', '맘마미아', '스위니 토드', '엘리자벳', '모차르트!'],
  '연극': ['고도를 기다리며', '갈매기', '에쿠우스', '조지아 맥브라이드의 전설', '아트', '클로저', '옥탑방 고양이', '쉬어매드니스', '라이어'],
  '클래식': ['쇼팽 피아노 협주곡', '베토벤 교향곡 9번', '빈 필하모닉 내한공연', '조성진 피아노 리사이틀', '임윤찬 & 뮌헨 필하모닉'],
  '콘서트': ['아이유 콘서트', '박효신 팬미팅', '콜드플레이 월드투어', '뉴진스 서머 스테이지', '성시경 소극장 콘서트'],
  '오페라': ['라트라비아타', '카르멘', '마술피리', '투란도트', '돈 조반니'],
  '무용': ['백조의 호수', '호두까기 인형', '지젤', '현대무용: 정지', '한국무용의 밤'],
  '전통예술': ['창극: 춘향가', '국악 한마당', '판소리 다섯마당', '사물놀이 정기공연'],
  '대중음악': ['버스킹 데이', '인디밴드 페스티벌', '재즈 나잇 인 서울']
};

export const SHOW_IMAGES: Record<string, string[]> = {
  '뮤지컬': [
    'https://images.unsplash.com/photo-1514302240736-b1fee598926c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1485038422880-92761bc99249?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600'
  ],
  '연극': [
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1503095396549-807a89010046?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1474418397713-7ded61d0682f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&q=80&w=600'
  ],
  '콘서트': [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1459749411177-042180ceea72?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600'
  ],
  '클래식': [
    'https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1520527057854-153f9e94bbbf?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1507838596058-a7628c713e72?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?auto=format&fit=crop&q=80&w=600'
  ],
  '오페라': [
    'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1629194269145-207909c258d4?auto=format&fit=crop&q=80&w=600'
  ],
  '무용': [
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600'
  ]
};

export const TYPES = ['뮤지컬', '연극', '클래식', '콘서트', '오페라', '무용', '전통예술', '대중음악'];
export const BADGES = ['휠체어', '자막', '음성해설', '수어', 'VR시야'];
export const VENUES = ['예술의전당', '세종문화회관', '샤롯데씨어터', '블루스퀘어', '올림픽공원', '국립극장', 'LG아트센터', '충무아트센터'];

export const GENERATED_SHOWS: Show[] = Array.from({ length: 300 }, (_, i) => {
  const type = TYPES[i % TYPES.length];
  const titlesForType = SHOW_TITLES[type] || [`공연명 ${i + 1}`];
  const title = titlesForType[i % titlesForType.length];
  
  const imagesForType = SHOW_IMAGES[type] || SHOW_IMAGES['뮤지컬'];
  const image = imagesForType[i % imagesForType.length];
  
  const badgeCount = (i % BADGES.length) + 1;
  const showBadges = [];
  if (i % 3 === 0) {
    showBadges.push('휠체어', '자막', '음성해설', '수어', 'VR시야'); 
  } else {
    for (let j = 0; j < badgeCount; j++) {
      showBadges.push(BADGES[(i + j) % BADGES.length]);
    }
  }

  return {
    id: i + 5,
    type,
    title,
    venue: VENUES[i % VENUES.length],
    distance: `${(Math.random() * 5 + 0.1).toFixed(1)}km`,
    badges: Array.from(new Set(showBadges)),
    image,
    imgClass: 'bg-zinc-900'
  };
});

export const SHOWS: Show[] = [...BASE_SHOWS, ...GENERATED_SHOWS];
