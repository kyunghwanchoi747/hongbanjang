import { RawDataItem, StructuredCase } from '@/types'
import { AI_CONFIG } from '@/lib/config'

// 데이터 구조화 에이전트
// 수집된 날것의 데이터를 [사건명/피고/쟁점/관련법령]으로 변환

export class CaseStructurizer {

  // 시뮬레이션 모드 (OpenAI API 없을 때)
  structureWithRules(data: RawDataItem): StructuredCase {
    const content = `${data.title} ${data.content}`

    // 키워드 기반 피고 추정
    const defendant = this.inferDefendant(content)

    // 키워드 기반 관련 법령 추정
    const relatedLaws = this.inferLaws(content)

    // 핵심 쟁점 추출
    const issue = this.extractIssue(data)

    return {
      caseName: this.generateCaseName(data.title),
      defendant,
      issue,
      relatedLaws,
      evidence: [data.content.slice(0, 200) + '...']
    }
  }

  private inferDefendant(content: string): string {
    const departmentKeywords: Record<string, string[]> = {
      '도시교통과': ['버스', '노선', '교통', '주차', '신호등'],
      '도시재생과': ['재개발', '재건축', '정비사업', '이주'],
      '도로관리과': ['보도블록', '도로', '인도', '포장'],
      '보육정책과': ['어린이집', '유치원', '보육', '양육'],
      '공원녹지과': ['공원', '녹지', '조경', '가로수'],
      '환경정책과': ['쓰레기', '환경', '소음', '악취'],
      '건축과': ['건축', '건물', '불법건축', '인허가'],
    }

    for (const [dept, keywords] of Object.entries(departmentKeywords)) {
      if (keywords.some(kw => content.includes(kw))) {
        return dept
      }
    }

    return '시정담당관실'
  }

  private inferLaws(content: string): string[] {
    const lawKeywords: Record<string, string[]> = {
      '도로교통법': ['교통', '신호', '횡단보도', '주차'],
      '도시 및 주거환경정비법': ['재개발', '재건축', '정비', '이주'],
      '영유아보육법': ['어린이집', '보육', '유치원'],
      '도로법': ['도로', '보도', '인도'],
      '민원처리에 관한 법률': ['민원', '답변', '처리'],
      '지방자치법': ['시', '구', '행정', '조례'],
    }

    const found: string[] = []
    for (const [law, keywords] of Object.entries(lawKeywords)) {
      if (keywords.some(kw => content.includes(kw))) {
        found.push(law)
      }
    }

    return found.length > 0 ? found : ['지방자치법']
  }

  private extractIssue(data: RawDataItem): string {
    // 핵심 문장 추출 (물음표나 감정적 표현 포함 문장)
    const sentences = data.content.split(/[.?!]/).filter(s => s.trim())

    const issueSentence = sentences.find(s =>
      s.includes('?') ||
      s.includes('왜') ||
      s.includes('어떻게') ||
      s.includes('문제') ||
      s.includes('심각')
    )

    return issueSentence?.trim() || sentences[0]?.trim() || data.title
  }

  private generateCaseName(title: string): string {
    // 사건명 형식화
    const cleanTitle = title
      .replace(/\[.*?\]/g, '')
      .replace(/【.*?】/g, '')
      .trim()

    return cleanTitle.length > 30
      ? cleanTitle.slice(0, 30) + '...'
      : cleanTitle
  }

  // OpenAI API 사용 모드
  async structureWithAI(data: RawDataItem): Promise<StructuredCase> {
    if (!AI_CONFIG.useOpenAI) {
      return this.structureWithRules(data)
    }

    // OpenAI API 호출 로직
    const prompt = `
다음 민원/뉴스 데이터를 분석하여 법정 사건 형식으로 구조화하세요.

제목: ${data.title}
내용: ${data.content}
출처: ${data.source}

다음 JSON 형식으로 응답하세요:
{
  "caseName": "사건명 (간결하게)",
  "defendant": "피고 (담당 부서명)",
  "issue": "핵심 쟁점 (한 문장)",
  "relatedLaws": ["관련 법령1", "관련 법령2"],
  "evidence": ["핵심 증거 발췌1", "핵심 증거 발췌2"]
}
`

    try {
      const { OpenAI } = await import('openai')
      const openai = new OpenAI()

      const response = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      return result as StructuredCase
    } catch {
      // API 실패 시 규칙 기반 폴백
      return this.structureWithRules(data)
    }
  }
}
