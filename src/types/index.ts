// 사건 구조화 데이터
export interface StructuredCase {
  caseName: string      // 사건명
  defendant: string     // 피고 (담당 부서/기관)
  issue: string         // 핵심 쟁점
  relatedLaws: string[] // 관련 법령
  evidence: string[]    // 증거 (민원/뉴스 발췌)
}

// 에이전트 역할
export type AgentRole = 'PROSECUTOR' | 'DEFENDER' | 'JUDGE'

// 에이전트 메시지
export interface AgentMessage {
  role: AgentRole
  content: string
  timestamp: Date
  replyTo?: string
}

// 재판 상태
export interface TrialState {
  caseId: string
  status: 'PENDING' | 'IN_TRIAL' | 'VOTING' | 'CLOSED'
  currentRound: number
  messages: AgentMessage[]
  votes: {
    guilty: number
    notGuilty: number
  }
}

// 스크래핑 소스
export interface ScrapingSource {
  name: string
  url: string
  type: 'news' | 'complaint' | 'sns'
  selector: {
    list: string
    title: string
    content: string
    date?: string
  }
}

// 원본 데이터
export interface RawDataItem {
  title: string
  content: string
  url?: string
  date?: Date
  source: string
}
