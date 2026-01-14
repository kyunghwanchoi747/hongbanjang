import { NextResponse } from 'next/server'

export const runtime = 'edge'

// 인메모리 저장소 (Edge에서는 KV 사용 권장, MVP에서는 시뮬레이션)
const votes: Record<string, { guilty: number; notGuilty: number }> = {}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { caseId, verdict } = body

    if (!votes[caseId]) {
      votes[caseId] = { guilty: 0, notGuilty: 0 }
    }

    if (verdict === 'guilty') {
      votes[caseId].guilty++
    } else {
      votes[caseId].notGuilty++
    }

    return NextResponse.json({
      success: true,
      votes: votes[caseId],
    })
  } catch {
    return NextResponse.json(
      { error: '투표 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('caseId')

  if (!caseId) {
    return NextResponse.json(
      { error: 'caseId가 필요합니다.' },
      { status: 400 }
    )
  }

  const caseVotes = votes[caseId] || { guilty: 0, notGuilty: 0 }
  return NextResponse.json({ votes: caseVotes })
}
