import { NextResponse } from 'next/server'

export const runtime = 'edge'

const CITY_NAME = process.env.CITY_NAME || '성남시'
const CITY_CODE = process.env.CITY_CODE || 'seongnam'

// 시뮬레이션 데이터
const MOCK_CASES = [
  {
    id: `2024-${CITY_CODE}-001`,
    caseNumber: `2024-${CITY_CODE}-001`,
    title: `${CITY_NAME} 분당구 정자동 보도블록 파손 방치`,
    defendant: '도로관리과',
    issue: '정자동 카페거리 보도블록이 6개월째 파손 방치',
    relatedLaws: ['도로법', '민원처리에 관한 법률'],
    status: 'IN_TRIAL',
    guiltyVotes: 127,
    notGuiltyVotes: 43,
    createdAt: '2024-01-15',
  },
  {
    id: `2024-${CITY_CODE}-002`,
    caseNumber: `2024-${CITY_CODE}-002`,
    title: `${CITY_NAME} 모란시장 주차장 문제`,
    defendant: '도시교통과',
    issue: '주차장 부족으로 상인 매출 감소 및 주민 불편',
    relatedLaws: ['주차장법', '지방자치법'],
    status: 'VOTING',
    guiltyVotes: 89,
    notGuiltyVotes: 56,
    createdAt: '2024-01-20',
  },
  {
    id: `2024-${CITY_CODE}-003`,
    caseNumber: `2024-${CITY_CODE}-003`,
    title: `${CITY_NAME} 공립어린이집 대기 장기화`,
    defendant: '보육정책과',
    issue: '어린이집 대기 1년 이상, 맞벌이 부부 양육 한계',
    relatedLaws: ['영유아보육법', '지방자치법'],
    status: 'PENDING',
    guiltyVotes: 0,
    notGuiltyVotes: 0,
    createdAt: '2024-02-01',
  },
]

export async function GET() {
  return NextResponse.json({ cases: MOCK_CASES })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, defendant, issue } = body

    const newCase = {
      id: `2024-${CITY_CODE}-${Date.now()}`,
      caseNumber: `2024-${CITY_CODE}-${String(Date.now()).slice(-4)}`,
      title,
      defendant: defendant || '시정담당관실',
      issue,
      relatedLaws: ['지방자치법'],
      status: 'PENDING',
      guiltyVotes: 0,
      notGuiltyVotes: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ case: newCase })
  } catch {
    return NextResponse.json(
      { error: '재판을 생성하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
