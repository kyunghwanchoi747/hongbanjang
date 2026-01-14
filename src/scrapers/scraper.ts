import axios from 'axios'
import * as cheerio from 'cheerio'
import { ScrapingSource, RawDataItem } from '@/types'

export class DataScraper {
  private source: ScrapingSource

  constructor(source: ScrapingSource) {
    this.source = source
  }

  async scrape(): Promise<RawDataItem[]> {
    try {
      const response = await axios.get(this.source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      })

      const $ = cheerio.load(response.data)
      const items: RawDataItem[] = []

      $(this.source.selector.list).each((_, element) => {
        const title = $(element).find(this.source.selector.title).text().trim()
        const content = $(element).find(this.source.selector.content).text().trim()
        const dateStr = this.source.selector.date
          ? $(element).find(this.source.selector.date).text().trim()
          : undefined

        if (title) {
          items.push({
            title,
            content,
            url: $(element).find(this.source.selector.title).attr('href'),
            date: dateStr ? new Date(dateStr) : undefined,
            source: this.source.name
          })
        }
      })

      return items
    } catch (error) {
      console.error(`스크래핑 실패: ${this.source.name}`, error)
      return []
    }
  }
}

// 시뮬레이션 데이터 생성기 (개발/테스트용)
export function generateSimulatedData(cityName: string): RawDataItem[] {
  const simulatedComplaints: RawDataItem[] = [
    {
      title: `${cityName} 분당구 정자동 보도블록 파손 방치`,
      content: `정자동 카페거리 보도블록이 6개월째 파손된 상태로 방치되어 있습니다.
        어르신들 넘어지시고, 유모차 통행도 어렵습니다. 민원을 3번이나 넣었는데
        매번 "예산 검토 중"이라는 답변만 받았습니다. 시민 안전은 뒷전입니까?`,
      date: new Date('2024-01-15'),
      source: `${cityName} 민원게시판`
    },
    {
      title: `${cityName} 모란시장 주차장 문제 심각`,
      content: `모란시장 방문객 주차 문제가 너무 심각합니다. 불법주차 단속은 하면서
        대체 주차장 마련은 안 하고 있습니다. 상인들 매출은 떨어지고,
        주민들은 불법주차 때문에 불편합니다. 2년째 해결 안 되고 있습니다.`,
      date: new Date('2024-01-20'),
      source: `${cityName} 민원게시판`
    },
    {
      title: `${cityName} 어린이집 대기 1년... 맞벌이 부부 한계`,
      content: `공립어린이집 대기번호 300번대입니다. 1년 넘게 기다려도 소식이 없습니다.
        민간어린이집은 비용이 2배인데 시에서는 어떤 대책도 없습니다.
        출산율 걱정하면서 양육 지원은 이 정도입니까?`,
      date: new Date('2024-02-01'),
      source: `${cityName} 시정신문`
    },
    {
      title: `[단독] ${cityName} 재개발 지연, 주민 피해 눈덩이`,
      content: `${cityName} 신흥동 재개발 사업이 5년째 지연되면서 주민 피해가 커지고 있다.
        이주비 미지급, 임시거처 문제로 수십 가구가 어려움을 겪고 있으며,
        시 관계자는 "절차상 문제"라며 책임을 회피하고 있다.`,
      date: new Date('2024-02-10'),
      source: '분당신문'
    },
    {
      title: `${cityName} 버스노선 개편 후 출퇴근 지옥`,
      content: `최근 버스노선 개편 이후 야탑역 환승이 불가능해졌습니다.
        기존 15분 걸리던 출근길이 45분으로 늘어났습니다.
        주민 의견 수렴 없이 일방적으로 개편한 것 아닙니까?
        매일 지각 위기입니다.`,
      date: new Date('2024-02-15'),
      source: `${cityName} 민원게시판`
    }
  ]

  return simulatedComplaints
}
