import { ScrapingSource } from '@/types'

// 성남시 데이터 소스 (시뮬레이션용 구조)
// 실제 배포 시 각 도시의 실제 URL로 교체
export const SEONGNAM_SOURCES: ScrapingSource[] = [
  {
    name: '성남시 민원게시판',
    url: 'https://www.seongnam.go.kr/complaint',
    type: 'complaint',
    selector: {
      list: '.board-list tr',
      title: '.title a',
      content: '.content',
      date: '.date'
    }
  },
  {
    name: '분당신문',
    url: 'https://www.bundangnews.co.kr',
    type: 'news',
    selector: {
      list: '.article-list li',
      title: 'h3 a',
      content: '.summary',
      date: '.date'
    }
  },
  {
    name: '성남시정신문',
    url: 'https://www.snsnews.co.kr',
    type: 'news',
    selector: {
      list: '.news-item',
      title: '.headline a',
      content: '.excerpt',
      date: '.timestamp'
    }
  }
]

// 도시별 소스 매핑
export const CITY_SOURCES: Record<string, ScrapingSource[]> = {
  seongnam: SEONGNAM_SOURCES,
  // 다른 도시 추가 시:
  // seoul: SEOUL_SOURCES,
  // busan: BUSAN_SOURCES,
}

export function getSourcesForCity(cityCode: string): ScrapingSource[] {
  return CITY_SOURCES[cityCode] || []
}
