import { NextResponse } from 'next/server'
import { generateSimulatedData } from '@/scrapers/scraper'
import { CaseStructurizer } from '@/scrapers/structurizer'
import { CITY_CONFIG } from '@/lib/config'

// GET: 재판 목록 조회
export async function GET() {
  try {
    // 시뮬레이션 데이터 생성
    const rawData = generateSimulatedData(CITY_CONFIG.name)
    const structurizer = new CaseStructurizer()

    const cases = rawData.map((data, index) => {
      const structured = structurizer.structureWithRules(data)
      return {
        id: `2024-${CITY_CONFIG.code}-${String(index + 1).padStart(3, '0')}`,
        caseNumber: `2024-${CITY_CONFIG.code}-${String(index + 1).padStart(3, '0')}`,
        title: structured.caseName,
        defendant: structured.defendant,
        issue: structured.issue,
        relatedLaws: structured.relatedLaws,
        status: index === 0 ? 'IN_TRIAL' : index === 1 ? 'VOTING' : 'PENDING',
        guiltyVotes: Math.floor(Math.random() * 150),
        notGuiltyVotes: Math.floor(Math.random() * 100),
        createdAt: data.date || new Date(),
      }
    })

    return NextResponse.json({ cases })
  } catch (error) {
    console.error('재판 목록 조회 실패:', error)
    return NextResponse.json(
      { error: '재판 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 재판 생성
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, source } = body

    const structurizer = new CaseStructurizer()
    const structured = await structurizer.structureWithAI({
      title,
      content,
      source: source || `${CITY_CONFIG.name} 민원`,
    })

    const newCase = {
      id: `2024-${CITY_CONFIG.code}-${Date.now()}`,
      caseNumber: `2024-${CITY_CONFIG.code}-${String(Date.now()).slice(-4)}`,
      ...structured,
      status: 'PENDING',
      guiltyVotes: 0,
      notGuiltyVotes: 0,
      createdAt: new Date(),
    }

    return NextResponse.json({ case: newCase })
  } catch (error) {
    console.error('재판 생성 실패:', error)
    return NextResponse.json(
      { error: '재판을 생성하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
